// Mock chalk BEFORE any imports to avoid ESM issues
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

import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

// Mock process.exit to prevent test termination
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit(${code})`);
});

// Capture console output
let consoleLogOutput: string[] = [];
let consoleErrorOutput: string[] = [];
const originalLog = console.log;
const originalError = console.error;

beforeEach(() => {
  consoleLogOutput = [];
  consoleErrorOutput = [];
  console.log = jest.fn((...args: any[]) => {
    consoleLogOutput.push(args.map(String).join(' '));
  });
  console.error = jest.fn((...args: any[]) => {
    consoleErrorOutput.push(args.map(String).join(' '));
  });
  mockExit.mockClear();
});

afterEach(() => {
  console.log = originalLog;
  console.error = originalError;
});

describe('CLI', () => {
  const testDir = join(__dirname, '../__temp__');
  const testFile = join(testDir, 'cli-test.csv');
  const outputFile = join(testDir, 'output.txt');
  const outputJsonFile = join(testDir, 'output.json');

  beforeAll(() => {
    try {
      require('fs').mkdirSync(testDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }
  });

  afterEach(() => {
    // Clean up test files
    [testFile, outputFile, outputJsonFile].forEach((file) => {
      try {
        unlinkSync(file);
      } catch (e: any) {
        if (e.code !== 'ENOENT') {
          console.warn('Failed to clean up:', e.message);
        }
      }
    });
  });

  // Helper to run CLI command
  const runCLI = async (args: string[]) => {
    // Save original argv
    const originalArgv = process.argv;

    // Set new argv
    process.argv = ['node', 'meetup-picker', ...args];

    try {
      // Clear module cache to reload CLI
      jest.resetModules();

      // Import and run CLI
      await import('../../src/cli/index');
    } catch (error) {
      // Catch process.exit errors
      if (!(error instanceof Error && error.message.startsWith('process.exit'))) {
        throw error;
      }
    } finally {
      // Restore original argv
      process.argv = originalArgv;
    }
  };

  describe('Command parsing', () => {
    beforeEach(() => {
      // Create a valid test CSV
      const csv = 'nom,email\nAlice,alice@example.com\nBob,bob@example.com\nCharlie,charlie@example.com';
      writeFileSync(testFile, csv);
    });

    it('devrait exécuter le tirage avec un fichier CSV valide', async () => {
      await runCLI(['pick', testFile]);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('Chargement des participants');
      expect(output).toContain('3 participants chargés');
      expect(output).toContain('Tirage au sort en cours');
      expect(output).toContain('Tirage au sort terminé');
      expect(output).toContain('Le gagnant est');
    });

    it('devrait respecter l\'option --number', async () => {
      await runCLI(['pick', testFile, '--number', '2']);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('Les 2 gagnants sont');
    });

    it('devrait respecter l\'option -n (raccourci)', async () => {
      await runCLI(['pick', testFile, '-n', '2']);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('Les 2 gagnants sont');
    });

    it('devrait produire le même résultat avec le même seed', async () => {
      // Premier tirage
      await runCLI(['pick', testFile, '--seed', 'test-seed', '-n', '2']);
      const output1 = consoleLogOutput.join('\n');

      // Reset console
      consoleLogOutput = [];

      // Deuxième tirage avec le même seed
      await runCLI(['pick', testFile, '--seed', 'test-seed', '-n', '2']);
      const output2 = consoleLogOutput.join('\n');

      // Les résultats devraient être identiques
      expect(output1).toBe(output2);
    });

    it('devrait exclure les participants spécifiés', async () => {
      await runCLI(['pick', testFile, '--exclude', 'Alice,Bob']);

      const output = consoleLogOutput.join('\n');
      // Les 3 participants sont chargés du CSV, mais seul Charlie est éligible après exclusion
      expect(output).toContain('3 participants chargés');
      expect(output).toContain('Charlie');
      expect(output).not.toContain('Alice');
      expect(output).not.toContain('Bob');
    });

    it('devrait afficher les détails en mode verbose', async () => {
      await runCLI(['pick', testFile, '--verbose']);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('Détails du tirage');
      expect(output).toContain('Participants éligibles');
      expect(output).toContain('Date');
      expect(output).toContain('Hash de vérification');
    });

    it('ne devrait pas afficher les détails sans --verbose', async () => {
      await runCLI(['pick', testFile]);

      const output = consoleLogOutput.join('\n');
      expect(output).not.toContain('Détails du tirage');
    });
  });

  describe('Output file handling', () => {
    beforeEach(() => {
      const csv = 'nom,email\nAlice,alice@example.com\nBob,bob@example.com';
      writeFileSync(testFile, csv);
    });

    it('devrait sauvegarder le résultat en format texte', async () => {
      await runCLI(['pick', testFile, '--output', outputFile]);

      expect(existsSync(outputFile)).toBe(true);
      const content = readFileSync(outputFile, 'utf-8');
      expect(content).toContain('Tirage au sort terminé');
      expect(content).toContain('Le gagnant est');

      const output = consoleLogOutput.join('\n');
      expect(output).toContain(`Résultats sauvegardés dans ${outputFile}`);
    });

    it('devrait sauvegarder le résultat en format JSON', async () => {
      await runCLI(['pick', testFile, '--format', 'json', '--output', outputJsonFile]);

      expect(existsSync(outputJsonFile)).toBe(true);
      const content = readFileSync(outputJsonFile, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed).toHaveProperty('winners');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('totalParticipants');
      expect(parsed).toHaveProperty('hash');
      expect(parsed.winners).toHaveLength(1);
      expect(parsed.totalParticipants).toBe(2);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain(`Résultats sauvegardés dans ${outputJsonFile}`);
    });

    it('devrait afficher le résultat JSON sur console sans --output', async () => {
      await runCLI(['pick', testFile, '--format', 'json']);

      const output = consoleLogOutput.join('\n');
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      expect(jsonMatch).not.toBeNull();

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        expect(parsed).toHaveProperty('winners');
        expect(parsed).toHaveProperty('timestamp');
      }
    });

    it('devrait écraser un fichier existant', async () => {
      // Créer un fichier initial
      writeFileSync(outputFile, 'Old content');

      await runCLI(['pick', testFile, '--output', outputFile]);

      const content = readFileSync(outputFile, 'utf-8');
      expect(content).not.toBe('Old content');
      expect(content).toContain('Tirage au sort terminé');
    });
  });

  describe('Error handling', () => {
    it('devrait afficher une erreur si le fichier n\'existe pas', async () => {
      await runCLI(['pick', 'nonexistent.csv']);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(errorOutput).toContain('Fichier non trouvé');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('devrait afficher une erreur si le nombre de gagnants est invalide', async () => {
      const csv = 'nom\nAlice\nBob';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile, '--number', 'invalid']);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(errorOutput).toContain('Nombre invalide');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('devrait afficher une erreur si le nombre de gagnants est négatif', async () => {
      const csv = 'nom\nAlice\nBob';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile, '--number', '-1']);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(errorOutput).toContain('entier positif');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('devrait afficher une erreur si le nombre de gagnants est zéro', async () => {
      const csv = 'nom\nAlice\nBob';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile, '--number', '0']);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(errorOutput).toContain('entier positif');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('devrait afficher une erreur si le CSV est vide', async () => {
      writeFileSync(testFile, 'nom\n');

      await runCLI(['pick', testFile]);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(errorOutput).toContain('aucun participant valide');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('devrait afficher une erreur si le nombre de gagnants dépasse le nombre de participants', async () => {
      const csv = 'nom\nAlice\nBob';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile, '--number', '10']);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(errorOutput).toContain('Impossible de sélectionner');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('devrait afficher une erreur si tous les participants sont exclus', async () => {
      const csv = 'nom\nAlice\nBob';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile, '--exclude', 'Alice,Bob']);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(errorOutput).toContain('Aucun participant éligible');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('devrait gérer les erreurs de CSVParserError', async () => {
      // Créer un CSV invalide (pas de colonne nom)
      writeFileSync(testFile, 'email\nalice@example.com');

      await runCLI(['pick', testFile]);

      const errorOutput = consoleErrorOutput.join('\n');
      expect(errorOutput).toContain('Erreur');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('Edge cases', () => {
    it('devrait gérer un seul participant', async () => {
      const csv = 'nom\nAlice';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile]);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('1 participant chargé');
      expect(output).toContain('Alice');
    });

    it('devrait gérer des participants sans email', async () => {
      const csv = 'nom\nAlice\nBob\nCharlie';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile]);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('3 participants chargés');
      expect(output).toContain('Tirage au sort terminé');
    });

    it('devrait gérer des noms avec espaces', async () => {
      const csv = 'nom,email\n  Alice Dupont  ,alice@example.com\n  Bob Martin  ,bob@example.com';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile]);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('2 participants chargés');
    });

    it('devrait gérer les exclusions avec espaces et casse différente', async () => {
      const csv = 'nom\nAlice\nBob\nCharlie';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile, '--exclude', ' alice , BOB ']);

      const output = consoleLogOutput.join('\n');
      // Les 3 participants sont chargés, mais seul Charlie est éligible
      expect(output).toContain('3 participants chargés');
      expect(output).toContain('Charlie');
    });

    it('devrait gérer un grand nombre de participants', async () => {
      // Créer un CSV avec 100 participants
      let csv = 'nom,email\n';
      for (let i = 1; i <= 100; i++) {
        csv += `Participant${i},participant${i}@example.com\n`;
      }
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile, '-n', '10']);

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('100 participants chargés');
      expect(output).toContain('Les 10 gagnants sont');
    });

    it('devrait gérer les doublons dans le CSV', async () => {
      const csv = 'nom\nAlice\nBob\nAlice\nCharlie\nBob';
      writeFileSync(testFile, csv);

      await runCLI(['pick', testFile]);

      const output = consoleLogOutput.join('\n');
      // Les doublons sont supprimés par défaut
      expect(output).toContain('3 participants chargés');
    });
  });

  describe('Combined options', () => {
    beforeEach(() => {
      const csv = 'nom,email\nAlice,alice@example.com\nBob,bob@example.com\nCharlie,charlie@example.com\nDavid,david@example.com';
      writeFileSync(testFile, csv);
    });

    it('devrait combiner seed, number et exclude', async () => {
      await runCLI([
        'pick',
        testFile,
        '--seed',
        'combo-test',
        '--number',
        '2',
        '--exclude',
        'Alice',
      ]);

      const output = consoleLogOutput.join('\n');
      // Les 4 participants sont chargés du CSV, Alice est exclue lors de la sélection
      expect(output).toContain('4 participants chargés');
      expect(output).toContain('Les 2 gagnants sont');
      expect(output).not.toContain('Alice');
    });

    it('devrait combiner verbose, output et format json', async () => {
      await runCLI([
        'pick',
        testFile,
        '--verbose',
        '--output',
        outputJsonFile,
        '--format',
        'json',
        '--seed',
        'test-json-seed',
      ]);

      expect(existsSync(outputJsonFile)).toBe(true);
      const content = readFileSync(outputJsonFile, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed).toHaveProperty('winners');
      expect(parsed).toHaveProperty('seed');
      expect(parsed.seed).toBe('test-json-seed');
      expect(parsed).toHaveProperty('hash');

      const output = consoleLogOutput.join('\n');
      expect(output).toContain('Résultats sauvegardés');
    });

    it('devrait combiner toutes les options ensemble', async () => {
      await runCLI([
        'pick',
        testFile,
        '--seed',
        'full-test',
        '--number',
        '2',
        '--exclude',
        'Alice,Bob',
        '--verbose',
        '--output',
        outputFile,
        '--format',
        'text',
      ]);

      expect(existsSync(outputFile)).toBe(true);
      const content = readFileSync(outputFile, 'utf-8');

      expect(content).toContain('Les 2 gagnants sont');
      expect(content).toContain('Détails du tirage');
      expect(content).toContain('Seed : full-test');
      expect(content).not.toContain('Alice');
      expect(content).not.toContain('Bob');
    });
  });
});
