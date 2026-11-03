import { ChiffrePipe } from './chiffre.pipe';

describe('ChiffrePipe', () => {
  const pipe = new ChiffrePipe();

  it('sépare le chiffre de son unité par une espace insécable', () => {
    expect(pipe.transform('5ans')).toBe('5 ans');
  });

  it('laisse intacts les textes déjà corrects', () => {
    expect(pipe.transform('5 ans')).toBe('5 ans');
    expect(pipe.transform('1000+')).toBe('1000+');
    expect(pipe.transform('[Diplôme]')).toBe('[Diplôme]');
  });

  it('accepte une valeur absente', () => {
    expect(pipe.transform(undefined)).toBe('');
  });
});
