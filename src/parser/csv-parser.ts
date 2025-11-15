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
 * Détermine quelle colonne utiliser pour le nom du participant
 * Supporte à la fois le format français (nom) et anglais/Meetup (Name)
 */
function detectNameColumn(record: any): string | null {
  // Priorité : nom > Name
  // Vérifier l'existence de la propriété, pas sa valeur (pour gérer les chaînes vides)
  if ('nom' in record) return 'nom';
  if ('Name' in record) return 'Name';
  return null;
}

/**
 * Détermine quelle colonne utiliser pour l'email du participant
 * Supporte à la fois le format français (email) et anglais/Meetup (Email)
 */
function detectEmailColumn(record: any): string | null {
  if (record.email !== undefined) return 'email';
  if (record.Email !== undefined) return 'Email';
  return null;
}

/**
 * Vérifie si l'email est masqué par Meetup (format "Email hidden • Upgrade to Pro...")
 */
function isHiddenMeetupEmail(email: string): boolean {
  return email.includes('Email hidden') || email.includes('Upgrade to Pro');
}

/**
 * Parse un fichier CSV contenant la liste des participants
 *
 * Formats supportés:
 * - Format français: colonnes 'nom' et 'email' (optionnel)
 * - Format Meetup: colonnes 'Name' et 'Email' (optionnel)
 * - Les emails masqués Meetup sont automatiquement traités comme undefined
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

    // Détection des colonnes (effectuée sur le premier enregistrement)
    let nameColumn: string | null = null;
    let emailColumn: string | null = null;

    // Valider et mapper les participants
    const participants: Participant[] = records.map((record: any, index: number) => {
      // Numéro de ligne dans le fichier : index (0-based) + 1 (header) + 1 (conversion 1-based) = index + 2
      const lineNumber = index + 2;

      // Détection des colonnes au premier enregistrement
      if (index === 0) {
        nameColumn = detectNameColumn(record);
        emailColumn = detectEmailColumn(record);

        if (!nameColumn) {
          throw new CSVParserError(
            `Le fichier CSV doit contenir une colonne 'nom' ou 'Name' pour les noms des participants`
          );
        }
      }

      // Vérifier que le champ nom existe
      const nameValue = record[nameColumn!];
      if (!nameValue || typeof nameValue !== 'string') {
        throw new CSVParserError(
          `Ligne ${lineNumber}: le champ '${nameColumn}' est requis et doit être une chaîne de caractères`
        );
      }

      const nom = nameValue.trim();
      if (nom.length === 0) {
        throw new CSVParserError(`Ligne ${lineNumber}: le nom ne peut pas être vide`);
      }

      // Email optionnel (ignorer si vide, que des espaces, ou email masqué Meetup)
      let email: string | undefined = undefined;
      if (emailColumn) {
        const emailValue = record[emailColumn];
        if (emailValue && typeof emailValue === 'string') {
          const trimmedEmail = emailValue.trim();
          // Vérifier que l'email n'est pas vide et n'est pas un email masqué Meetup
          if (trimmedEmail.length > 0 && !isHiddenMeetupEmail(trimmedEmail)) {
            email = trimmedEmail;
          }
        }
      }

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
