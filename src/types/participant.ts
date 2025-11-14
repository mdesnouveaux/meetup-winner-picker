/**
 * Représente un participant à l'événement
 */
export interface Participant {
  /** Nom complet du participant */
  nom: string;
  /** Email du participant (optionnel) */
  email?: string;
}

/**
 * Options pour la sélection des gagnants
 */
export interface PickOptions {
  /** Nombre de gagnants à sélectionner (défaut: 1) */
  count?: number;
  /** Seed pour reproductibilité du tirage */
  seed?: string;
  /** Liste des noms à exclure du tirage */
  exclude?: string[];
}

/**
 * Résultat d'un tirage au sort
 */
export interface PickResult {
  /** Liste des gagnants sélectionnés */
  winners: Participant[];
  /** Date et heure du tirage */
  timestamp: Date;
  /** Seed utilisé (si fourni) */
  seed?: string;
  /** Nombre total de participants éligibles */
  totalParticipants: number;
  /** Hash de vérification pour audit */
  hash: string;
}
