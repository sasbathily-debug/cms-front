import { Seat } from './doodle-footer.logic';

// Les quatre personnages et les petits dessins qui tombent. Chaque personnage est dessiné dans ses propres unités :
// base au point (0, 0), le haut est négatif, environ 144 unités pour la hauteur des majuscules. Les yeux sont décrits
// à part pour que le composant les oriente et les fasse cligner. Le contenu est écrit ici, dans le dépôt : il n'est
// jamais construit à partir d'une donnée venue de l'extérieur.

export type CrewKind = 'pomme' | 'goutte' | 'thyroide' | 'coeur';
export type DoodleKind = 'goutte' | 'pomme' | 'coeur' | 'etoile' | 'eclat' | 'interro';

export interface Eye {
  x: number;
  y: number;
  /** Rayon du blanc de l'œil ; 0 = pupille seule. */
  r: number;
  pupil: number;
  /** Déplacement maximal de la pupille. */
  max: number;
}

export interface Art {
  /** Taille par rapport aux lettres. */
  k: number;
  box: { l: number; r: number; t: number; b: number };
  eyes: Eye[];
  seat: Seat;
  /** Mouvement permanent (classe CSS). */
  idle?: string;
  body: string;
  /** Dessiné par-dessus la lettre (les mains du personnage qui se cache derrière). */
  front?: string;
}

export interface CrewMember {
  kind: CrewKind;
  /** Rang de la lettre du mot sur laquelle il se trouve. */
  letter: number;
  seat: Seat;
  /** Décalage le long de la lettre, en largeurs de lettre. */
  offset: number;
  name: string;
  /** Ce qu'il dit quand on le touche. Jamais d'avis médical. */
  says: string;
}

