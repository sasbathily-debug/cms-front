import { statusAt } from './open-now';
import { DEFAULT_DAYS } from '../../core/opening-hours';

// Dakar est à UTC+0 toute l'année : l'heure UTC est l'heure du cabinet.
describe('statusAt', () => {
  it('est ouvert un lundi à 10h', () => {
    expect(statusAt(new Date('2026-10-19T10:00:00Z'))).toEqual({
      open: true,
      text: "Ouvert · jusqu'à 17h30",
    });
  });

  it('ouvre à 9h00 un lundi à 8h', () => {
    expect(statusAt(new Date('2026-10-19T08:00:00Z')).text).toBe('Fermé · ouvre à 9h00');
  });

  it('est fermé à 17h30 pile et annonce le lendemain', () => {
    expect(statusAt(new Date('2026-10-19T17:30:00Z'))).toEqual({
      open: false,
      text: 'Fermé · réouverture demain 9h00',
    });
  });

  it('rouvre samedi après la fermeture du vendredi', () => {
    expect(statusAt(new Date('2026-10-23T18:00:00Z')).text).toBe('Fermé · réouverture demain 9h00');
  });

  it('ferme à 13h le samedi et rouvre lundi', () => {
    expect(statusAt(new Date('2026-10-24T13:00:00Z')).text).toBe('Fermé · réouverture lundi 9h00');
  });

  it('est ouvert le samedi matin', () => {
    expect(statusAt(new Date('2026-10-24T11:59:00Z')).open).toBe(true);
  });

  it('est fermé le dimanche et rouvre demain', () => {
    expect(statusAt(new Date('2026-10-25T12:00:00Z')).text).toBe('Fermé · réouverture demain 9h00');
  });

  it("lit l'heure de Dakar même si le visiteur est ailleurs", () => {
    // 11h en UTC+1 (Paris l'hiver) = 10h à Dakar : ouvert.
    expect(statusAt(new Date('2026-12-07T10:00:00Z')).open).toBe(true);
  });

  it('suit les horaires fournis par l’admin', () => {
    const days = DEFAULT_DAYS.map((d) =>
      d.dayOfWeek === 1 ? { ...d, opens: '14:00', closes: '18:00' } : d,
    );
    expect(statusAt(new Date('2026-10-19T10:00:00Z'), days).text).toBe('Fermé · ouvre à 14h00');
    expect(statusAt(new Date('2026-10-19T15:00:00Z'), days).text).toBe("Ouvert · jusqu'à 18h00");
  });

  it('annonce la prochaine ouverture quand le samedi est fermé', () => {
    const days = DEFAULT_DAYS.map((d) =>
      d.dayOfWeek === 6 ? { ...d, opens: null, closes: null, closed: true } : d,
    );
    expect(statusAt(new Date('2026-10-23T18:00:00Z'), days).text).toBe(
      'Fermé · réouverture lundi 9h00',
    );
  });
});
