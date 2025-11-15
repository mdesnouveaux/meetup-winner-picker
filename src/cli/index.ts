#!/usr/bin/env node

import { Command } from 'commander';
import { writeFileSync } from 'fs';
import { parseParticipants, CSVParserError } from '../parser/csv-parser';
import { selectWinners, PickerError } from '../picker/random-selector';
import {
  formatResult,
  formatResultJSON,
  formatError,
  formatLoading,
  formatSuccess,
} from './formatter';

const program = new Command();

program
  .name('meetup-picker')
  .description("Sélectionne aléatoirement un gagnant parmi les participants d'un événement Meetup")
  .version('1.0.0');

program
  .command('pick')
  .description("Effectue un tirage au sort parmi les participants d'un fichier CSV")
  .argument('<file>', 'Fichier CSV contenant les participants (colonnes: nom, email)')
  .option('-n, --number <count>', 'Nombre de gagnants à sélectionner', '1')
  .option('-s, --seed <value>', 'Seed pour reproductibilité du tirage')
  .option('--exclude <names>', 'Noms à exclure du tirage (séparés par des virgules)')
  .option('-o, --output <file>', 'Fichier de sortie pour sauvegarder les résultats')
  .option('--format <type>', 'Format de sortie (text ou json)', 'text')
  .option('-v, --verbose', 'Afficher les détails du tirage', false)
  .action((file: string, options) => {
    try {
      // Chargement des participants
      console.log(formatLoading('Chargement des participants'));
      const participants = parseParticipants(file);
      const participantText =
        participants.length === 1 ? 'participant chargé' : 'participants chargés';
      console.log(formatSuccess(`${participants.length} ${participantText}`));
      console.log('');

      // Préparer les options
      const count = parseInt(options.number, 10);
      if (isNaN(count) || count < 1) {
        throw new Error(
          `Nombre invalide "${options.number}". Le nombre de gagnants doit être un entier positif.`
        );
      }

      const exclude = options.exclude
        ? options.exclude.split(',').map((name: string) => name.trim())
        : [];

      // Effectuer le tirage
      console.log(formatLoading('Tirage au sort en cours'));
      const result = selectWinners(participants, {
        count,
        seed: options.seed,
        exclude,
      });

      // Afficher le résultat
      if (options.format === 'json') {
        const output = formatResultJSON(result);
        console.log(output);

        // Sauvegarder si demandé
        if (options.output) {
          writeFileSync(options.output, output, 'utf-8');
          console.log('');
          console.log(formatSuccess(`Résultats sauvegardés dans ${options.output}`));
        }
      } else {
        const output = formatResult(result, options.verbose);
        console.log(output);

        // Sauvegarder si demandé
        if (options.output) {
          writeFileSync(options.output, output, 'utf-8');
          console.log(formatSuccess(`Résultats sauvegardés dans ${options.output}`));
        }
      }
    } catch (error) {
      if (error instanceof CSVParserError || error instanceof PickerError) {
        console.error(formatError(error));
        process.exit(1);
      }

      if (error instanceof Error) {
        console.error(formatError(error));
        process.exit(1);
      }

      console.error(formatError(new Error('Erreur inconnue')));
      process.exit(1);
    }
  });

// Commande par défaut (help)
if (process.argv.length === 2) {
  program.help();
}

program.parse();