export const ART: Record<CrewKind, Art> = {
  pomme: {
    k: 1,
    box: { l: -62, r: 62, t: -114, b: 6 },
    seat: 'front',
    eyes: [
      { x: -15, y: -56, r: 8.5, pupil: 3.8, max: 3.8 },
      { x: 15, y: -56, r: 8.5, pupil: 3.8, max: 3.8 },
    ],
    body: `
      <ellipse class="dcf-shadow" cx="0" cy="2" rx="46" ry="5"/>
      <path d="M-31 -6 C-35 -14 -14 -17 -10 -8 C-8 -1 -25 3 -31 -6 Z"/>
      <path d="M31 -6 C35 -14 14 -17 10 -8 C8 -1 25 3 31 -6 Z"/>
      <path d="M0 -84 C-10 -95 -46 -96 -51 -62 C-56 -30 -36 -4 -18 -5 C-8 -6 -5 -4 0 -4 C5 -4 8 -6 18 -5 C36 -4 56 -30 51 -62 C46 -96 10 -95 0 -84 Z"/>
      <path d="M34 -86 C54 -66 50 -26 24 -8 C36 -30 38 -60 26 -88 Z" fill="url(#dcf-hatch)" stroke="none"/>
      <path class="n thick" d="M0 -84 C0 -92 4 -100 9 -105"/>
      <path class="a" d="M6 -98 C16 -113 33 -111 38 -104 C32 -94 17 -91 6 -98 Z"/>
      <path class="n thin" d="M10 -99 C18 -103 26 -104 33 -104"/>
      <path class="n" d="M-51 -46 C-66 -42 -70 -26 -63 -17"/>
      <path class="n" d="M51 -48 C64 -54 68 -68 62 -78"/>
      <circle cx="-64" cy="-14" r="5"/><circle cx="61" cy="-82" r="5"/>
      <path class="n" d="M-9 -34 C-3 -27 3 -27 9 -34"/>
      <path class="n thin" d="M-28 -40 l-4 -1 M28 -40 l4 -1"/>`,
  },
  goutte: {
    k: 1.2,
    box: { l: -42, r: 48, t: -92, b: 42 },
    seat: 'top',
    idle: 'dcf-bob',
    eyes: [
      { x: -12, y: -32, r: 7.5, pupil: 3.4, max: 3.2 },
      { x: 12, y: -32, r: 7.5, pupil: 3.4, max: 3.2 },
    ],
    body: `
      <path class="n" d="M-12 0 L-12 24 M12 0 L12 24"/>
      <path d="M-20 24 C-20 20 -6 20 -6 25 C-6 29 -18 30 -20 24 Z"/>
      <path d="M20 24 C20 20 6 20 6 25 C6 29 18 30 20 24 Z"/>
      <path d="M0 -88 C8 -68 36 -48 36 -24 C36 -6 20 4 0 4 C-20 4 -36 -6 -36 -24 C-36 -48 -8 -68 0 -88 Z"/>
      <path d="M12 -64 C28 -48 40 -34 34 -14 C32 -6 24 -1 16 1 C28 -14 28 -42 12 -64 Z" fill="url(#dcf-hatch)" stroke="none"/>
      <path class="n thin" d="M-24 -42 C-28 -32 -26 -22 -20 -15"/>
      <path class="n" d="M36 -22 C48 -26 52 -40 46 -50"/>
      <circle cx="46" cy="-53" r="5"/>
      <path class="n" d="M-7 -14 C-2 -8 2 -8 7 -14"/>`,
  },
  thyroide: {
    k: 1.25,
    box: { l: -52, r: 52, t: -76, b: 0 },
    seat: 'behind',
    idle: 'dcf-bob',
    eyes: [
      { x: -22, y: -50, r: 6.5, pupil: 3, max: 2.8 },
      { x: 22, y: -50, r: 6.5, pupil: 3, max: 2.8 },
    ],
    body: `
      <path d="M-6 -28 C-12 -60 -36 -76 -46 -64 C-56 -50 -50 -14 -32 -4 C-20 2 -9 -3 -6 -12 Z"/>
      <path d="M6 -28 C12 -60 36 -76 46 -64 C56 -50 50 -14 32 -4 C20 2 9 -3 6 -12 Z"/>
      <path d="M30 -64 C48 -62 52 -34 40 -14 C36 -8 30 -5 24 -3 C36 -22 36 -46 24 -66 Z" fill="url(#dcf-hatch)" stroke="none"/>
      <path class="a" d="M-9 -26 C-4 -31 4 -31 9 -26 L9 -14 C4 -9 -4 -9 -9 -14 Z"/>
      <path class="n" d="M-3 -60 C-6 -70 -10 -76 -16 -80 M3 -60 C6 -70 10 -76 16 -80"/>
      <circle class="k" cx="-17" cy="-82" r="3.4"/><circle class="k" cx="17" cy="-82" r="3.4"/>
      <path class="n" d="M-6 -36 C-2 -31 2 -31 6 -36"/>`,
    front: `<circle cx="-40" cy="-29" r="7.5"/><circle cx="40" cy="-29" r="7.5"/>`,
  },
  coeur: {
    k: 1.15,
    box: { l: -40, r: 40, t: -72, b: 38 },
    seat: 'top',
    eyes: [
      { x: -12, y: -44, r: 7, pupil: 3.2, max: 3 },
      { x: 12, y: -44, r: 7, pupil: 3.2, max: 3 },
    ],
    body: `
      <path class="n" d="M-8 -8 L-11 20 M8 -8 L11 20"/>
      <path d="M-20 20 C-20 16 -6 16 -6 21 C-6 25 -18 26 -20 20 Z"/>
      <path d="M20 20 C20 16 6 16 6 21 C6 25 18 26 20 20 Z"/>
      <path class="a" d="M0 -6 C-10 -14 -36 -30 -36 -48 C-36 -62 -24 -70 -13 -68 C-6 -67 -2 -62 0 -56 C2 -62 6 -67 13 -68 C24 -70 36 -62 36 -48 C36 -30 10 -14 0 -6 Z"/>
      <path d="M14 -64 C30 -60 38 -48 32 -34 C28 -24 18 -16 10 -11 C20 -26 24 -46 14 -64 Z" fill="url(#dcf-hatch)" stroke="none"/>
      <path class="n thin" d="M-26 -58 C-30 -52 -30 -46 -28 -42"/>
      <path class="n" d="M-7 -24 C-2 -19 2 -19 7 -24"/>
      <path class="n" d="M36 -44 C48 -48 52 -60 46 -68"/><circle cx="46" cy="-71" r="5"/>`,
  },
};

