import { icsFile } from './calendar';

describe('fichier agenda (.ics)', () => {
  const now = new Date('2026-11-03T08:00:00Z');
  const ics = icsFile(
    {
      date: '2026-11-10',
      time: '09:00:00',
      title: 'Rendez-vous, Dr Fall',
      location: 'Cité Keur Gorgui, Dakar',
      description: 'Pour déplacer ou annuler : +221 77 226 39 06',
    },
    now,
  );

  it("écrit l'heure de Dakar telle quelle (UTC+0) et une durée de 30 minutes", () => {
    expect(ics).toContain('DTSTART:20261110T090000Z');
    expect(ics).toContain('DTEND:20261110T093000Z');
  });

  it('échappe les virgules et sépare les lignes par CRLF', () => {
    expect(ics).toContain('SUMMARY:Rendez-vous\\, Dr Fall');
    expect(ics).toContain('BEGIN:VCALENDAR\r\n');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('accepte une heure sans secondes', () => {
    expect(icsFile({ date: '2026-11-10', time: '17:30', title: 'x' }, now)).toContain(
      'DTSTART:20261110T173000Z',
    );
  });
});
