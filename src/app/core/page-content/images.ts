import { Pipe, PipeTransform } from '@angular/core';

/** Photos du site disponibles en deux tailles : le navigateur choisit la plus légère qui convient. */
const SRCSETS: Record<string, string> = {
  '/img/dr-fall-640.webp': '/img/dr-fall-640.webp 640w, /img/dr-fall.webp 1080w',
  '/img/dr-fall-sourire-640.webp':
    '/img/dr-fall-sourire-640.webp 640w, /img/dr-fall-sourire.webp 1024w',
  '/img/dr-fall-conference-640.webp':
    '/img/dr-fall-conference-640.webp 640w, /img/dr-fall-conference.webp 952w',
};

/** Les deux tailles d'une photo du site ; `null` pour une photo ajoutée depuis l'admin (déjà optimisée à l'envoi). */
export function srcsetFor(url: string | null | undefined): string | null {
  return (url && SRCSETS[url]) || null;
}

@Pipe({ name: 'srcset' })
export class SrcsetPipe implements PipeTransform {
  transform(url: string | null | undefined): string | null {
    return srcsetFor(url);
  }
}