export const CREW: CrewMember[] = [
  { kind: 'pomme', letter: 0, seat: 'front', offset: -0.3, name: 'La pomme', says: 'Bienvenue au cabinet !' },
  { kind: 'goutte', letter: 1, seat: 'top', offset: 0, name: 'La goutte', says: 'Un rendez-vous ? C’est par ici.' },
  { kind: 'thyroide', letter: 4, seat: 'behind', offset: 0, name: 'La thyroïde', says: 'Coucou ! Je suis une thyroïde.' },
  { kind: 'coeur', letter: 6, seat: 'top', offset: -0.05, name: 'Le cœur', says: 'On prend soin de vous, ici.' },
];

/** Les personnages de la page 404 : ils se sont perdus sur les chiffres. */
export const CREW_404: CrewMember[] = [
  { kind: 'pomme', letter: 0, seat: 'front', offset: -0.78, name: 'La pomme', says: 'Cette page n’existe pas… ou plus.' },
  { kind: 'coeur', letter: 0, seat: 'top', offset: 0.1, name: 'Le cœur', says: 'On a cherché partout !' },
  { kind: 'goutte', letter: 1, seat: 'top', offset: 0, name: 'La goutte', says: 'Je crois qu’on s’est perdus…' },
  { kind: 'thyroide', letter: 2, seat: 'behind', offset: 0.12, name: 'La thyroïde', says: 'Essayez l’accueil ?' },
];

/** Les petits dessins qui tombent, dans la palette du site (ciel, pêche, orange, menthe), dans une boîte de 32 unités centrée. */
export const DOODLES: Record<DoodleKind, string> = {
  goutte:
    '<path fill="#cfe0f5" d="M0 -13 C4 -5 11 -1 11 5 C11 11 6 14 0 14 C-6 14 -11 11 -11 5 C-11 -1 -4 -5 0 -13 Z"/><path fill="none" stroke-width="1.3" d="M-6 4 C-6 8 -4 10 -1 11"/>',
  pomme:
    '<path fill="#f6ae6b" d="M0 -6 C-4 -10 -12 -9 -12 -1 C-12 8 -6 14 -2 13 C0 12.5 0 12.5 2 13 C6 14 12 8 12 -1 C12 -9 4 -10 0 -6 Z"/><path fill="none" d="M0 -6 C0 -9 2 -12 4 -13"/><path fill="#bde8d2" d="M2 -11 C7 -15 12 -13 13 -11 C10 -8 5 -8 2 -11 Z"/>',
  coeur:
    '<path fill="#e0873f" d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z"/>',
  etoile:
    '<path fill="#ffe2be" d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z"/>',
  interro:
    '<path fill="none" stroke-width="2.6" d="M-5 -7 C-5 -15 6 -15 6 -7 C6 -1 0 -2 0 4"/><circle class="dcf-dot" cx="0" cy="10" r="1.6"/>',
  eclat:
    '<path fill="#cfe0f5" d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z"/>',
};

export const DOODLE_KINDS: DoodleKind[] = ['goutte', 'pomme', 'coeur', 'etoile', 'goutte', 'pomme', 'eclat', 'coeur'];

export const DOODLE_KINDS_404: DoodleKind[] = ['interro', 'goutte', 'pomme', 'interro', 'coeur', 'etoile', 'interro', 'goutte', 'pomme'];
