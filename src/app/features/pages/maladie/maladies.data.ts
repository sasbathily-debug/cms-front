import { MaladieArtKind } from '../../../shared/maladie-art/maladie-art';

/** Une formule payante (consultation, accompagnement) avec son tarif officiel. */
export interface OffreContent {
  /** Petit titre en capitales : le type de formule et sa durée. */
  kicker: string;
  nom: string;
  prix: string;
  paragraphes: string[];
  inclusTitre: string;
  inclus: string[];
  ideal?: string;
  bouton: string;
}

export interface MaladieContent {
  slug: string;
  crumb: string;
  title: string;
  lead: string;
  /** Illustration de l'en-tête ; sans elle, `heroPoints` s'affiche à la place. */
  heroArt?: MaladieArtKind;
  heroPoints?: string[];
  heroLabel: string;
  essentiel: { quoi: string; quand: string; suivi: string; urgence: string };
  definition: {
    title: string;
    text: string;
    imageTitle: string;
    imageIntro: string;
    cards: { art?: MaladieArtKind; title: string; text: string }[];
  };
  signes: { title?: string; items: string[]; outro: string };
  priseEnCharge: { intro: string; examens: { nom: string; texte: string }[] };
  /** Tarifs des formules proposées (facultatif) : une section « Tarifs » s'ajoute à la page. */
  offres?: { title: string; intro: string; items: OffreContent[] };
  quotidien: { titre: string; texte: string }[];
  urgence: string;
  faqTitle: string;
  faq: { question: string; reponse: string }[];
  aside: { title: string; apporter: string };
  cta: string;
}

/**
 * Textes d'exemple : ce contenu est une base générale, à relire, corriger et compléter par la doctoresse
 * avant toute publication. Les passages entre crochets sont à confirmer.
 */
