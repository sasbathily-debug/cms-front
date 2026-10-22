import { PageDef } from '../fields';

/** Le pied de page est commun à toutes les pages du site. */
const defaults = {
  mentions: {
    texte:
      "Dr Aïssatou Mamadou Fall, médecin endocrinologue, diabétologue et nutritionniste.\nInscrite à l'Ordre des médecins du Sénégal, n° [numéro d'inscription].\n[Mention légale et autorisation d'exercer, à confirmer.]",
  },
  bas: {
    copyright: 'Dr Aïssatou Mamadou Fall. Tous droits réservés.',
    liens: 'Mentions légales · Politique de confidentialité · Plan du site',
  },
};

export type PiedDePageContent = typeof defaults;

export const PIED_DE_PAGE: PageDef<PiedDePageContent> = {
  slug: 'pied-de-page',
  title: 'Pied de page (toutes les pages)',
  route: '/',
  defaults,
  fields: [
    {
      key: 'mentions',
      label: 'Mentions professionnelles',
      type: 'group',
      fields: [
        {
          key: 'texte',
          label: 'Texte (une ligne par retour à la ligne)',
          type: 'textarea',
          hint: 'Numéro d’inscription à l’Ordre et mention légale : à renseigner avec la doctoresse.',
        },
      ],
    },
    {
      key: 'bas',
      label: 'Bas de page',
      type: 'group',
      fields: [
        {
          key: 'copyright',
          label: 'Texte après « © année »',
          type: 'text',
        },
        { key: 'liens', label: 'Liens (texte)', type: 'text' },
      ],
    },
  ],
};
