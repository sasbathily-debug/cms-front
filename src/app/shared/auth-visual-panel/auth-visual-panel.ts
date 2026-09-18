import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-visual-panel',
  imports: [RouterLink],
  styleUrl: './auth-visual-panel.css',
  templateUrl: './auth-visual-panel.html',
})
export class AuthVisualPanel {
  readonly year = new Date().getFullYear();
}
