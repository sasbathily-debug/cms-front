import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrentUserStore } from './core/services/current-user-store';
import { Reveal } from './core/reveal';
import { ChatWidget } from './shared/chat-widget/chat-widget';

@Component({
  imports: [RouterOutlet, ChatWidget],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('projet-frontend');

  constructor() {
    inject(CurrentUserStore);
    inject(Reveal);
  }
}
