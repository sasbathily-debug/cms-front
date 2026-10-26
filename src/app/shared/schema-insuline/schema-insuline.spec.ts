import { TestBed } from '@angular/core/testing';
import { SchemaInsuline } from './schema-insuline';

describe('SchemaInsuline', () => {
  const cartes = [
    { title: 'Quand tout va bien', text: 'La clé tourne.' },
    { title: 'Type 1 : il manque la clé', text: 'Plus d’insuline.' },
    { title: 'Type 2 : la clé tourne mal', text: 'L’insuline agit mal.' },
  ];

  function montre() {
    const fixture = TestBed.createComponent(SchemaInsuline);
    fixture.componentRef.setInput('cartes', cartes);
    fixture.detectChanges();
    return fixture;
  }
  const bouton = (root: HTMLElement, libelle: string) =>
    Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.trim() === libelle)!;

  it('commence par « Tout va bien » : trois clés, une porte grande ouverte', () => {
    const root: HTMLElement = montre().nativeElement;
    expect(root.querySelector('h3')?.textContent).toBe('Quand tout va bien');
    expect(root.querySelectorAll('.cle').length).toBe(3);
    expect(bouton(root, 'Tout va bien').getAttribute('aria-pressed')).toBe('true');
  });

  it('type 1 : plus de clé, le texte et la description changent', () => {
    const fixture = montre();
    const root: HTMLElement = fixture.nativeElement;
    bouton(root, 'Type 1').click();
    fixture.detectChanges();
    expect(root.querySelector('h3')?.textContent).toBe('Type 1 : il manque la clé');
    expect(root.querySelectorAll('.cle').length).toBe(0);
    expect(root.querySelector('svg')?.getAttribute('aria-label')).toContain('reste fermée');
  });

  it('type 2 : les clés sont là mais la porte est à peine ouverte', () => {
    const fixture = montre();
    const root: HTMLElement = fixture.nativeElement;
    bouton(root, 'Type 2').click();
    fixture.detectChanges();
    expect(root.querySelector('h3')?.textContent).toBe('Type 2 : la clé tourne mal');
    expect(root.querySelectorAll('.cle').length).toBe(3);
    expect(root.querySelector('svg')?.getAttribute('aria-label')).toContain('à peine');
  });
});
