import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitreLignes } from './titre-lignes';

@Component({
  imports: [TitreLignes],
  template: `<h2 [appTitreLignes]="texte()" id="t"></h2>`,
})
class Hote {
  texte = signal('Un cabinet où l’on prend le temps');
}

describe('TitreLignes', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('écrit le titre en texte normal et le décrit pour les lecteurs d’écran', () => {
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    const h2 = (fixture.nativeElement as HTMLElement).querySelector('h2')!;
    expect(h2.textContent).toBe('Un cabinet où l’on prend le temps');
    expect(h2.getAttribute('aria-label')).toBe('Un cabinet où l’on prend le temps');
  });

  it('suit le texte quand il change', () => {
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    fixture.componentInstance.texte.set('Un autre titre');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h2')!.textContent).toBe(
      'Un autre titre',
    );
  });

  it('ne cache rien quand le visiteur a demandé moins de mouvement', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('reduce'),
      addEventListener() {},
      removeEventListener() {},
    }));
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    await fixture.whenStable();
    const h2 = (fixture.nativeElement as HTMLElement).querySelector('h2')!;
    expect(h2.classList.contains('lignes-pretes')).toBe(false);
    expect(h2.querySelector('.ligne')).toBeNull();
  });
});
