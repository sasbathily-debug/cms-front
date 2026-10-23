import { Component, ElementRef, output, signal, viewChildren } from '@angular/core';

/** Les six cases d'un code à usage unique : saisie chiffre par chiffre, flèches, retour arrière et collage du code entier. */
@Component({
  selector: 'app-otp-boxes',
  host: { class: 'block w-full' },
  template: `
    <div class="flex gap-2.5" role="group" aria-label="Code à 6 chiffres" (paste)="onPaste($event)">
      @for (digit of digits(); track $index; let i = $index) {
        <input
          #box
          type="text"
          inputmode="numeric"
          maxlength="1"
          autocomplete="one-time-code"
          [value]="digit"
          (input)="onInput(i, $event)"
          (keydown)="onKeydown(i, $event)"
          [attr.aria-label]="'Chiffre ' + (i + 1)"
          class="h-[62px] w-0 min-w-0 flex-1 rounded-[14px] border-[1.5px] border-line-strong bg-surface text-center font-display text-[28px] font-bold text-fg outline-none transition focus:border-accent-500 focus:shadow-[0_0_0_4px_rgba(224,135,63,0.2)]"
        />
      }
    </div>
  `,
})
export class OtpBoxes {
  /** Le code tel qu'il est saisi : moins de 6 chiffres tant que les cases ne sont pas toutes remplies. */
  readonly codeChange = output<string>();

  readonly digits = signal<string[]>(['', '', '', '', '', '']);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  private setDigits(next: string[]): void {
    this.digits.set(next);
    this.codeChange.emit(next.join(''));
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    input.value = value;
    const next = [...this.digits()];
    next[index] = value;
    this.setDigits(next);
    if (value && index < 5) {
      this.boxes()[index + 1]?.nativeElement.focus();
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      this.boxes()[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.boxes()[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.boxes()[index + 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) {
      return;
    }
    event.preventDefault();
    this.setDigits(['', '', '', '', '', ''].map((_, i) => pasted[i] ?? ''));
    this.boxes()[Math.min(pasted.length, 5)]?.nativeElement.focus();
  }

  /** Vide les six cases (après un code refusé, par exemple) et remet le curseur sur la première. */
  clear(): void {
    this.setDigits(['', '', '', '', '', '']);
    this.boxes()[0]?.nativeElement.focus();
  }
}
