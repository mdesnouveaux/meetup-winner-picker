import { randomInt } from 'crypto';
import seedrandom from 'seedrandom';
import { Participant, PickOptions, PickResult } from '../types/participant';
import { generateVerificationHash } from '../utils/hash';

/**
 * Erreur de sélection
 */
export class PickerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PickerError';
  }
}

/**
 * Sélectionne aléatoirement des gagnants parmi les participants
 *
 * Utilise crypto.randomInt() pour une sélection cryptographiquement sécurisée,
 * ou un générateur seedé pour la reproductibilité.
 *
 * Algorithme: Fisher-Yates shuffle pour sélection équitable
 *
 * @param participants - Liste des participants
 * @param options - Options de sélection
 * @returns Résultat du tirage avec gagnants et métadonnées
 * @throws PickerError si les paramètres sont invalides
 *
 * @example
 * ```typescript
 * const participants = [
 *   { nom: 'Alice' },
 *   { nom: 'Bob' },
 *   { nom: 'Charlie' }
 * ];
 *
 * // Sélection simple
 * const result = selectWinners(participants);
 * console.log(result.winners[0].nom);
 *
 * // Sélection multiple avec seed
 * const result2 = selectWinners(participants, {
 *   count: 2,
 *   seed: 'meetup-2025'
 * });
 * ```
 */
export function selectWinners(participants: Participant[], options: PickOptions = {}): PickResult {
  const { count = 1, seed, exclude = [] } = options;

  // Validation
  if (!participants || participants.length === 0) {
    throw new PickerError('La liste des participants est vide');
  }

  if (count < 1) {
    throw new PickerError('Le nombre de gagnants doit être au moins 1');
  }

  if (!Number.isInteger(count)) {
    throw new PickerError('Le nombre de gagnants doit être un entier');
  }

  // Filtrer les participants exclus
  const eligible = participants.filter(
    (p) => !exclude.some((ex) => ex.toLowerCase() === p.nom.toLowerCase())
  );

  if (eligible.length === 0) {
    throw new PickerError('Aucun participant éligible après exclusions');
  }

  if (count > eligible.length) {
    throw new PickerError(
      `Impossible de sélectionner ${count} gagnant(s) parmi ${eligible.length} participant(s) éligible(s)`
    );
  }

  // Timestamp du tirage
  const timestamp = new Date();

  // Créer une copie pour ne pas modifier l'original
  const pool = [...eligible];

  // Fonction de random selon seed ou crypto
  const getRandom = seed ? createSeededRandom(seed) : createCryptoRandom();

  // Fisher-Yates shuffle pour sélectionner les gagnants
  const winners: Participant[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = getRandom(pool.length);
    winners.push(pool[randomIndex]);
    // Retirer le gagnant du pool pour éviter les doublons
    pool.splice(randomIndex, 1);
  }

  // Générer hash de vérification
  const hash = generateVerificationHash(eligible, timestamp, seed);

  return {
    winners,
    timestamp,
    seed,
    totalParticipants: eligible.length,
    hash,
  };
}

/**
 * Crée un générateur de nombres aléatoires cryptographiquement sécurisé
 */
function createCryptoRandom(): (max: number) => number {
  return (max: number) => randomInt(0, max);
}

/**
 * Crée un générateur de nombres aléatoires avec seed
 * Permet la reproductibilité du tirage
 */
function createSeededRandom(seed: string): (max: number) => number {
  const rng = seedrandom(seed);
  return (max: number) => Math.floor(rng() * max);
}
