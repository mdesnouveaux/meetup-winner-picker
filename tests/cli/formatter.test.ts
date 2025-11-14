// Mock chalk AVANT les imports pour éviter les problèmes avec les modules ESM
const mockChalkFn = (str: string) => str;
const mockChalk = {
  green: Object.assign(mockChalkFn, { bold: mockChalkFn }),
  yellow: Object.assign(mockChalkFn, { bold: mockChalkFn }),
  cyan: Object.assign(mockChalkFn, { bold: mockChalkFn }),
  gray: mockChalkFn,
  red: Object.assign(mockChalkFn, { bold: mockChalkFn }),
  blue: mockChalkFn,
};

jest.mock('chalk', () => mockChalk);

import {
  formatResult,
  formatResultJSON,
  formatError,
  formatLoading,
  formatSuccess,
} from '../../src/cli/formatter';
import { PickResult } from '../../src/types/participant';

// Note: Les tests de formatage avec chalk peuvent être complexes
// car chalk détecte automatiquement si on est dans un TTY
// On teste donc principalement la structure et le contenu

describe('Formatter', () => {
  const mockResult: PickResult = {
    winners: [
      { nom: 'Alice', email: 'alice@example.com' },
      { nom: 'Bob', email: 'bob@example.com' },
    ],
    timestamp: new Date('2025-01-01T12:00:00.000Z'),
    seed: 'test-seed',
    totalParticipants: 10,
    hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
  };

  describe('formatResult', () => {
    it('devrait formater un résultat avec un seul gagnant', () => {
      const singleWinnerResult: PickResult = {
        ...mockResult,
        winners: [{ nom: 'Alice', email: 'alice@example.com' }],
      };

      const output = formatResult(singleWinnerResult);

      expect(output).toContain('Tirage au sort terminé');
      expect(output).toContain('Le gagnant est');
      expect(output).toContain('Alice');
      expect(output).toContain('alice@example.com');
    });

    it('devrait formater un résultat avec plusieurs gagnants', () => {
      const output = formatResult(mockResult);

      expect(output).toContain('Tirage au sort terminé');
      expect(output).toContain('Les 2 gagnants sont');
      expect(output).toContain('1. Alice');
      expect(output).toContain('2. Bob');
    });

    it('devrait afficher les détails en mode verbose', () => {
      const output = formatResult(mockResult, true);

      expect(output).toContain('Détails du tirage');
      expect(output).toContain('Participants éligibles : 10');
      expect(output).toContain('Seed : test-seed');
      expect(output).toContain('Hash de vérification');
    });

    it('ne devrait pas afficher les détails sans mode verbose', () => {
      const output = formatResult(mockResult, false);

      expect(output).not.toContain('Détails du tirage');
      expect(output).not.toContain('Participants éligibles');
      expect(output).not.toContain('Seed');
    });

    it('devrait gérer un gagnant sans email', () => {
      const noEmailResult: PickResult = {
        ...mockResult,
        winners: [{ nom: 'Charlie' }],
      };

      const output = formatResult(noEmailResult);

      expect(output).toContain('Charlie');
      expect(output).not.toContain('@');
    });

    it('devrait afficher le hash tronqué en mode verbose', () => {
      const output = formatResult(mockResult, true);

      // Le hash devrait être tronqué (premiers 16 caractères + ...)
      expect(output).toContain('a1b2c3d4e5f6g7h8...');

      // Vérifier que la fin du hash n'est pas affichée (preuve de troncature)
      const hashEnd = mockResult.hash.substring(20); // Derniers caractères
      expect(output).not.toContain(hashEnd);
    });
  });

  describe('formatResultJSON', () => {
    it('devrait formater en JSON valide', () => {
      const output = formatResultJSON(mockResult);
      const parsed = JSON.parse(output);

      expect(parsed.winners).toHaveLength(2);
      expect(parsed.winners[0].nom).toBe('Alice');
      expect(parsed.totalParticipants).toBe(10);
      expect(parsed.seed).toBe('test-seed');
      expect(parsed.hash).toBe(mockResult.hash);
    });

    it('devrait formater le timestamp en ISO string', () => {
      const output = formatResultJSON(mockResult);
      const parsed = JSON.parse(output);

      expect(parsed.timestamp).toBe('2025-01-01T12:00:00.000Z');
    });

    it('devrait inclure tous les champs', () => {
      const output = formatResultJSON(mockResult);
      const parsed = JSON.parse(output);

      expect(parsed).toHaveProperty('winners');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('seed');
      expect(parsed).toHaveProperty('totalParticipants');
      expect(parsed).toHaveProperty('hash');
    });

    it('devrait être indenté (pretty print)', () => {
      const output = formatResultJSON(mockResult);

      // Le JSON devrait contenir des retours à la ligne (formaté)
      expect(output).toContain('\n');
      expect(output).toContain('  '); // Indentation
    });
  });

  describe('formatError', () => {
    it("devrait formater un message d'erreur", () => {
      const error = new Error('Fichier non trouvé');
      const output = formatError(error);

      expect(output).toContain('Erreur');
      expect(output).toContain('Fichier non trouvé');
    });

    it("devrait inclure le symbole d'erreur", () => {
      const error = new Error('Test');
      const output = formatError(error);

      expect(output).toContain('❌');
    });
  });

  describe('formatLoading', () => {
    it('devrait formater un message de chargement', () => {
      const output = formatLoading('Chargement des données');

      expect(output).toContain('Chargement des données');
      expect(output).toContain('...');
    });

    it('devrait inclure le symbole de chargement', () => {
      const output = formatLoading('Test');

      expect(output).toContain('⏳');
    });
  });

  describe('formatSuccess', () => {
    it('devrait formater un message de succès', () => {
      const output = formatSuccess('Opération réussie');

      expect(output).toContain('Opération réussie');
    });

    it('devrait inclure le symbole de succès', () => {
      const output = formatSuccess('Test');

      expect(output).toContain('✓');
    });
  });
});
