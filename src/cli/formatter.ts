import chalk from 'chalk';
import { PickResult } from '../types/participant';

/**
 * Formate le résultat du tirage pour affichage console
 */
export function formatResult(result: PickResult, verbose = false): string {
  const lines: string[] = [];

  // En-tête
  lines.push('');
  lines.push(chalk.green.bold('🎊 Tirage au sort terminé !'));
  lines.push('');

  // Gagnant(s)
  if (result.winners.length === 1) {
    lines.push(chalk.yellow.bold('🏆 Le gagnant est :'));
    lines.push('');
    lines.push(chalk.cyan.bold(`   ${result.winners[0].nom}`));
    if (result.winners[0].email) {
      lines.push(chalk.gray(`   ${result.winners[0].email}`));
    }
  } else {
    lines.push(chalk.yellow.bold(`🏆 Les ${result.winners.length} gagnants sont :`));
    lines.push('');
    result.winners.forEach((winner, index) => {
      lines.push(chalk.cyan.bold(`   ${index + 1}. ${winner.nom}`));
      if (winner.email) {
        lines.push(chalk.gray(`      ${winner.email}`));
      }
    });
  }

  lines.push('');

  // Informations détaillées
  if (verbose) {
    lines.push(chalk.gray('📊 Détails du tirage :'));
    lines.push(chalk.gray(`   • Participants éligibles : ${result.totalParticipants}`));
    lines.push(chalk.gray(`   • Date : ${result.timestamp.toLocaleString('fr-FR')}`));
    if (result.seed) {
      lines.push(chalk.gray(`   • Seed : ${result.seed}`));
    }
    lines.push(chalk.gray(`   • Hash de vérification : ${result.hash.substring(0, 16)}...`));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Formate le résultat en JSON
 */
export function formatResultJSON(result: PickResult): string {
  return JSON.stringify(
    {
      winners: result.winners,
      timestamp: result.timestamp.toISOString(),
      seed: result.seed,
      totalParticipants: result.totalParticipants,
      hash: result.hash,
    },
    null,
    2
  );
}

/**
 * Affiche un message d'erreur formaté
 */
export function formatError(error: Error): string {
  return chalk.red.bold(`❌ Erreur : ${error.message}`);
}

/**
 * Affiche un message de chargement
 */
export function formatLoading(message: string): string {
  return chalk.blue(`⏳ ${message}...`);
}

/**
 * Affiche un message de succès
 */
export function formatSuccess(message: string): string {
  return chalk.green(`✓ ${message}`);
}
