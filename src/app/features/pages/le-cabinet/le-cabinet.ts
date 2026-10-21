import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { CtaBand } from '../../../shared/cta-band/cta-band';

/** Texte d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
@Component({
  selector: 'app-le-cabinet',
  imports: [RouterLink, PublicPage, PageHero, CtaBand],
  styleUrl: './le-cabinet.css',
  templateUrl: './le-cabinet.html',
})
export class LeCabinet {
  readonly crumbs = [{ label: 'Accueil', route: '/' }, { label: 'Le cabinet' }];

  readonly enBref = [
    {
      label: 'LA SPÉCIALITÉ',
      texte:
        'Endocrinologie, diabétologie et nutrition : diabète, thyroïde, poids, troubles hormonaux, cholestérol.',
    },
    { label: 'LE LIEU', texte: 'Sacré-Cœur 3, Dakar. [Étage, repère et accès à préciser]' },
    {
      label: "L'ACCUEIL",
      texte: "Sur rendez-vous, pour prendre le temps d'écouter. [À valider par la doctoresse]",
    },
  ];

  readonly etapes = [
    {
      n: '1',
      titre: 'Accueil',
      texte: 'Vous êtes accueilli, vos informations sont vérifiées et votre dossier est prêt.',
    },
    {
      n: '2',
      titre: 'Consultation',
      texte: 'La doctoresse écoute votre histoire, examine et explique, sans se presser.',
    },
    {
      n: '3',
      titre: 'Examens',
      texte: 'Prise de sang, échographie ou mesures selon votre situation. [À préciser]',
    },
    {
      n: '4',
      titre: 'Plan de suivi',
      texte: 'Un plan clair, des rendez-vous planifiés et vos documents dans Mon espace.',
    },
  ];

  readonly lieux = [
    {
      sym: 'Sa',
      titre: "Salle d'attente",
      texte: '[Description : confort, climatisation, lecture… à compléter]',
    },
    {
      sym: 'Me',
      titre: 'Mesures sur place',
      texte: 'Poids, taille, tension. [Matériel exact à préciser]',
    },
    { sym: 'Éc', titre: 'Échographie', texte: '[À confirmer : réalisée au cabinet ou non]' },
    {
      sym: 'Es',
      titre: 'Mon espace',
      texte:
        'Vos rendez-vous et vos documents, accessibles en ligne après création de votre compte.',
    },
    {
      sym: 'Ac',
      titre: 'Accessibilité',
      texte: '[Parking, accès pour personnes à mobilité réduite, ascenseur : à préciser]',
    },
    { sym: 'Hy', titre: 'Hygiène', texte: "[Engagements d'hygiène du cabinet : à compléter]" },
  ];

  readonly equipe = [
    {
      photo: 'PHOTO : la doctoresse [à fournir]',
      nom: 'Dr Aïssatou Mamadou Fall',
      role: 'Médecin endocrinologue et nutritionniste',
      texte:
        'Voir sa présentation et son parcours dans la page À propos. [Orthographe du prénom à confirmer]',
    },
    {
      photo: 'PHOTO : [à fournir]',
      nom: '[Nom]',
      role: '[Secrétaire médicale]',
      texte: "[Rôle et mots d'accueil à compléter]",
    },
    {
      photo: 'PHOTO : [à fournir]',
      nom: '[Nom]',
      role: '[Diététicienne, infirmière… si applicable]',
      texte: '[À compléter, ou supprimer cette carte]',
    },
  ];
}
