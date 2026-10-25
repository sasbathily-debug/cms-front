import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NextSlot, SlotTicket as Ticket } from '../../core/services/next-slot';
import { SlotTicket } from './slot-ticket';

@Component({
  imports: [SlotTicket],
  template: `<app-slot-ticket><button id="repli">Prendre rendez-vous</button></app-slot-ticket>`,
})
class Hote {}

describe('SlotTicket', () => {
  const ticket = signal<Ticket | null>(null);

  beforeEach(() => {
    ticket.set(null);
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: NextSlot, useValue: { ticket } }],
    });
  });

  it('affiche l’étiquette du créneau, sans le contenu de repli, quand un créneau est libre', () => {
    ticket.set({ jour: 'LUN', numero: '26', phrase: 'lundi à 9 h' });
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.textContent).toContain('lundi à 9 h');
    expect(root.querySelector('#repli')).toBeNull();
  });

  it('affiche le contenu de repli quand aucun créneau n’est libre', () => {
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('#repli')).not.toBeNull();
    expect(root.querySelector('a')).toBeNull();
  });
});
