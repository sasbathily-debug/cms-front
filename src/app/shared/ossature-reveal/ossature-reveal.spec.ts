import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OssatureReveal } from './ossature-reveal';

@Component({
  imports: [OssatureReveal],
  template: `<app-ossature-reveal
    photo="/img/dr-fall-640.webp"
    trait="/img/dr-fall-trait.webp"
    alt="La doctoresse"
  />`,
})
class SansScene {}

@Component({
  imports: [OssatureReveal],
  template: `<div data-reveal-scene>
    <div>
      <app-ossature-reveal
        photo="/img/dr-fall-640.webp"
        trait="/img/dr-fall-trait.webp"
        alt="La doctoresse"
      />
    </div>
  </div>`,
})
class AvecScene {}

describe('OssatureReveal', () => {
  afterEach(() => vi.unstubAllGlobals());

  it("affiche la photo seule, sans effet, quand elle n'est pas dans une scène de défilement", async () => {
    const fixture = TestBed.createComponent(SansScene);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('img')?.getAttribute('src')).toBe('/img/dr-fall-640.webp');
    expect(root.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('La doctoresse');
  });

  it('affiche la photo seule quand le visiteur a demandé moins de mouvement', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      addEventListener() {},
      removeEventListener() {},
    }));
    const fixture = TestBed.createComponent(AvecScene);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('img')).not.toBeNull();
  });
});
