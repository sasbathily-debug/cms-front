import { SPECIALTIES } from './specialties';
import { INTENTS, bookingQuery } from './site-nav';

describe('menu « Je viens pour… »', () => {
  it('formule chaque spécialité du site, dans le même ordre', () => {
    expect(INTENTS.map((i) => i.key)).toEqual(SPECIALTIES.map((s) => s.key));
  });

  it('préremplit le motif quand il existe dans le formulaire, et toujours le sujet', () => {
    const nutrition = INTENTS.find((i) => i.key === 'nu')!;
    expect(bookingQuery(nutrition)).toEqual({ motif: 'Nutrition', sujet: 'mon alimentation' });
    const diabete = INTENTS.find((i) => i.key === 'di')!;
    expect(bookingQuery(diabete)).toEqual({ sujet: 'mon diabète' });
  });
});
