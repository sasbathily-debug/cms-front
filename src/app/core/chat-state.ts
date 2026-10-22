import { Service, signal } from '@angular/core';

/** État partagé de l'assistant : ouvert ou non, et si une page propose déjà son propre bouton de chat. */
@Service()
export class ChatState {
  readonly opened = signal(false);
  /** Vrai quand la page affiche le chat dans sa barre fixe : la bulle flottante se retire sur téléphone. */
  readonly onBar = signal(false);

  open(): void {
    this.opened.set(true);
  }
}