export const MALADIES: Record<string, MaladieContent> = {
  diabete: {
    slug: 'diabete',
    crumb: 'Diabète',
    title: 'Diabète : comprendre, suivre, vivre mieux',
    lead: "Le diabète est une maladie chronique qui se caractérise par un taux de sucre (glycémie) trop élevé dans le sang. Bien suivi, il permet de mener une vie normale et d'éviter la plupart des complications.",
    heroArt: 'diabete-hero',
    heroLabel: 'VOTRE GLYCÉMIE SUR UNE JOURNÉE (SCHÉMA)',
    essentiel: {
      quoi: "Un taux de sucre trop élevé dans le sang, parce que l'insuline manque ou agit mal. Bien suivi, il permet de vivre normalement.",
      quand:
        "Soif intense, envie fréquente d'uriner, fatigue inhabituelle, vision floue. Ou si vous avez des proches diabétiques.",
      suivi:
        'Un bilan (glycémie, HbA1c), un plan adapté à votre alimentation, puis des rendez-vous réguliers.',
      urgence:
        'malaise, confusion, vomissements répétés. Ne pas attendre, appelez le SAMU au 1515.',
    },
    definition: {
      title: "Qu'est-ce que le diabète ?",
      text: "Le diabète apparaît quand l'organisme ne produit pas assez d'insuline ou ne l'utilise pas correctement. L'insuline est l'hormone qui permet au sucre de passer du sang vers les cellules, où il sert d'énergie. Quand elle fait défaut, le sucre s'accumule dans le sang.",
      imageTitle: "En image : le rôle de l'insuline",
      imageIntro:
        "Imaginez l'insuline comme une clé. Elle ouvre la porte des cellules pour que le sucre du sang y entre et serve d'énergie.",
      cards: [
        {
          title: 'Quand tout va bien',
          text: "La clé tourne, la porte s'ouvre, le sucre entre dans la cellule.",
        },
        {
          title: 'Type 1 : il manque la clé',
          text: "Le corps ne produit presque plus d'insuline : la porte reste fermée, le sucre s'accumule dans le sang. Il apparaît souvent chez l'enfant ou le jeune adulte et demande un traitement par insuline.",
        },
        {
          title: 'Type 2 : la clé tourne mal',
          text: "L'insuline est là, mais elle agit mal : la porte s'ouvre à peine. C'est le plus fréquent, favorisé par l'âge, le surpoids, le manque d'activité physique et l'hérédité. Il demande un traitement et un mode de vie adaptés.",
        },
        {
          title: 'Diabète gestationnel',
          text: "Il apparaît pendant la grossesse, comme un type 2 temporaire, et impose un suivi rapproché pour protéger la mère et l'enfant.",
        },
      ],
    },
    signes: {
      items: [
        'Soif intense et bouche sèche',
        "Envie d'uriner très fréquente",
        'Fatigue inhabituelle',
        'Amaigrissement sans raison',
        'Vision floue',
        'Infections répétées, plaies qui cicatrisent mal',
      ],
      outro:
        'Le diabète de type 2 peut aussi ne donner aucun signe pendant des années. Si vous avez des proches diabétiques, un excès de poids ou plus de 40 ans, un dépistage est conseillé.',
    },
    priseEnCharge: {
      intro:
        'La première consultation permet de comprendre votre histoire, vos habitudes et votre traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :',
      examens: [
        {
          nom: 'Glycémie à jeun',
          texte: 'Mesure le taux de sucre dans le sang le matin, à jeun.',
        },
        {
          nom: 'HbA1c',
          texte:
            "Reflète la moyenne de la glycémie sur les trois derniers mois. C'est l'examen de référence du suivi.",
        },
        {
          nom: 'Bilan lipidique',
          texte: 'Cholestérol et triglycérides, importants pour protéger le cœur et les vaisseaux.',
        },
        {
          nom: 'Fonction rénale',
          texte:
            "Surveille l'état des reins, qui peuvent être touchés par un diabète mal équilibré.",
        },
        {
          nom: "Fond d'œil et pieds",
          texte:
            'Un contrôle régulier des yeux et des pieds permet de repérer très tôt les complications. [Examens réalisés au cabinet : à préciser]',
        },
      ],
    },
    quotidien: [
      {
        titre: 'Alimentation',
        texte:
          'Répartir les glucides sur la journée, privilégier les fibres, les légumes et les céréales complètes. Nous adaptons les conseils à votre cuisine.',
      },
      {
        titre: 'Activité physique',
        texte:
          'Une marche rapide de 30 minutes la plupart des jours aide déjà à mieux contrôler la glycémie. [Conseils à adapter]',
      },
      {
        titre: 'Traitement',
        texte:
          "Prendre son traitement tel que prescrit, et ne jamais l'arrêter sans en parler. Nous l'ajustons à chaque consultation.",
      },
      {
        titre: 'Surveillance',
        texte:
          'Mesurer sa glycémie aux moments conseillés et noter les résultats pour en discuter ensemble.',
      },
    ],
    urgence:
      "Contactez immédiatement les urgences en cas de malaise, de confusion, de vomissements répétés avec une soif intense, de respiration anormalement rapide, ou de tremblements et de sueurs qui ne passent pas après avoir pris du sucre. [Numéro d'urgence ou structure à contacter : à confirmer par la doctoresse]",
    faqTitle: 'Questions fréquentes sur le diabète',
    faq: [
      {
        question: 'Le diabète peut-il guérir ?',
        reponse:
          "Le diabète est une maladie chronique : on ne le guérit pas, mais on peut très bien le contrôler. Dans certains cas de type 2, une perte de poids et un meilleur mode de vie permettent d'obtenir une rémission. [Réponse à valider]",
      },
      {
        question: 'Puis-je jeûner pendant le Ramadan ?',
        reponse:
          'Cela dépend de votre type de diabète, de votre traitement et de votre équilibre. Certaines personnes ne doivent pas jeûner. Parlez-en avec votre médecin plusieurs semaines avant. [Réponse à valider]',
      },
      {
        question: 'Mon enfant peut-il avoir un diabète ?',
        reponse:
          'Oui, le diabète de type 1 touche surtout les enfants et les jeunes. Une soif intense, des urines fréquentes et un amaigrissement doivent conduire à consulter rapidement.',
      },
    ],
    aside: {
      title: 'Un suivi du diabète au cabinet',
      apporter:
        'Vos analyses récentes, vos ordonnances, la liste de vos médicaments et, si vous en avez un, votre carnet de glycémie.',
    },
    cta: 'Un suivi du diabète, à votre rythme.',
  },
  thyroide: {
    slug: 'thyroide',
    crumb: 'Thyroïde',
    title: 'Thyroïde : comprendre, soigner, retrouver son énergie',
    lead: "La thyroïde est une petite glande en forme de papillon, à la base du cou. Elle règle l'énergie du corps : le rythme du cœur, la chaleur, le poids, l'humeur. Bien suivie, elle se soigne très bien.",
    heroArt: 'thyroide-hero',
    heroLabel: 'LE THERMOSTAT DU CORPS (SCHÉMA)',
    essentiel: {
      quoi: "Une glande du cou qui produit les hormones de l'énergie. Trop peu (hypothyroïdie) ou trop (hyperthyroïdie), le corps se dérègle, mais cela se traite.",
      quand:
        "Fatigue ou nervosité inhabituelles, poids qui change sans raison, cœur qui s'emballe, frilosité ou chaleur, gonflement du cou.",
      suivi:
        'Une prise de sang (TSH), souvent une échographie du cou, un traitement adapté, puis un suivi régulier des analyses.',
      urgence:
        'palpitations très fortes avec douleur dans la poitrine, difficulté à respirer ou à avaler, gonflement rapide du cou. Ne pas attendre, appelez le SAMU au 1515.',
    },
    definition: {
      title: 'À quoi sert la thyroïde ?',
      text: "La thyroïde fabrique deux hormones (T3 et T4) qui indiquent au corps à quelle vitesse fonctionner. Un autre organe, l'hypophyse, la surveille avec la TSH et lui demande d'en produire plus ou moins. Quand ce réglage se dérègle, le corps va trop lentement ou trop vite.",
      imageTitle: 'En image : le thermostat du corps',
      imageIntro:
        "Imaginez la thyroïde comme le thermostat du corps : trop bas, tout ralentit ; trop haut, tout s'emballe ; au bon réglage, on se sent bien. Les nodules, eux, sont des petites boules dans la glande.",
      cards: [
        {
          title: 'Hypothyroïdie',
          text: "La thyroïde produit trop peu : fatigue, frilosité, prise de poids, lenteur. C'est la forme la plus fréquente, souvent due à une maladie auto-immune. Un traitement quotidien rétablit l'équilibre.",
        },
        {
          title: 'Au bon réglage',
          text: 'Les hormones sont en équilibre : énergie, poids et humeur stables.',
        },
        {
          title: 'Hyperthyroïdie',
          text: 'La thyroïde produit trop : cœur rapide, nervosité, amaigrissement, chaleur. Plusieurs causes sont possibles et le traitement dépend de la cause. [À préciser par la doctoresse]',
        },
        {
          title: 'Nodules et goitre',
          text: 'Une boule ou un gonflement du cou. La grande majorité des nodules sont bénins, mais un bilan est nécessaire pour le confirmer.',
        },
      ],
    },
    signes: {
      items: [
        'Fatigue inhabituelle ou, au contraire, grande nervosité',
        'Poids qui change sans raison apparente',
        'Frilosité, ou sensation de chaleur et sueurs',
        'Cœur très lent, ou palpitations',
        'Gonflement ou gêne au niveau du cou',
        'Peau sèche, cheveux fragiles, cycles irréguliers',
      ],
      outro:
        "Les troubles de la thyroïde s'installent lentement et se confondent facilement avec la fatigue ou le stress. Une prise de sang simple permet de savoir. Si vous avez des antécédents familiaux, un bilan est conseillé.",
    },
    priseEnCharge: {
      intro:
        'La première consultation permet de comprendre votre histoire, vos habitudes et votre traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :',
      examens: [
        {
          nom: 'Prise de sang (TSH)',
          texte:
            "Le dosage de la TSH est l'examen de base : il dit si la thyroïde est lente, rapide ou équilibrée.",
        },
        {
          nom: 'T4 libre et T3',
          texte: 'Complètent la TSH pour mesurer précisément les hormones thyroïdiennes.',
        },
        {
          nom: 'Anticorps thyroïdiens',
          texte: 'Cherchent une maladie auto-immune, cause fréquente des dérèglements.',
        },
        {
          nom: 'Échographie du cou',
          texte:
            "Examine la taille et l'aspect de la glande et repère d'éventuels nodules. [Réalisée au cabinet ? À préciser]",
        },
        {
          nom: 'Examens complémentaires',
          texte:
            "Scintigraphie ou ponction d'un nodule dans certains cas, sur décision du médecin. [À préciser]",
        },
      ],
    },
    quotidien: [
      {
        titre: 'Un traitement régulier',
        texte:
          "Le traitement se prend tous les jours, à heure fixe, et ne s'arrête pas sans avis médical. Nous l'ajustons selon vos analyses.",
      },
      {
        titre: 'Une alimentation variée',
        texte:
          'Pas de régime particulier, mais évitez les compléments « pour la thyroïde » ou riches en iode sans avis du médecin. [À valider]',
      },
      {
        titre: 'Des analyses de contrôle',
        texte:
          "Une prise de sang régulière permet de vérifier l'équilibre. Le rythme est adapté à votre situation. [À préciser]",
      },
      {
        titre: 'Grossesse et projet de bébé',
        texte:
          "Une thyroïde mal équilibrée peut gêner la grossesse. Parlez-en avant d'avoir un bébé, ou dès que vous êtes enceinte.",
      },
    ],
    urgence:
      "Contactez immédiatement les urgences en cas de palpitations très fortes avec douleur dans la poitrine, de difficulté à respirer ou à avaler, de malaise, ou de gonflement très rapide du cou. [Numéro d'urgence ou structure à contacter : à confirmer par la doctoresse]",
    faqTitle: 'Questions fréquentes sur la thyroïde',
    faq: [
      {
        question: 'Un nodule à la thyroïde est-il un cancer ?',
        reponse:
          'Non, dans la grande majorité des cas, les nodules sont bénins. Un bilan avec échographie permet de savoir lesquels doivent être surveillés ou examinés davantage. [Réponse à valider]',
      },
      {
        question: 'Faut-il prendre le traitement toute sa vie ?',
        reponse:
          "Cela dépend de la cause. Dans beaucoup d'hypothyroïdies, le traitement est durable ; dans d'autres situations, il est temporaire. Votre médecin vous l'explique après le bilan. [Réponse à valider]",
      },
      {
        question: 'Faut-il être à jeun pour la prise de sang ?',
        reponse: '[À confirmer par la doctoresse.]',
      },
    ],
    aside: {
      title: 'Un suivi de la thyroïde au cabinet',
      apporter:
        'Vos analyses récentes, vos ordonnances, la liste de vos médicaments et vos anciens résultats de thyroïde (TSH) si vous en avez.',
    },
    cta: 'Retrouver son énergie, pas à pas.',
  },
  obesite: {
    slug: 'obesite',
    crumb: 'Obésité et surpoids',
    title: 'Poids : être accompagné, sans jugement, à votre rythme',
    lead: "Le poids ne dépend pas que de la volonté : l'alimentation, le sommeil, le stress, les hormones et l'hérédité jouent tous un rôle. Nous cherchons ce qui bloque, puis nous avançons pas à pas.",
    heroArt: 'obesite-hero',
    heroLabel: 'UN POIDS, PLUSIEURS LEVIERS (SCHÉMA)',
    essentiel: {
      quoi: "Un excès de masse grasse qui peut peser sur la santé : cœur, diabète, articulations. L'IMC aide à se situer, mais il ne dit pas tout.",
      quand:
        'Poids qui augmente malgré vos efforts, essoufflement, douleurs des genoux ou du dos, glycémie ou tension élevées, envie de reprendre la main.',
      suivi:
        "Un bilan complet (habitudes, analyses, recherche d'une cause hormonale), des objectifs réalistes, un plan alimentaire adapté, puis un suivi régulier.",
      urgence:
        'essoufflement soudain, douleur dans la poitrine, malaise. Ne pas attendre, appelez le SAMU au 1515.',
    },
    definition: {
      title: 'Pourquoi le poids change',
      text: "Prendre du poids n'est pas un manque de volonté. Le corps règle son poids grâce à des hormones, au sommeil, au stress, à l'alimentation et à l'hérédité. Quand l'un de ces leviers se dérègle, le poids peut monter, même en faisant des efforts. Le surpoids commence à un IMC de 25, l'obésité à 30, mais l'IMC ne dit pas tout : le tour de taille et votre santé comptent aussi.",
      imageTitle: 'En image : un poids, plusieurs leviers',
      imageIntro:
        'Voici quatre des leviers sur lesquels nous travaillons ensemble. Chacun peut se régler, un à la fois.',
      cards: [
        {
          title: "Ce qu'on mange, ce qu'on dépense",
          text: "Une balance simple en apparence, mais qui dépend de la faim, de l'énergie du corps et du mode de vie. Nous cherchons un équilibre réaliste, sans interdits.",
        },
        {
          title: 'Le sommeil et le stress',
          text: "Dormir peu et vivre sous pression poussent à grignoter et à stocker. Mieux dormir et mieux gérer le stress aide souvent autant que l'assiette. [À valider]",
        },
        {
          title: 'Les hormones',
          text: "Des signaux de faim et de satiété règlent l'appétit. Une cause médicale (thyroïde, ovaires polykystiques, certains médicaments) peut aussi se cacher derrière une prise de poids. [À préciser]",
        },
        {
          title: 'Un palier à la fois',
          text: 'Perdre 5 à 10 % de son poids apporte déjà un vrai bénéfice pour la santé. Nous fixons de petits objectifs, puis nous les ajustons. [Chiffre à valider]',
        },
      ],
    },
    signes: {
      items: [
        'Un poids qui augmente malgré vos efforts',
        'Essoufflement en montant un escalier ou en marchant',
        'Tour de taille qui augmente',
        'Fringales ou grignotage difficiles à contrôler',
        'Douleurs des genoux, des hanches ou du dos',
        'Ronflements, fatigue au réveil, glycémie ou tension élevées',
      ],
      outro:
        "La prise de poids s'installe souvent lentement, et chacun la vit différemment. Il n'y a pas de honte à demander de l'aide : un bilan permet de comprendre ce qui se passe, y compris une éventuelle cause médicale.",
    },
    priseEnCharge: {
      intro:
        'La première consultation permet de comprendre votre histoire, vos habitudes et votre traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :',
      examens: [
        {
          nom: 'Histoire du poids',
          texte:
            "Nous retraçons ensemble l'évolution de votre poids, vos tentatives passées, vos habitudes et votre contexte de vie, sans jugement.",
        },
        {
          nom: 'Poids, taille, tour de taille',
          texte:
            "L'IMC et le tour de taille donnent un point de départ clair pour fixer des objectifs réalistes.",
        },
        {
          nom: 'Bilan sanguin',
          texte:
            'Glycémie, cholestérol, bilan de la thyroïde et autres analyses selon votre situation. [À préciser par la doctoresse]',
        },
        {
          nom: "Recherche d'une cause hormonale",
          texte:
            'Pour repérer une thyroïde lente, un syndrome des ovaires polykystiques ou un excès de cortisol. [À préciser]',
        },
        {
          nom: 'Bilan alimentaire',
          texte:
            'Un échange sur vos repas, parfois un carnet alimentaire de quelques jours, pour adapter le plan à votre vie. [Mesure de la composition corporelle ? À préciser]',
        },
      ],
    },
    quotidien: [
      {
        titre: 'Des objectifs réalistes',
        texte:
          "De petits paliers, adaptés à votre rythme, valent mieux qu'un régime strict qu'on abandonne. Nous les révisons à chaque consultation.",
      },
      {
        titre: 'Une alimentation sans interdits',
        texte:
          "Pas de régime miracle ni d'aliments bannis : un plan simple, qui respecte vos habitudes et votre culture alimentaire. [À valider]",
      },
      {
        titre: 'Bouger à sa façon',
        texte:
          'Marche, danse, escaliers : on choisit une activité qui vous convient et on augmente doucement. [À préciser]',
      },
      {
        titre: 'Un suivi régulier',
        texte:
          'Des consultations rapprochées au début, pour ajuster, encourager et traiter les difficultés comme le sommeil ou le stress. [Rythme à préciser]',
      },
    ],
    urgence:
      "Contactez immédiatement les urgences en cas d'essoufflement soudain, de douleur dans la poitrine, de malaise, de gonflement rapide d'une jambe ou de prise de poids très rapide avec œdèmes. [Numéro d'urgence ou structure à contacter : à confirmer par la doctoresse]",
    faqTitle: 'Questions fréquentes sur le poids',
    faq: [
      {
        question: 'Faut-il suivre un régime strict ?',
        reponse:
          'Non. Les régimes très stricts fonctionnent rarement à long terme. Nous construisons avec vous un plan réaliste, adapté à votre vie. [Réponse à valider]',
      },
      {
        question: 'Prendre du poids, est-ce un manque de volonté ?',
        reponse:
          "Non. Les hormones, le sommeil, le stress, certains médicaments et l'hérédité pèsent beaucoup. Le bilan sert justement à comprendre ce qui se passe pour vous. [Réponse à valider]",
      },
      {
        question: 'Existe-t-il des traitements ou une chirurgie ?',
        reponse:
          '[À confirmer par la doctoresse : traitements proposés au cabinet, orientation éventuelle vers une chirurgie.]',
      },
    ],
    aside: {
      title: 'Un accompagnement du poids au cabinet',
      apporter:
        'Vos analyses récentes, vos ordonnances, la liste de vos médicaments, votre poids de départ et, si possible, ce que vous mangez sur une journée type.',
    },
    cta: 'Avancer pas à pas, ensemble.',
  },

  'nutrition-clinique': {
    slug: 'nutrition-clinique',
    crumb: 'Nutrition clinique',
    title: 'Nutrition clinique : manger pour se soigner et se sentir bien',
    lead: "La nutrition clinique utilise l'alimentation comme un outil de soin : adaptée à votre santé, à votre maladie éventuelle et à votre vie, sans régime miracle ni interdits inutiles.",
    heroLabel: 'CE QUE COUVRE CETTE PAGE',
    heroPoints: [
      'Un bilan de vos habitudes alimentaires',
      'Un plan adapté à votre santé, à votre budget et à votre culture',
      'Un suivi du poids, de l’énergie et des analyses',
      'Un accompagnement avant, pendant ou après une maladie',
    ],
    essentiel: {
      quoi: 'Un accompagnement alimentaire médical : on part de votre situation (poids, maladie, grossesse, fatigue, analyses) pour construire un plan réaliste, avec des aliments que vous aimez et que vous trouvez facilement.',
      quand:
        "Un poids qui change sans raison, un diabète, un cholestérol ou une tension élevés, une fatigue qui dure, une grossesse, ou l'envie d'un avis médical clair plutôt que de conseils contradictoires.",
      suivi:
        'Un premier rendez-vous pour faire le point, un plan écrit et simple, puis des rendez-vous réguliers pour ajuster, avec des analyses si nécessaire. [Rythme à préciser]',
      urgence:
        "Vomissements ou diarrhée qui ne s'arrêtent pas, malaise, impossibilité de boire : n'attendez pas. Numéro d'urgence :",
    },
    definition: {
      title: 'Ce que fait la nutrition clinique',
      text: "Elle ne se résume pas à « faire un régime ». Le médecin regarde votre histoire, vos analyses, vos médicaments et votre quotidien, puis adapte l'alimentation pour soigner, prévenir ou soulager. [Périmètre exact de la consultation : à confirmer par la doctoresse]",
      imageTitle: 'Quatre idées à retenir',
      imageIntro: "Ce qui guide l'accompagnement, d'une personne à l'autre.",
      cards: [
        {
          title: 'Pas de régime miracle',
          text: "Les régimes très stricts font souvent reprendre ce qu'on a perdu. On cherche des changements que vous pouvez tenir longtemps. [À valider]",
        },
        {
          title: 'Manger selon sa santé',
          text: 'Diabète, cholestérol, tension, reins, digestion : chaque situation a ses repères, et ils ne sont pas les mêmes pour tout le monde.',
        },
        {
          title: "Partir de ce que l'on mange déjà",
          text: 'On part de vos repas habituels, de vos plats et des produits que vous trouvez ici, puis on ajuste les quantités et les préparations. [À adapter par la doctoresse]',
        },
        {
          title: 'Un suivi qui évolue',
          text: 'Le plan change avec vos résultats, votre énergie et votre vie : travail, voyages, Ramadan, grossesse. [À valider]',
        },
      ],
    },
    signes: {
      title: 'Quand en parler',
      items: [
        'Une prise ou une perte de poids que vous ne comprenez pas',
        'Une fatigue ou une baisse d’énergie qui dure',
        'Des envies de sucre ou une faim difficiles à contrôler',
        'Des analyses qui montrent un sucre, un cholestérol ou une tension trop élevés',
        'Des troubles digestifs fréquents : ballonnements, constipation',
        'Une grossesse, un allaitement ou un projet de bébé',
        'Un appétit très faible, chez vous ou chez un proche âgé',
        'L’envie de changer d’alimentation sans savoir par où commencer',
      ],
      outro:
        "Si l'un de ces points vous concerne, un rendez-vous permet de faire le point simplement, sans jugement. [À compléter par le Dr Fall]",
    },
    priseEnCharge: {
      intro:
        'Voici, en général, ce qui peut être proposé. Le Dr Fall choisit ce qui est utile pour vous.',
      examens: [
        {
          nom: 'Un échange sur votre alimentation',
          texte:
            "Vos repas habituels, vos horaires, votre budget, vos goûts, votre activité et votre sommeil : c'est la base du plan.",
        },
        {
          nom: 'Poids, taille, tour de taille',
          texte: "Des repères simples, mesurés au cabinet, pour suivre l'évolution dans le temps.",
        },
        {
          nom: 'Un bilan sanguin si nécessaire',
          texte:
            "Sucre, cholestérol, fer, vitamines, selon votre situation. Il n'est pas systématique. [À préciser par la doctoresse]",
        },
        {
          nom: 'Un plan écrit',
          texte: 'Quelques repères clairs, adaptés à vos repas, que vous emportez chez vous.',
        },
      ],
    },
    offres: {
      title: 'Les tarifs',
      intro: 'Deux formules, selon ce dont vous avez besoin.',
      items: [
        {
          kicker: 'CONSULTATION · 30 MIN',
          nom: 'Consultation nutritionnelle',
          prix: '35\u00a0000\u00a0FCFA',
          paragraphes: [
            'Un entretien individuel de 30 minutes pour faire le point sur votre alimentation, vos objectifs et votre situation de santé.',
            'Au cours de cette consultation, le Dr Fall vous expliquera les principes essentiels d’une alimentation saine et équilibrée, en adaptant ses conseils à vos besoins et, lorsque disponibles, à vos résultats biologiques.',
          ],
          inclusTitre: 'La consultation comprend :',
          inclus: [
            'L’analyse de votre situation et de vos objectifs',
            'L’interprétation des résultats d’examens pertinents',
            'Des conseils nutritionnels personnalisés',
            'Les réponses à vos questions',
            'Un document récapitulatif personnalisé à conserver après la consultation',
          ],
          ideal:
            'Idéal pour celles et ceux qui souhaitent comprendre les bases et repartir avec des repères concrets pour améliorer leur alimentation au quotidien.',
          bouton: 'Réserver une consultation',
        },
        {
          kicker: 'ACCOMPAGNEMENT · 1 MOIS',
          nom: 'Accompagnement nutritionnel',
          prix: '90\u00a0000\u00a0FCFA',
          paragraphes: [
            'Un accompagnement plus personnalisé pour vous aider à passer de la théorie à la pratique et intégrer progressivement de nouvelles habitudes alimentaires dans votre quotidien.',
          ],
          inclusTitre: 'L’accompagnement comprend :',
          inclus: [
            'Tout le contenu de la consultation nutritionnelle',
            'Un entretien individuel de 30 minutes avec le Dr Aïssatou Mamadou Fall',
            'Une analyse personnalisée de votre situation, de vos objectifs et de vos résultats',
            'Un document récapitulatif personnalisé',
            '2 semaines de menus complets, adaptés à vos besoins et à votre quotidien',
            'Un suivi sur 1 mois pour vous accompagner dans la mise en place des recommandations et ajuster les conseils si nécessaire',
          ],
          bouton: 'Demander un accompagnement',
        },
      ],
    },
    quotidien: [
      {
        titre: 'Des repas à heures régulières',
        texte:
          'Sauter des repas pousse souvent à grignoter plus tard. Un rythme régulier aide, même simple. [À valider]',
      },
      {
        titre: 'Boire de l’eau',
        texte:
          "L'eau reste la meilleure boisson. On réduit les boissons sucrées sans les interdire d'office. [À valider]",
      },
      {
        titre: 'Une assiette variée',
        texte:
          "Légumes, protéines, céréales : on cherche l'équilibre à vos repas habituels plutôt que de supprimer des aliments. [À préciser]",
      },
      {
        titre: 'Bouger un peu chaque jour',
        texte:
          "Marche, escaliers, activité que vous aimez : l'alimentation donne de meilleurs résultats avec un peu de mouvement. [À préciser]",
      },
    ],
    urgence:
      "Venez au cabinet ou contactez les urgences en cas de vomissements ou de diarrhée qui durent, de malaise, d'impossibilité de boire, de perte de poids très rapide ou de signes de déshydratation (bouche très sèche, urines rares, grande faiblesse). Numéro d'urgence :",
    faqTitle: 'Questions fréquentes sur la nutrition',
    faq: [
      {
        question: 'Faut-il supprimer certains aliments ?',
        reponse:
          'En général non. On ajuste plutôt les quantités et les habitudes. Une situation médicale peut demander des précautions, que le médecin vous explique. [Réponse à valider]',
      },
      {
        question: 'Mon alimentation locale est-elle compatible ?',
        reponse:
          'Oui : on part de ce que vous mangez déjà et des produits que vous trouvez, sans vous imposer des aliments introuvables ou trop chers. [Réponse à valider]',
      },
      {
        question: 'Combien de temps dure le suivi ?',
        reponse:
          'La consultation nutritionnelle est un entretien individuel de 30 minutes. L’accompagnement nutritionnel dure 1 mois : il comprend un suivi pour vous aider à mettre en place les recommandations et ajuster les conseils si nécessaire.',
      },
      {
        question: 'Dois-je faire des analyses avant le rendez-vous ?',
        reponse:
          'Pas forcément. Apportez celles que vous avez déjà ; le médecin dira lesquelles sont utiles. [Réponse à valider]',
      },
    ],
    aside: {
      title: 'Un accompagnement alimentaire au cabinet',
      apporter:
        "Vos analyses récentes, la liste de vos médicaments et une idée de vos repas d'une journée type, même approximative.",
    },
    cta: 'Parlons de votre alimentation.',
  },
  'troubles-hormonaux': {
    slug: 'troubles-hormonaux',
    crumb: 'Troubles hormonaux',
    title: 'Troubles hormonaux : comprendre ce qui se déséquilibre',
    lead: "Les hormones sont des messagères qui règlent le cycle, la croissance, l'énergie, le poids ou le sommeil. Quand l'une d'elles se dérègle, le corps le fait savoir : un bilan permet de comprendre et, le plus souvent, de soulager.",
    heroLabel: 'CE QUE COUVRE CETTE PAGE',
    heroPoints: [
      'Cycles irréguliers et syndrome des ovaires polykystiques',
      'Puberté trop précoce ou trop tardive',
      'Ménopause et changements de l’âge adulte',
      'Hypophyse et surrénales',
    ],
    essentiel: {
      quoi: "Un déséquilibre d'une ou plusieurs hormones, qui peut toucher le cycle, la croissance, le poids, l'énergie, la peau ou la tension. Il se repère par un bilan et se traite le plus souvent.",
      quand:
        'Des cycles irréguliers ou absents, une puberté qui surprend, des bouffées de chaleur, une fatigue ou une prise de poids inexpliquées, ou des difficultés à concevoir.',
      suivi:
        'Un examen et un bilan hormonal choisis selon votre situation, une explication claire des résultats, puis un traitement ou une surveillance adaptés. [À préciser]',
      urgence:
        "Douleur très forte dans le ventre, saignements très abondants, malaise important : n'attendez pas. Numéro d'urgence :",
    },
    definition: {
      title: 'Les hormones, des messagères discrètes',
      text: "Produites par des glandes (ovaires, thyroïde, hypophyse, surrénales...), les hormones circulent dans le sang et donnent des consignes aux organes. Un excès, un manque ou un mauvais rythme peut avoir des effets très variés, d'où l'importance d'un bilan précis. [Texte à valider par la doctoresse]",
      imageTitle: 'Quatre situations fréquentes',
      imageIntro: 'Quelques exemples de ce que le cabinet prend en charge.',
      cards: [
        {
          title: 'Cycles et ovaires',
          text: "Des règles irrégulières ou absentes, de l'acné, des poils en excès ou une prise de poids peuvent évoquer un syndrome des ovaires polykystiques. Cela se traite et se surveille. [À valider]",
        },
        {
          title: 'Puberté et croissance',
          text: "Une puberté très précoce ou très tardive, ou une croissance qui inquiète, justifie un avis : l'enfant ou l'adolescent est examiné avec ses parents. [À préciser : âges accueillis]",
        },
        {
          title: 'Ménopause et âge adulte',
          text: 'Bouffées de chaleur, sommeil perturbé, humeur changeante : la ménopause se vit différemment selon les femmes, et on peut souvent soulager. [À valider]',
        },
        {
          title: 'Hypophyse et surrénales',
          text: "Ces petites glandes dirigent d'autres hormones. Un dérèglement peut donner une grande fatigue, une tension élevée ou un poids qui change. Il se repère par un bilan. [À valider]",
        },
      ],
    },
    signes: {
      items: [
        'Des règles irrégulières, très espacées ou absentes',
        'De l’acné persistante ou des poils en excès chez la femme',
        'Une prise de poids rapide ou inexpliquée',
        'Une fatigue importante qui ne s’explique pas',
        'Des bouffées de chaleur ou un sommeil très perturbé',
        'Des difficultés à avoir un bébé',
        'Une puberté qui commence très tôt ou très tard',
        'Une tension élevée ou des envies de boire et d’uriner inhabituelles',
      ],
      outro:
        "Ces signes ont souvent plusieurs explications possibles, pas toujours hormonales. Un bilan permet de faire le tri sans s'inquiéter à l'avance. [À compléter par le Dr Fall]",
    },
    priseEnCharge: {
      intro:
        'La première consultation permet de comprendre votre histoire : cycles, croissance, poids, traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :',
      examens: [
        {
          nom: 'Histoire et examen',
          texte:
            "Vos symptômes, leur ancienneté, votre histoire familiale et un examen clinique : c'est ce qui oriente le reste.",
        },
        {
          nom: 'Un bilan hormonal',
          texte:
            'Une prise de sang qui mesure certaines hormones, parfois à un moment précis du cycle. Le cabinet vous donne les consignes. [À préciser par la doctoresse]',
        },
        {
          nom: 'Une échographie si nécessaire',
          texte:
            'Par exemple une échographie des ovaires ou de la thyroïde, demandée selon votre situation. [À préciser]',
        },
        {
          nom: "D'autres examens, dans certains cas",
          texte:
            "Si le médecin soupçonne un problème de l'hypophyse ou des surrénales, il peut demander des examens complémentaires. [À préciser]",
        },
      ],
    },
    quotidien: [
      {
        titre: 'Noter ses cycles',
        texte:
          'Une simple note des dates de règles et des symptômes aide beaucoup le médecin à comprendre ce qui se passe. [À valider]',
      },
      {
        titre: 'Un poids qui se stabilise',
        texte:
          "Perdre un peu de poids améliore souvent le cycle et l'énergie, à votre rythme et sans régime strict. [À valider]",
      },
      {
        titre: 'Dormir et gérer le stress',
        texte:
          'Le sommeil et le stress agissent sur les hormones. Quelques habitudes simples peuvent aider. [À préciser]',
      },
      {
        titre: 'Un suivi régulier',
        texte:
          "Selon la situation, des contrôles réguliers vérifient que l'équilibre se maintient. [Rythme à préciser]",
      },
    ],
    urgence:
      "Contactez immédiatement les urgences en cas de douleur très forte dans le ventre, de saignements très abondants, de malaise, de mal de tête brutal et violent, ou de douleur dans le ventre chez une femme qui pourrait être enceinte. Numéro d'urgence :",
    faqTitle: 'Questions fréquentes sur les hormones',
    faq: [
      {
        question: 'Mes règles sont irrégulières : est-ce grave ?',
        reponse:
          "Pas toujours, mais cela mérite un avis surtout si cela dure ou s'accompagne d'autres signes. Un bilan permet d'en trouver la cause. [Réponse à valider]",
      },
      {
        question: "Un déséquilibre hormonal empêche-t-il d'avoir un enfant ?",
        reponse:
          'Il peut le rendre plus difficile, mais beaucoup de situations se traitent. Parlez-en au médecin, sans attendre trop longtemps. [Réponse à valider]',
      },
      {
        question: 'Faut-il être à jeun pour le bilan ?',
        reponse:
          'Cela dépend des hormones dosées. Le cabinet vous donne les consignes avant la prise de sang. [À confirmer par la doctoresse]',
      },
      {
        question: 'La ménopause se traite-t-elle ?',
        reponse:
          'Certains signes peuvent être soulagés. Les options dépendent de votre santé et de vos préférences, et se choisissent avec le médecin. [À valider par la doctoresse]',
      },
    ],
    aside: {
      title: 'Un suivi hormonal au cabinet',
      apporter:
        'Vos analyses et échographies déjà faites, vos ordonnances, la liste de vos médicaments, et si possible les dates de vos dernières règles.',
    },
    cta: 'Comprendre, puis soulager.',
  },
  cholesterol: {
    slug: 'cholesterol',
    crumb: 'Cholestérol et métabolisme',
    title: 'Cholestérol et métabolisme : prévenir avant que ça se voie',
    lead: "Un cholestérol trop élevé ne fait presque jamais mal : on le découvre par une prise de sang. Pourtant, avec le temps, il abîme les artères. Le repérer tôt permet d'agir simplement.",
    heroLabel: 'CE QUE COUVRE CETTE PAGE',
    heroPoints: [
      'Cholestérol et autres graisses du sang',
      'Tour de taille, sucre et tension : le syndrome métabolique',
      'Prévention du cœur et des artères',
      'Cholestérol élevé dans la famille',
    ],
    essentiel: {
      quoi: "Un excès de certaines graisses dans le sang (cholestérol « LDL », triglycérides). Elles s'accumulent dans les artères, sans signe, et augmentent peu à peu le risque de problèmes de cœur ou de vaisseaux.",
      quand:
        'Un bilan sanguin qui montre un cholestérol élevé, des cas de cholestérol ou de problèmes de cœur dans la famille, un tour de taille qui augmente, un diabète, une tension élevée ou le tabac.',
      suivi:
        "Un bilan de départ, des conseils d'alimentation et de mouvement, parfois un traitement, puis des prises de sang de contrôle. [Rythme à préciser]",
      urgence:
        "Douleur dans la poitrine, essoufflement brutal, faiblesse d'un côté du corps, difficulté à parler : appelez sans attendre. Numéro d'urgence :",
    },
    definition: {
      title: 'Le cholestérol, utile mais pas en excès',
      text: "Le cholestérol est une graisse dont le corps a besoin. Le problème, c'est l'excès de la forme « LDL », qui se dépose dans les artères, et le manque de « HDL », qui aide à l'évacuer. Les triglycérides, autres graisses du sang, comptent aussi. [Texte à valider par la doctoresse]",
      imageTitle: 'Quatre idées à retenir',
      imageIntro: "Pour comprendre pourquoi on s'en occupe tôt.",
      cards: [
        {
          title: 'On ne le sent pas',
          text: "Un cholestérol élevé ne donne en général aucun symptôme : seule une prise de sang le montre. D'où l'intérêt d'un bilan. [À valider]",
        },
        {
          title: 'Un risque qui se cumule',
          text: "Cholestérol, sucre, tension, tabac et tour de taille s'additionnent. Agir sur plusieurs à la fois protège beaucoup mieux le cœur. [À valider]",
        },
        {
          title: 'La famille compte',
          text: 'Certaines personnes ont un cholestérol élevé dès le plus jeune âge, dans leur famille. Un avis spécialisé est alors utile. [À préciser]',
        },
        {
          title: 'On peut agir',
          text: "L'alimentation, le mouvement et, si besoin, un traitement permettent le plus souvent de baisser les chiffres. [À valider]",
        },
      ],
    },
    signes: {
      title: 'Quand penser à faire un bilan',
      items: [
        'Du cholestérol, une crise cardiaque ou un AVC dans la famille',
        'Un tour de taille qui augmente, surtout autour du ventre',
        'Un diabète, ou un sucre un peu élevé',
        'Une tension élevée',
        'Le tabac',
        'Un bilan déjà fait qui montre un cholestérol ou des triglycérides élevés',
        'Des dépôts jaunâtres près des yeux ou sur les tendons (rare)',
        'Plus de 40 ans, ou plus jeune si un autre risque est présent',
      ],
      outro:
        "Dans la plupart des cas, aucun signe n'apparaît : c'est le bilan qui informe. N'attendez pas de vous sentir mal pour le faire. [À compléter par le Dr Fall]",
    },
    priseEnCharge: {
      intro:
        'La première consultation fait le point sur vos risques : famille, habitudes, traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :',
      examens: [
        {
          nom: 'Bilan des graisses du sang',
          texte:
            "Une prise de sang qui mesure le cholestérol (total, LDL, HDL) et les triglycérides. Le cabinet vous indique s'il faut être à jeun. [À préciser par la doctoresse]",
        },
        {
          nom: 'Sucre dans le sang',
          texte: 'La glycémie, car cholestérol et sucre vont souvent ensemble. [À préciser]',
        },
        {
          nom: 'Tension et tour de taille',
          texte: "Deux mesures simples, faites au cabinet, qui complètent l'image de votre risque.",
        },
        {
          nom: "D'autres examens si nécessaire",
          texte:
            'Selon votre âge et vos antécédents, le médecin peut vous orienter vers des examens du cœur ou des artères. [À préciser]',
        },
      ],
    },
    quotidien: [
      {
        titre: 'Une alimentation moins grasse et plus riche en fibres',
        texte:
          'Moins de fritures et de graisses cuites, plus de légumes, de légumineuses et de poisson, adaptés à votre cuisine. [À valider]',
      },
      {
        titre: 'Bouger régulièrement',
        texte:
          'Une marche rapide la plupart des jours aide déjà le cholestérol et le cœur. [Durée et fréquence à préciser]',
      },
      {
        titre: 'Arrêter de fumer',
        texte:
          "C'est l'une des choses les plus utiles pour protéger les artères. Nous pouvons vous aider à y arriver. [À valider]",
      },
      {
        titre: 'Un contrôle régulier',
        texte:
          'Des prises de sang de contrôle montrent si les chiffres baissent et si le plan marche. [Rythme à préciser]',
      },
    ],
    urgence:
      "Contactez immédiatement les urgences en cas de douleur ou de serrement dans la poitrine, d'essoufflement soudain, de faiblesse ou d'engourdissement d'un côté du corps, de bouche déformée ou de difficulté à parler. Numéro d'urgence :",
    faqTitle: 'Questions fréquentes sur le cholestérol',
    faq: [
      {
        question: 'Faut-il toujours un médicament ?',
        reponse:
          "Non. Selon le niveau et vos autres risques, l'alimentation et le mouvement peuvent suffire. Le médecin décide avec vous. [Réponse à valider]",
      },
      {
        question: 'Dois-je être à jeun pour la prise de sang ?',
        reponse: '[À confirmer par la doctoresse.]',
      },
      {
        question: 'Mon cholestérol est élevé alors que je suis mince. Est-ce possible ?',
        reponse:
          "Oui. L'hérédité joue beaucoup, et on peut avoir un cholestérol élevé sans surpoids. Un avis médical est utile. [Réponse à valider]",
      },
      {
        question: 'À partir de quel âge faut-il faire un bilan ?',
        reponse:
          'Cela dépend de vos risques. Le médecin vous le dira à la consultation. [À confirmer par la doctoresse]',
      },
    ],
    aside: {
      title: 'Une prévention du cœur au cabinet',
      apporter:
        'Vos analyses récentes (cholestérol, sucre), vos ordonnances, la liste de vos médicaments et ce que vous savez des maladies du cœur dans votre famille.',
    },
    cta: 'Protéger son cœur, dès maintenant.',
  },
};
