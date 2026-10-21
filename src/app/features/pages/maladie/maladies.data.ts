import { MaladieArtKind } from '../../../shared/maladie-art/maladie-art';

export interface MaladieContent {
  slug: string;
  crumb: string;
  title: string;
  lead: string;
  heroArt: MaladieArtKind;
  heroLabel: string;
  essentiel: { quoi: string; quand: string; suivi: string; urgence: string };
  definition: { title: string; text: string; imageTitle: string; imageIntro: string; cards: { art: MaladieArtKind; title: string; text: string }[] };
  signes: { items: string[]; outro: string };
  priseEnCharge: { intro: string; examens: { nom: string; texte: string }[] };
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
    "slug": "diabete",
    "crumb": "Diabète",
    "title": "Diabète : comprendre, suivre, vivre mieux",
    "lead": "Le diabète est une maladie chronique qui se caractérise par un taux de sucre (glycémie) trop élevé dans le sang. Bien suivi, il permet de mener une vie normale et d'éviter la plupart des complications.",
    "heroArt": "diabete-hero",
    "heroLabel": "VOTRE GLYCÉMIE SUR UNE JOURNÉE (SCHÉMA)",
    "essentiel": {
      "quoi": "Un taux de sucre trop élevé dans le sang, parce que l'insuline manque ou agit mal. Bien suivi, il permet de vivre normalement.",
      "quand": "Soif intense, envie fréquente d'uriner, fatigue inhabituelle, vision floue. Ou si vous avez des proches diabétiques.",
      "suivi": "Un bilan (glycémie, HbA1c), un plan adapté à votre alimentation, puis des rendez-vous réguliers.",
      "urgence": "malaise, confusion, vomissements répétés. Ne pas attendre, appelez le SAMU au 1515."
    },
    "definition": {
      "title": "Qu'est-ce que le diabète ?",
      "text": "Le diabète apparaît quand l'organisme ne produit pas assez d'insuline ou ne l'utilise pas correctement. L'insuline est l'hormone qui permet au sucre de passer du sang vers les cellules, où il sert d'énergie. Quand elle fait défaut, le sucre s'accumule dans le sang.",
      "imageTitle": "En image : le rôle de l'insuline",
      "imageIntro": "Imaginez l'insuline comme une clé. Elle ouvre la porte des cellules pour que le sucre du sang y entre et serve d'énergie.",
      "cards": [
        {
          "art": "diabete-ok",
          "title": "Quand tout va bien",
          "text": "La clé tourne, la porte s'ouvre, le sucre entre dans la cellule."
        },
        {
          "art": "diabete-type1",
          "title": "Type 1 : il manque la clé",
          "text": "Le corps ne produit presque plus d'insuline : la porte reste fermée, le sucre s'accumule dans le sang. Il apparaît souvent chez l'enfant ou le jeune adulte et demande un traitement par insuline."
        },
        {
          "art": "diabete-type2",
          "title": "Type 2 : la clé tourne mal",
          "text": "L'insuline est là, mais elle agit mal : la porte s'ouvre à peine. C'est le plus fréquent, favorisé par l'âge, le surpoids, le manque d'activité physique et l'hérédité. Il demande un traitement et un mode de vie adaptés."
        },
        {
          "art": "diabete-gest",
          "title": "Diabète gestationnel",
          "text": "Il apparaît pendant la grossesse, comme un type 2 temporaire, et impose un suivi rapproché pour protéger la mère et l'enfant."
        }
      ]
    },
    "signes": {
      "items": [
        "Soif intense et bouche sèche",
        "Envie d'uriner très fréquente",
        "Fatigue inhabituelle",
        "Amaigrissement sans raison",
        "Vision floue",
        "Infections répétées, plaies qui cicatrisent mal"
      ],
      "outro": "Le diabète de type 2 peut aussi ne donner aucun signe pendant des années. Si vous avez des proches diabétiques, un excès de poids ou plus de 40 ans, un dépistage est conseillé."
    },
    "priseEnCharge": {
      "intro": "La première consultation permet de comprendre votre histoire, vos habitudes et votre traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :",
      "examens": [
        {
          "nom": "Glycémie à jeun",
          "texte": "Mesure le taux de sucre dans le sang le matin, à jeun."
        },
        {
          "nom": "HbA1c",
          "texte": "Reflète la moyenne de la glycémie sur les trois derniers mois. C'est l'examen de référence du suivi."
        },
        {
          "nom": "Bilan lipidique",
          "texte": "Cholestérol et triglycérides, importants pour protéger le cœur et les vaisseaux."
        },
        {
          "nom": "Fonction rénale",
          "texte": "Surveille l'état des reins, qui peuvent être touchés par un diabète mal équilibré."
        },
        {
          "nom": "Fond d'œil et pieds",
          "texte": "Un contrôle régulier des yeux et des pieds permet de repérer très tôt les complications. [Examens réalisés au cabinet : à préciser]"
        }
      ]
    },
    "quotidien": [
      {
        "titre": "Alimentation",
        "texte": "Répartir les glucides sur la journée, privilégier les fibres, les légumes et les céréales complètes. Nous adaptons les conseils à votre cuisine."
      },
      {
        "titre": "Activité physique",
        "texte": "Une marche rapide de 30 minutes la plupart des jours aide déjà à mieux contrôler la glycémie. [Conseils à adapter]"
      },
      {
        "titre": "Traitement",
        "texte": "Prendre son traitement tel que prescrit, et ne jamais l'arrêter sans en parler. Nous l'ajustons à chaque consultation."
      },
      {
        "titre": "Surveillance",
        "texte": "Mesurer sa glycémie aux moments conseillés et noter les résultats pour en discuter ensemble."
      }
    ],
    "urgence": "Contactez immédiatement les urgences en cas de malaise, de confusion, de vomissements répétés avec une soif intense, de respiration anormalement rapide, ou de tremblements et de sueurs qui ne passent pas après avoir pris du sucre. [Numéro d'urgence ou structure à contacter : à confirmer par la doctoresse]",
    "faqTitle": "Questions fréquentes sur le diabète",
    "faq": [
      {
        "question": "Le diabète peut-il guérir ?",
        "reponse": "Le diabète est une maladie chronique : on ne le guérit pas, mais on peut très bien le contrôler. Dans certains cas de type 2, une perte de poids et un meilleur mode de vie permettent d'obtenir une rémission. [Réponse à valider]"
      },
      {
        "question": "Puis-je jeûner pendant le Ramadan ?",
        "reponse": "Cela dépend de votre type de diabète, de votre traitement et de votre équilibre. Certaines personnes ne doivent pas jeûner. Parlez-en avec votre médecin plusieurs semaines avant. [Réponse à valider]"
      },
      {
        "question": "Mon enfant peut-il avoir un diabète ?",
        "reponse": "Oui, le diabète de type 1 touche surtout les enfants et les jeunes. Une soif intense, des urines fréquentes et un amaigrissement doivent conduire à consulter rapidement."
      }
    ],
    "aside": {
      "title": "Un suivi du diabète au cabinet",
      "apporter": "Vos analyses récentes, vos ordonnances, la liste de vos médicaments et, si vous en avez un, votre carnet de glycémie."
    },
    "cta": "Un suivi du diabète, à votre rythme."
  },
  thyroide: {
    "slug": "thyroide",
    "crumb": "Thyroïde",
    "title": "Thyroïde : comprendre, soigner, retrouver son énergie",
    "lead": "La thyroïde est une petite glande en forme de papillon, à la base du cou. Elle règle l'énergie du corps : le rythme du cœur, la chaleur, le poids, l'humeur. Bien suivie, elle se soigne très bien.",
    "heroArt": "thyroide-hero",
    "heroLabel": "LE THERMOSTAT DU CORPS (SCHÉMA)",
    "essentiel": {
      "quoi": "Une glande du cou qui produit les hormones de l'énergie. Trop peu (hypothyroïdie) ou trop (hyperthyroïdie), le corps se dérègle, mais cela se traite.",
      "quand": "Fatigue ou nervosité inhabituelles, poids qui change sans raison, cœur qui s'emballe, frilosité ou chaleur, gonflement du cou.",
      "suivi": "Une prise de sang (TSH), souvent une échographie du cou, un traitement adapté, puis un suivi régulier des analyses.",
      "urgence": "palpitations très fortes avec douleur dans la poitrine, difficulté à respirer ou à avaler, gonflement rapide du cou. Ne pas attendre, appelez le SAMU au 1515."
    },
    "definition": {
      "title": "À quoi sert la thyroïde ?",
      "text": "La thyroïde fabrique deux hormones (T3 et T4) qui indiquent au corps à quelle vitesse fonctionner. Un autre organe, l'hypophyse, la surveille avec la TSH et lui demande d'en produire plus ou moins. Quand ce réglage se dérègle, le corps va trop lentement ou trop vite.",
      "imageTitle": "En image : le thermostat du corps",
      "imageIntro": "Imaginez la thyroïde comme le thermostat du corps : trop bas, tout ralentit ; trop haut, tout s'emballe ; au bon réglage, on se sent bien. Les nodules, eux, sont des petites boules dans la glande.",
      "cards": [
        {
          "art": "thyroide-low",
          "title": "Hypothyroïdie",
          "text": "La thyroïde produit trop peu : fatigue, frilosité, prise de poids, lenteur. C'est la forme la plus fréquente, souvent due à une maladie auto-immune. Un traitement quotidien rétablit l'équilibre."
        },
        {
          "art": "thyroide-ok",
          "title": "Au bon réglage",
          "text": "Les hormones sont en équilibre : énergie, poids et humeur stables."
        },
        {
          "art": "thyroide-high",
          "title": "Hyperthyroïdie",
          "text": "La thyroïde produit trop : cœur rapide, nervosité, amaigrissement, chaleur. Plusieurs causes sont possibles et le traitement dépend de la cause. [À préciser par la doctoresse]"
        },
        {
          "art": "thyroide-nodule",
          "title": "Nodules et goitre",
          "text": "Une boule ou un gonflement du cou. La grande majorité des nodules sont bénins, mais un bilan est nécessaire pour le confirmer."
        }
      ]
    },
    "signes": {
      "items": [
        "Fatigue inhabituelle ou, au contraire, grande nervosité",
        "Poids qui change sans raison apparente",
        "Frilosité, ou sensation de chaleur et sueurs",
        "Cœur très lent, ou palpitations",
        "Gonflement ou gêne au niveau du cou",
        "Peau sèche, cheveux fragiles, cycles irréguliers"
      ],
      "outro": "Les troubles de la thyroïde s'installent lentement et se confondent facilement avec la fatigue ou le stress. Une prise de sang simple permet de savoir. Si vous avez des antécédents familiaux, un bilan est conseillé."
    },
    "priseEnCharge": {
      "intro": "La première consultation permet de comprendre votre histoire, vos habitudes et votre traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :",
      "examens": [
        {
          "nom": "Prise de sang (TSH)",
          "texte": "Le dosage de la TSH est l'examen de base : il dit si la thyroïde est lente, rapide ou équilibrée."
        },
        {
          "nom": "T4 libre et T3",
          "texte": "Complètent la TSH pour mesurer précisément les hormones thyroïdiennes."
        },
        {
          "nom": "Anticorps thyroïdiens",
          "texte": "Cherchent une maladie auto-immune, cause fréquente des dérèglements."
        },
        {
          "nom": "Échographie du cou",
          "texte": "Examine la taille et l'aspect de la glande et repère d'éventuels nodules. [Réalisée au cabinet ? À préciser]"
        },
        {
          "nom": "Examens complémentaires",
          "texte": "Scintigraphie ou ponction d'un nodule dans certains cas, sur décision du médecin. [À préciser]"
        }
      ]
    },
    "quotidien": [
      {
        "titre": "Un traitement régulier",
        "texte": "Le traitement se prend tous les jours, à heure fixe, et ne s'arrête pas sans avis médical. Nous l'ajustons selon vos analyses."
      },
      {
        "titre": "Une alimentation variée",
        "texte": "Pas de régime particulier, mais évitez les compléments « pour la thyroïde » ou riches en iode sans avis du médecin. [À valider]"
      },
      {
        "titre": "Des analyses de contrôle",
        "texte": "Une prise de sang régulière permet de vérifier l'équilibre. Le rythme est adapté à votre situation. [À préciser]"
      },
      {
        "titre": "Grossesse et projet de bébé",
        "texte": "Une thyroïde mal équilibrée peut gêner la grossesse. Parlez-en avant d'avoir un bébé, ou dès que vous êtes enceinte."
      }
    ],
    "urgence": "Contactez immédiatement les urgences en cas de palpitations très fortes avec douleur dans la poitrine, de difficulté à respirer ou à avaler, de malaise, ou de gonflement très rapide du cou. [Numéro d'urgence ou structure à contacter : à confirmer par la doctoresse]",
    "faqTitle": "Questions fréquentes sur la thyroïde",
    "faq": [
      {
        "question": "Un nodule à la thyroïde est-il un cancer ?",
        "reponse": "Non, dans la grande majorité des cas, les nodules sont bénins. Un bilan avec échographie permet de savoir lesquels doivent être surveillés ou examinés davantage. [Réponse à valider]"
      },
      {
        "question": "Faut-il prendre le traitement toute sa vie ?",
        "reponse": "Cela dépend de la cause. Dans beaucoup d'hypothyroïdies, le traitement est durable ; dans d'autres situations, il est temporaire. Votre médecin vous l'explique après le bilan. [Réponse à valider]"
      },
      {
        "question": "Faut-il être à jeun pour la prise de sang ?",
        "reponse": "[À confirmer par la doctoresse.]"
      }
    ],
    "aside": {
      "title": "Un suivi de la thyroïde au cabinet",
      "apporter": "Vos analyses récentes, vos ordonnances, la liste de vos médicaments et vos anciens résultats de thyroïde (TSH) si vous en avez."
    },
    "cta": "Retrouver son énergie, pas à pas."
  },
  obesite: {
    "slug": "obesite",
    "crumb": "Obésité et surpoids",
    "title": "Poids : être accompagné, sans jugement, à votre rythme",
    "lead": "Le poids ne dépend pas que de la volonté : l'alimentation, le sommeil, le stress, les hormones et l'hérédité jouent tous un rôle. Nous cherchons ce qui bloque, puis nous avançons pas à pas.",
    "heroArt": "obesite-hero",
    "heroLabel": "UN POIDS, PLUSIEURS LEVIERS (SCHÉMA)",
    "essentiel": {
      "quoi": "Un excès de masse grasse qui peut peser sur la santé : cœur, diabète, articulations. L'IMC aide à se situer, mais il ne dit pas tout.",
      "quand": "Poids qui augmente malgré vos efforts, essoufflement, douleurs des genoux ou du dos, glycémie ou tension élevées, envie de reprendre la main.",
      "suivi": "Un bilan complet (habitudes, analyses, recherche d'une cause hormonale), des objectifs réalistes, un plan alimentaire adapté, puis un suivi régulier.",
      "urgence": "essoufflement soudain, douleur dans la poitrine, malaise. Ne pas attendre, appelez le SAMU au 1515."
    },
    "definition": {
      "title": "Pourquoi le poids change",
      "text": "Prendre du poids n'est pas un manque de volonté. Le corps règle son poids grâce à des hormones, au sommeil, au stress, à l'alimentation et à l'hérédité. Quand l'un de ces leviers se dérègle, le poids peut monter, même en faisant des efforts. Le surpoids commence à un IMC de 25, l'obésité à 30, mais l'IMC ne dit pas tout : le tour de taille et votre santé comptent aussi.",
      "imageTitle": "En image : un poids, plusieurs leviers",
      "imageIntro": "Voici quatre des leviers sur lesquels nous travaillons ensemble. Chacun peut se régler, un à la fois.",
      "cards": [
        {
          "art": "obesite-balance",
          "title": "Ce qu'on mange, ce qu'on dépense",
          "text": "Une balance simple en apparence, mais qui dépend de la faim, de l'énergie du corps et du mode de vie. Nous cherchons un équilibre réaliste, sans interdits."
        },
        {
          "art": "obesite-sleep",
          "title": "Le sommeil et le stress",
          "text": "Dormir peu et vivre sous pression poussent à grignoter et à stocker. Mieux dormir et mieux gérer le stress aide souvent autant que l'assiette. [À valider]"
        },
        {
          "art": "obesite-hormones",
          "title": "Les hormones",
          "text": "Des signaux de faim et de satiété règlent l'appétit. Une cause médicale (thyroïde, ovaires polykystiques, certains médicaments) peut aussi se cacher derrière une prise de poids. [À préciser]"
        },
        {
          "art": "obesite-steps",
          "title": "Un palier à la fois",
          "text": "Perdre 5 à 10 % de son poids apporte déjà un vrai bénéfice pour la santé. Nous fixons de petits objectifs, puis nous les ajustons. [Chiffre à valider]"
        }
      ]
    },
    "signes": {
      "items": [
        "Un poids qui augmente malgré vos efforts",
        "Essoufflement en montant un escalier ou en marchant",
        "Tour de taille qui augmente",
        "Fringales ou grignotage difficiles à contrôler",
        "Douleurs des genoux, des hanches ou du dos",
        "Ronflements, fatigue au réveil, glycémie ou tension élevées"
      ],
      "outro": "La prise de poids s'installe souvent lentement, et chacun la vit différemment. Il n'y a pas de honte à demander de l'aide : un bilan permet de comprendre ce qui se passe, y compris une éventuelle cause médicale."
    },
    "priseEnCharge": {
      "intro": "La première consultation permet de comprendre votre histoire, vos habitudes et votre traitement éventuel. Selon votre situation, nous réalisons ou demandons les examens suivants :",
      "examens": [
        {
          "nom": "Histoire du poids",
          "texte": "Nous retraçons ensemble l'évolution de votre poids, vos tentatives passées, vos habitudes et votre contexte de vie, sans jugement."
        },
        {
          "nom": "Poids, taille, tour de taille",
          "texte": "L'IMC et le tour de taille donnent un point de départ clair pour fixer des objectifs réalistes."
        },
        {
          "nom": "Bilan sanguin",
          "texte": "Glycémie, cholestérol, bilan de la thyroïde et autres analyses selon votre situation. [À préciser par la doctoresse]"
        },
        {
          "nom": "Recherche d'une cause hormonale",
          "texte": "Pour repérer une thyroïde lente, un syndrome des ovaires polykystiques ou un excès de cortisol. [À préciser]"
        },
        {
          "nom": "Bilan alimentaire",
          "texte": "Un échange sur vos repas, parfois un carnet alimentaire de quelques jours, pour adapter le plan à votre vie. [Mesure de la composition corporelle ? À préciser]"
        }
      ]
    },
    "quotidien": [
      {
        "titre": "Des objectifs réalistes",
        "texte": "De petits paliers, adaptés à votre rythme, valent mieux qu'un régime strict qu'on abandonne. Nous les révisons à chaque consultation."
      },
      {
        "titre": "Une alimentation sans interdits",
        "texte": "Pas de régime miracle ni d'aliments bannis : un plan simple, qui respecte vos habitudes et votre culture alimentaire. [À valider]"
      },
      {
        "titre": "Bouger à sa façon",
        "texte": "Marche, danse, escaliers : on choisit une activité qui vous convient et on augmente doucement. [À préciser]"
      },
      {
        "titre": "Un suivi régulier",
        "texte": "Des consultations rapprochées au début, pour ajuster, encourager et traiter les difficultés comme le sommeil ou le stress. [Rythme à préciser]"
      }
    ],
    "urgence": "Contactez immédiatement les urgences en cas d'essoufflement soudain, de douleur dans la poitrine, de malaise, de gonflement rapide d'une jambe ou de prise de poids très rapide avec œdèmes. [Numéro d'urgence ou structure à contacter : à confirmer par la doctoresse]",
    "faqTitle": "Questions fréquentes sur le poids",
    "faq": [
      {
        "question": "Faut-il suivre un régime strict ?",
        "reponse": "Non. Les régimes très stricts fonctionnent rarement à long terme. Nous construisons avec vous un plan réaliste, adapté à votre vie. [Réponse à valider]"
      },
      {
        "question": "Prendre du poids, est-ce un manque de volonté ?",
        "reponse": "Non. Les hormones, le sommeil, le stress, certains médicaments et l'hérédité pèsent beaucoup. Le bilan sert justement à comprendre ce qui se passe pour vous. [Réponse à valider]"
      },
      {
        "question": "Existe-t-il des traitements ou une chirurgie ?",
        "reponse": "[À confirmer par la doctoresse : traitements proposés au cabinet, orientation éventuelle vers une chirurgie.]"
      }
    ],
    "aside": {
      "title": "Un accompagnement du poids au cabinet",
      "apporter": "Vos analyses récentes, vos ordonnances, la liste de vos médicaments, votre poids de départ et, si possible, ce que vous mangez sur une journée type."
    },
    "cta": "Avancer pas à pas, ensemble."
  },
};
