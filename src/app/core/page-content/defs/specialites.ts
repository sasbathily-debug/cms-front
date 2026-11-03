import { PageDef } from '../fields';
import { SPECIALTIES } from '../../specialties';

const defaults = {
  hero: {
    kicker: 'SPÉCIALITÉS',
    titre: 'Les maladies que je prends en charge',
    intro:
      "L'endocrinologie s'intéresse aux hormones et au métabolisme. Chaque page explique la maladie, le déroulement du suivi et quand venir sans attendre.",
  },
  aide: {
    titre: 'Vous hésitez sur votre situation ?',
    texte: 'Écrivez-nous ou appelez : nous vous disons si une consultation est adaptée.',
    bouton: 'Prendre rendez-vous',
  },
  cartes: {
    libelleSignes: 'Vous pouvez consulter si…',
    lien: 'Lire la page',
  },
  /** Les six spécialités : leurs textes se modifient ; leur page et leur organe sur la silhouette restent ceux du site. */
  items: SPECIALTIES.map((s) => ({
    sym: s.sym,
    title: s.title,
    organ: s.organ,
    text: s.text,
    signs: s.signs,
    homeText: s.homeText,
  })),
  appel: { titre: 'Vous ne trouvez pas votre situation ?' },
};

export type SpecialitesContent = typeof defaults;

export const SPECIALITES: PageDef<SpecialitesContent> = {
  slug: 'specialites',
  editable: false,
  title: 'Spécialités',
  route: '/specialites',
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
      key: 'aide',
      label: 'Encadré « Vous hésitez sur votre situation ? »',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'items',
      label: 'Les six spécialités (page Spécialités, accueil et silhouette)',
      type: 'list',
      itemLabel: 'une spécialité',
      titleKey: 'title',
      fixed: true,
      fields: [
        { key: 'sym', label: 'Deux lettres affichées en grand', type: 'text' },
        { key: 'title', label: 'Nom', type: 'text' },
        {
          key: 'organ',
          label: 'Organe concerné (affiché sous la silhouette)',
          type: 'text',
        },
        { key: 'text', label: 'Texte de la page Spécialités', type: 'textarea' },
        { key: 'signs', label: 'Vous pouvez consulter si…', type: 'textarea' },
        { key: 'homeText', label: 'Phrase courte de l’accueil', type: 'textarea' },
      ],
    },
    {
      key: 'cartes',
      label: 'Liste de la page',
      type: 'group',
      fields: [
        {
          key: 'libelleSignes',
          label: 'Titre de la liste « vous pouvez consulter si »',
          type: 'text',
        },
        { key: 'lien', label: 'Texte du lien', type: 'text' },
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
