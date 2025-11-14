import { createHash } from 'crypto';
import { Participant } from '../types/participant';

/**
 * Génère un hash de vérification pour un tirage au sort
 *
 * Ce hash permet de vérifier l'intégrité et l'authenticité d'un tirage.
 * Il est généré à partir des participants, du timestamp, et du seed.
 *
 * @param participants - Liste des participants éligibles
 * @param timestamp - Date du tirage
 * @param seed - Seed utilisé (optionnel)
 * @returns Hash SHA-256 en hexadécimal
 */
export function generateVerificationHash(
  participants: Participant[],
  timestamp: Date,
  seed?: string
): string {
  const hash = createHash('sha256');

  // Ajouter les participants (triés pour cohérence)
  const sortedNames = participants.map((p) => p.nom).sort();
  hash.update(sortedNames.join(','));

  // Ajouter le timestamp
  hash.update(timestamp.toISOString());

  // Ajouter le seed si présent
  if (seed) {
    hash.update(seed);
  }

  return hash.digest('hex');
}
