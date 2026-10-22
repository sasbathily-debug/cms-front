import { PageDef } from '../fields';

/** Les articles eux-mêmes se gèrent dans « Conseils santé » ; ici, les textes autour. */
const defaults = {
  hero: {
    kicker: 'CONSEILS SANTÉ',
    titre: 'Comprendre sa santé, un article à la fois',
    intro:
      'Des textes courts, écrits par la doctoresse, pour mieux vivre avec le diabète, la thyroïde ou votre poids.',
  },
  auteur: {
    kicker: 'ÉCRIT PAR LA DOCTORESSE',
    nom: 'Dr Aissatou Mamadou Fall',
    texte: 'Médecin endocrinologue et nutritionniste à Dakar.',
    lien: 'Découvrir son parcours →',
    photo: '/img/dr-fall-conference-640.webp',
    photoAlt: "Le Dr Aissatou Mamadou Fall, micro à la main, lors d'une intervention publique",
  },
  alaune: {
    kicker: 'À LA UNE · RAMADAN · 6 MIN',
    titre: 'Ramadan et diabète : bien se préparer',
    texte:
      'Peut-on jeûner ? Comment adapter son traitement et son alimentation ? Les questions à poser à votre médecin avant le premier jour.',
    lien: "Lire l'article",
    photo: '/img/photo-2.jpg',
  },
  instagram: {
    titre: 'Suivez le cabinet sur Instagram',
    texte: 'Des conseils courts et des réponses aux questions des patients. @dr_aissatou.m',
    bouton: 'Ouvrir Instagram',
  },
  appel: { titre: "Une question qui n'est pas traitée ici ?" },
};

export type ConseilsSanteContent = typeof defaults;

export const CONSEILS_SANTE: PageDef<ConseilsSanteContent> = {
  slug: 'conseils-sante',
  editable: false,
  title: 'Conseils santé (textes de la page)',
  route: '/conseils-sante',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'En-tête de la page',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'intro', label: 'Présentation', type: 'textarea' },
      ],
    },
    {
      key: 'auteur',
      label: 'Encadré « Écrit par la doctoresse »',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'nom', label: 'Nom', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
        { key: 'lien', label: 'Texte du lien', type: 'text' },
        { key: 'photo', label: 'Photo', type: 'image' },
        {
          key: 'photoAlt',
          label: 'Description de la photo (pour les malvoyants)',
          type: 'text',
        },
      ],
    },
    {
      key: 'alaune',
      label: 'Article à la une (encadré)',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
        { key: 'lien', label: 'Texte du lien', type: 'text' },
        { key: 'photo', label: 'Photo', type: 'image' },
      ],
    },
    {
      key: 'instagram',
      label: 'Encadré Instagram',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'appel',
      label: 'Bandeau du bas de page',
      type: 'group',
      fields: [{ key: 'titre', label: 'Phrase', type: 'text' }],
    },
  ],
};
