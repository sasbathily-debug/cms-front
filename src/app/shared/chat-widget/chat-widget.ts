import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteSettings } from '../../core/services/site-settings';
import { ChatState } from '../../core/chat-state';
import { ChatIcon } from './chat-icon';

interface ChatAction {
  label: string;
  url: string;
}

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  actions?: ChatAction[];
  suggestions?: string[];
}

interface ChatReply {
  answer: string;
  actions: ChatAction[];
  suggestions: string[];
}

/** Pages où l'assistant n'a pas sa place : connexion, création de compte, espace professionnel. */
const HIDDEN_PREFIXES = ['/admin', '/login', '/register', '/verify-otp', '/set-password'];

const MAX_LENGTH = 500;
const NUDGE_AFTER_MS = 20_000;
const NUDGE_KEY = 'chat-nudged';

/** Le stockage peut être indisponible (navigation privée) : on ne s'en sert que pour ne pas répéter le signal. */
function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Bulle d'aide en bas à droite. Elle interroge le chatbot du cabinet (réponses tirées de la FAQ validée,
 * aucun conseil médical, aucun message conservé). Si le service ne répond pas, elle renvoie vers le
 * cabinet plutôt que de laisser le visiteur sans issue.
 */
@Component({
  selector: 'app-chat-widget',
  imports: [ChatIcon],
  styleUrl: './chat-widget.css',
  templateUrl: './chat-widget.html',
  host: { '(document:keydown.escape)': 'close()' },
})
export class ChatWidget {
  private readonly router = inject(Router);
  protected readonly site = inject(SiteSettings);

  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly maxLength = MAX_LENGTH;
  private readonly state = inject(ChatState);
  protected readonly opened = this.state.opened;
  protected readonly onBar = this.state.onBar;
  /** Petit signal discret, une seule fois par visite, pour rappeler que l'assistant existe. */
  protected readonly nudge = signal(false);
  protected readonly loading = signal(false);
  protected readonly draft = signal('');
  protected readonly messages = signal<ChatMessage[]>([]);

  /** Questions proposées à l'ouverture : uniquement des réponses déjà validées par le cabinet. */
  protected readonly starters = [
    "Quels sont vos horaires d'ouverture ?",
    'Comment prendre rendez-vous ?',
    'Où se trouve le cabinet ?',
    'Quelle est la spécialité de la doctoresse ?',
  ];

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly visible = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    return !HIDDEN_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    effect(() => {
      if (this.opened()) {
        this.nudge.set(false);
        setTimeout(() => this.field()?.nativeElement.focus());
      }
    });
    afterNextRender(() => {
      if (storage()?.getItem(NUDGE_KEY)) return;
      let hide: ReturnType<typeof setTimeout> | undefined;
      const show = setTimeout(() => {
        if (this.opened() || !this.visible()) return;
        storage()?.setItem(NUDGE_KEY, '1');
        this.nudge.set(true);
        hide = setTimeout(() => this.nudge.set(false), 7000);
      }, NUDGE_AFTER_MS);
      destroyRef.onDestroy(() => {
        clearTimeout(show);
        clearTimeout(hide);
      });
    });
  }

  protected toggle(): void {
    this.opened() ? this.close() : this.open();
  }

  protected open(): void {
    this.nudge.set(false);
    this.opened.set(true);
    setTimeout(() => this.field()?.nativeElement.focus());
  }

  protected close(): void {
    this.opened.set(false);
  }

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected submit(): void {
    this.ask(this.draft());
  }

  protected ask(raw: string): void {
    const text = raw.trim().slice(0, MAX_LENGTH);
    if (!text || this.loading()) return;
    this.draft.set('');
    this.push({ from: 'user', text });
    this.loading.set(true);
    void this.fetchReply(text)
      .then((reply) =>
        this.push({
          from: 'bot',
          text: reply.answer,
          actions: reply.actions,
          suggestions: reply.suggestions,
        }),
      )
      .catch((error: unknown) => this.push(this.unavailable(error)))
      .finally(() => {
        this.loading.set(false);
        setTimeout(() => this.field()?.nativeElement.focus());
      });
  }

  private async fetchReply(message: string): Promise<ChatReply> {
    if (!environment.chatbotUrl) throw new Error('indisponible');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${environment.chatbotUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
      if (response.status === 429) throw new Error('limite');
      if (!response.ok) throw new Error('indisponible');
      const data = (await response.json()) as Partial<ChatReply>;
      return {
        answer: data.answer ?? '',
        actions: data.actions ?? [],
        suggestions: data.suggestions ?? [],
      };
    } finally {
      clearTimeout(timer);
    }
  }

  private unavailable(error: unknown): ChatMessage {
    const tooMany = error instanceof Error && error.message === 'limite';
    return {
      from: 'bot',
      text: tooMany
        ? 'Vous écrivez un peu vite. Patientez une minute avant de poser une nouvelle question.'
        : `L'assistant n'est pas disponible pour le moment. Vous pouvez joindre le cabinet au ${this.site.phone()}.`,
      actions: tooMany
        ? []
        : [
            { label: 'Appeler le cabinet', url: this.site.telHref() },
            ...(this.site.whatsappHref()
              ? [{ label: 'Écrire sur WhatsApp', url: this.site.whatsappHref() }]
              : []),
          ],
    };
  }

  private push(message: ChatMessage): void {
    this.messages.update((list) => [...list, message]);
    setTimeout(() => {
      const el = this.list()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  protected isExternal(url: string): boolean {
    return /^https?:/.test(url);
  }
}
