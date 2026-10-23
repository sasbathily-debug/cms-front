import {
  DEFAULT_DAYS,
  formatTime,
  groupDays,
  hoursSentence,
  longLabel,
  shortLabel,
} from './opening-hours';

describe('opening-hours', () => {
  it('écrit les heures à la française', () => {
    expect(formatTime('09:00')).toBe('9h00');
    expect(formatTime('17:30')).toBe('17h30');
    expect(formatTime('13:05')).toBe('13h05');
  });

  it('regroupe lundi à vendredi, puis samedi, puis dimanche', () => {
    const groups = groupDays(DEFAULT_DAYS);
    expect(groups.map((g) => [shortLabel(g), g.closed ? 'fermé' : g.hours])).toEqual([
      ['Lun – Ven', '9h00 – 17h30'],
      ['Samedi', '9h00 – 13h00'],
      ['Dimanche', 'fermé'],
    ]);
    expect(groups.map(longLabel)).toEqual(['Lundi au vendredi', 'Samedi', 'Dimanche']);
  });

  it('sépare les jours quand un jour de la semaine diffère', () => {
    const days = DEFAULT_DAYS.map((d) =>
      d.dayOfWeek === 3 ? { ...d, opens: '10:00', closes: '14:00' } : d,
    );
    expect(groupDays(days).map(shortLabel)).toEqual([
      'Lun – Mar',
      'Mercredi',
      'Jeu – Ven',
      'Samedi',
      'Dimanche',
    ]);
  });

  it('range les jours dans l’ordre même si la liste est mélangée', () => {
    const shuffled = [...DEFAULT_DAYS].reverse();
    expect(groupDays(shuffled).map(shortLabel)).toEqual(['Lun – Ven', 'Samedi', 'Dimanche']);
  });

  it('traite un jour « ouvert » sans heures comme fermé', () => {
    const days = DEFAULT_DAYS.map((d) =>
      d.dayOfWeek === 6 ? { ...d, opens: null, closes: null } : d,
    );
    const saturday = groupDays(days).find((g) => g.from === 6);
    expect(saturday?.closed).toBe(true);
  });

  it('fait une phrase sans les jours fermés', () => {
    expect(hoursSentence(groupDays(DEFAULT_DAYS))).toBe(
      'du lundi au vendredi de 9h00 à 17h30 et le samedi de 9h00 à 13h00',
    );
  });
});
