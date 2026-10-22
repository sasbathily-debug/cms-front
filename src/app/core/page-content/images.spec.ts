import { srcsetFor } from './images';

describe('srcsetFor', () => {
  it('donne les deux tailles des photos du site', () => {
    expect(srcsetFor('/img/dr-fall-sourire-640.webp')).toContain('1024w');
    expect(srcsetFor('/img/dr-fall-640.webp')).toContain('1080w');
    expect(srcsetFor('/img/dr-fall-conference-640.webp')).toContain('952w');
  });

  it('ne propose rien pour une photo ajoutée depuis l’admin', () => {
    expect(srcsetFor('https://res.cloudinary.com/x/image/upload/v1/a.jpg')).toBeNull();
    expect(srcsetFor('')).toBeNull();
    expect(srcsetFor(null)).toBeNull();
    expect(srcsetFor('/img/dr-fall.webp')).toBeNull();
  });
});
