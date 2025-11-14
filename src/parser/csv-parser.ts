import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { Participant } from '../types/participant';

/**
 * Options pour le parser CSV
 */
export interface CSVParserOptions {
  /** Suppression des doublons (par nom) */
  removeDuplicates?: boolean;
  /** Encodage du fichier (défaut: utf-8) */
  encoding?: BufferEncoding;
}

/**
 * Erreur de parsing CSV
 */
export class CSVParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVParserError';
  }
}

/**
 * Parse un fichier CSV contenant la liste des participants
 *
 * Format attendu:
 * - Première ligne: en-têtes (nom, email)
 * - Lignes suivantes: données des participants
 *
 * @param filePath - Chemin vers le fichier CSV
 * @param options - Options de parsing
 * @returns Liste des participants
 * @throws CSVParserError si le fichier est invalide
 *
 * @example
 * ```typescript
 * const participants = parseParticipants('participants.csv');
 * console.log(`${participants.length} participants chargés`);
 * ```
 */
export function parseParticipants(filePath: string, options: CSVParserOptions = {}): Participant[] {
  const { removeDuplicates = true, encoding = 'utf-8' } = options;

  try {
    // Lire le fichier
    const fileContent = readFileSync(filePath, { encoding });

    // Parser le CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true, // Support UTF-8 BOM
    });

    // Valider et mapper les participants
    const participants: Participant[] = records.map((record: any, index: number) => {
      // Vérifier que le champ 'nom' existe
      if (!record.nom || typeof record.nom !== 'string') {
        throw new CSVParserError(
          `Ligne ${index + 2}: le champ 'nom' est requis et doit être une chaîne de caractères`
        );
      }

      const nom = record.nom.trim();
      if (nom.length === 0) {
        throw new CSVParserError(`Ligne ${index + 2}: le nom ne peut pas être vide`);
      }

      // Email optionnel (ignorer si vide ou que des espaces)
      const trimmedEmail =
        record.email && typeof record.email === 'string' ? record.email.trim() : '';
      const email = trimmedEmail.length > 0 ? trimmedEmail : undefined;

      return { nom, email };
    });

    // Vérifier qu'il y a au moins un participant
    if (participants.length === 0) {
      throw new CSVParserError('Le fichier CSV ne contient aucun participant valide');
    }

    // Supprimer les doublons si demandé
    if (removeDuplicates) {
      const seen = new Set<string>();
      const unique: Participant[] = [];

      for (const participant of participants) {
        const key = participant.nom.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(participant);
        }
      }

      return unique;
    }

    return participants;
  } catch (error) {
    if (error instanceof CSVParserError) {
      throw error;
    }

    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new CSVParserError(`Fichier non trouvé: ${filePath}`);
    }

    if (error instanceof Error) {
      throw new CSVParserError(`Erreur lors de la lecture du fichier CSV: ${error.message}`);
    }

    throw new CSVParserError('Erreur inconnue lors du parsing du CSV');
  }
}
