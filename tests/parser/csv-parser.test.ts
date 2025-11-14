import { parseParticipants, CSVParserError } from '../../src/parser/csv-parser';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('CSV Parser', () => {
  const testDir = join(__dirname, '../__temp__');
  const testFile = join(testDir, 'test.csv');

  beforeAll(() => {
    // Créer le dossier de test si nécessaire
    try {
      require('fs').mkdirSync(testDir, { recursive: true });
    } catch (e) {
      // Ignore si existe déjà
    }
  });

  afterEach(() => {
    // Nettoyer le fichier de test
    try {
      unlinkSync(testFile);
    } catch (e: any) {
      // Ignore uniquement si le fichier n'existe pas
      if (e.code !== 'ENOENT') {
        console.warn('Failed to clean up test file:', e.message);
      }
    }
  });

  it('devrait parser un CSV valide', () => {
    const csv = 'nom,email\nAlice,alice@example.com\nBob,bob@example.com';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(2);
    expect(participants[0]).toEqual({ nom: 'Alice', email: 'alice@example.com' });
    expect(participants[1]).toEqual({ nom: 'Bob', email: 'bob@example.com' });
  });

  it('devrait parser un CSV sans email', () => {
    const csv = 'nom\nAlice\nBob';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(2);
    expect(participants[0]).toEqual({ nom: 'Alice', email: undefined });
  });

  it('devrait supprimer les doublons par défaut', () => {
    const csv = 'nom\nAlice\nBob\nAlice';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(2);
    expect(participants.map((p) => p.nom)).toEqual(['Alice', 'Bob']);
  });

  it('devrait garder les doublons si demandé', () => {
    const csv = 'nom\nAlice\nBob\nAlice';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile, { removeDuplicates: false });

    expect(participants).toHaveLength(3);
  });

  it("devrait lever une erreur si le fichier n'existe pas", () => {
    expect(() => parseParticipants('nonexistent.csv')).toThrow(CSVParserError);
    expect(() => parseParticipants('nonexistent.csv')).toThrow(/Fichier non trouvé/);
  });

  it('devrait lever une erreur si le CSV est vide', () => {
    writeFileSync(testFile, 'nom\n');

    expect(() => parseParticipants(testFile)).toThrow(CSVParserError);
    expect(() => parseParticipants(testFile)).toThrow(/aucun participant valide/);
  });

  it('devrait lever une erreur si le nom est manquant', () => {
    const csv = 'nom,email\n,alice@example.com';
    writeFileSync(testFile, csv);

    expect(() => parseParticipants(testFile)).toThrow(CSVParserError);
    expect(() => parseParticipants(testFile)).toThrow(/le champ 'nom' est requis/);
  });

  it('devrait trimmer les espaces', () => {
    const csv = 'nom,email\n  Alice  ,  alice@example.com  ';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants[0]).toEqual({ nom: 'Alice', email: 'alice@example.com' });
  });

  it('devrait traiter les emails vides ou avec espaces comme undefined', () => {
    const csv = 'nom,email\nAlice,\nBob,   \nCharlie,  \t  ';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(3);
    expect(participants[0]).toEqual({ nom: 'Alice', email: undefined });
    expect(participants[1]).toEqual({ nom: 'Bob', email: undefined });
    expect(participants[2]).toEqual({ nom: 'Charlie', email: undefined });
  });
});
