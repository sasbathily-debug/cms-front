import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SchemaBalance } from '../schema-balance/schema-balance';
import { SchemaThyroide } from '../schema-thyroide/schema-thyroide';
import { SchemaOnglets } from './schema-onglets';

const CARTES = [
  { title: 'Un', text: 'a' },
  { title: 'Deux', text: 'b' },
  { title: 'Trois', text: 'c' },
  { title: 'Quatre', text: 'd' },
];

@Component({
  imports: [SchemaOnglets, SchemaThyroide, SchemaBalance],
  template: `
    <app-schema-onglets [libelles]="['A', 'B', 'C', 'D']" [cartes]="cartes" [(actif)]="etat">
      <app-schema-thyroide [etat]="etat()" />
      <app-schema-balance [etat]="etat()" />
    </app-schema-onglets>
  `,
})
class Hote {
  cartes = CARTES;
  etat = signal(0);
}

describe('schémas à onglets', () => {
  function monte() {
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    return fixture;
  }

  it('affiche le texte de la situation choisie et le bouton enfoncé', () => {
    const fixture = monte();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('h3')?.textContent).toBe('Un');
    const boutons = Array.from(root.querySelectorAll('button'));
    boutons[2].click();
    fixture.detectChanges();
    expect(root.querySelector('h3')?.textContent).toBe('Trois');
    expect(boutons[2].getAttribute('aria-pressed')).toBe('true');
    expect(boutons[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('décrit chaque situation du schéma de la thyroïde et de la balance en texte', () => {
    const fixture = monte();
    const root: HTMLElement = fixture.nativeElement;
    const descriptions = new Set<string>();
    for (let i = 0; i < 4; i++) {
      fixture.componentInstance.etat.set(i);
      fixture.detectChanges();
      const labels = Array.from(root.querySelectorAll('svg[role="img"]')).map(
        (s) => s.getAttribute('aria-label') ?? '',
      );
      expect(labels.every((l) => l.startsWith('Schéma'))).toBe(true);
      labels.forEach((l) => descriptions.add(l));
    }
    expect(descriptions.size).toBe(8);
  });

  it("fait pencher la balance vers ce qu'on mange quand le sommeil ou le stress s'en mêlent", () => {
    const fixture = monte();
    const root: HTMLElement = fixture.nativeElement;
    const rotation = () => root.querySelector<SVGGElement>('.fleau')!.style.transform;
    expect(rotation()).toBe('rotate(0deg)');
    fixture.componentInstance.etat.set(1);
    fixture.detectChanges();
    expect(rotation()).toBe('rotate(-14deg)');
  });
});
