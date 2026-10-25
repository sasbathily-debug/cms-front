import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MotsLumineux } from './mots-lumineux';

@Component({
  imports: [MotsLumineux],
  template: `<div data-reveal-scene id="scene">
    <div><app-mots-lumineux texte="Un cabinet où l'on prend le temps" /></div>
  </div>`,
})
class AvecScene {}

describe('MotsLumineux', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('découpe la phrase en mots, en gardant les espaces', () => {
    const fixture = TestBed.createComponent(AvecScene);
    fixture.detectChanges();
    const mots = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.mot')).map(
      (m) => m.textContent,
    );
    expect(mots).toEqual(['Un ', 'cabinet ', 'où ', "l'on ", 'prend ', 'le ', 'temps']);
  });

  it("n'active pas l'effet (phrase blanche) sans observateur de défilement", async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const fixture = TestBed.createComponent(AvecScene);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('#scene')
        ?.hasAttribute('data-mots-actif'),
    ).toBe(false);
  });

  it("n'active pas l'effet quand le visiteur a demandé moins de mouvement", async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('reduce'),
      addEventListener() {},
      removeEventListener() {},
    }));
    const fixture = TestBed.createComponent(AvecScene);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('#scene')
        ?.hasAttribute('data-mots-actif'),
    ).toBe(false);
  });

  it("active l'effet dans une scène de défilement et le retire à la destruction", async () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    const fixture = TestBed.createComponent(AvecScene);
    fixture.detectChanges();
    await fixture.whenStable();
    const scene = (fixture.nativeElement as HTMLElement).querySelector('#scene')!;
    expect(scene.hasAttribute('data-mots-actif')).toBe(true);
    fixture.destroy();
    expect(scene.hasAttribute('data-mots-actif')).toBe(false);
  });
});
