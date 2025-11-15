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

  it('devrait parser un CSV valide (format Meetup)', () => {
    const csv = 'Name,Email\nAlice,alice@example.com\nBob,bob@example.com';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(2);
    expect(participants[0]).toEqual({ nom: 'Alice', email: 'alice@example.com' });
    expect(participants[1]).toEqual({ nom: 'Bob', email: 'bob@example.com' });
  });

  it('devrait parser un CSV sans email', () => {
    const csv = 'Name\nAlice\nBob';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(2);
    expect(participants[0]).toEqual({ nom: 'Alice', email: undefined });
  });

  it('devrait supprimer les doublons par défaut', () => {
    const csv = 'Name\nAlice\nBob\nAlice';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(2);
    expect(participants.map((p) => p.nom)).toEqual(['Alice', 'Bob']);
  });

  it('devrait garder les doublons si demandé', () => {
    const csv = 'Name\nAlice\nBob\nAlice';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile, { removeDuplicates: false });

    expect(participants).toHaveLength(3);
  });

  it("devrait lever une erreur si le fichier n'existe pas", () => {
    expect(() => parseParticipants('nonexistent.csv')).toThrow(CSVParserError);
    expect(() => parseParticipants('nonexistent.csv')).toThrow(/Fichier non trouvé/);
  });

  it('devrait lever une erreur si le CSV est vide', () => {
    writeFileSync(testFile, 'Name\n');

    expect(() => parseParticipants(testFile)).toThrow(CSVParserError);
    expect(() => parseParticipants(testFile)).toThrow(/aucun participant valide/);
  });

  it('devrait lever une erreur si le nom est manquant', () => {
    const csv = 'Name,Email\n,alice@example.com';
    writeFileSync(testFile, csv);

    expect(() => parseParticipants(testFile)).toThrow(CSVParserError);
    expect(() => parseParticipants(testFile)).toThrow(/le champ 'Name' est requis/);
  });

  it('devrait trimmer les espaces', () => {
    const csv = 'Name,Email\n  Alice  ,  alice@example.com  ';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants[0]).toEqual({ nom: 'Alice', email: 'alice@example.com' });
  });

  it('devrait traiter les emails vides ou avec espaces comme undefined', () => {
    const csv = 'Name,Email\nAlice,\nBob,   \nCharlie,  \t  ';
    writeFileSync(testFile, csv);

    const participants = parseParticipants(testFile);

    expect(participants).toHaveLength(3);
    expect(participants[0]).toEqual({ nom: 'Alice', email: undefined });
    expect(participants[1]).toEqual({ nom: 'Bob', email: undefined });
    expect(participants[2]).toEqual({ nom: 'Charlie', email: undefined });
  });

  describe('Encodage et BOM', () => {
    it('devrait gérer le UTF-8 BOM', () => {
      // UTF-8 BOM: EF BB BF
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      const csvContent = Buffer.from('Name,Email\nAlice,alice@example.com\nBob,bob@example.com');
      const csvWithBOM = Buffer.concat([bom, csvContent]);

      writeFileSync(testFile, csvWithBOM);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0]).toEqual({ nom: 'Alice', email: 'alice@example.com' });
      expect(participants[1]).toEqual({ nom: 'Bob', email: 'bob@example.com' });
    });

    it('devrait gérer le latin1 encoding', () => {
      const csv = 'Name,Email\nFrançois,francois@example.com\nJosé,jose@example.com';
      writeFileSync(testFile, csv, { encoding: 'latin1' });

      const participants = parseParticipants(testFile, { encoding: 'latin1' });

      expect(participants).toHaveLength(2);
      expect(participants[0].nom).toBe('François');
      expect(participants[1].nom).toBe('José');
    });

    it('devrait gérer les caractères Unicode', () => {
      const csv = 'Name,Email\n田中太郎,tanaka@example.com\n김철수,kim@example.com\nΑλέξανδρος,alex@example.com';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(3);
      expect(participants[0]).toEqual({ nom: '田中太郎', email: 'tanaka@example.com' });
      expect(participants[1]).toEqual({ nom: '김철수', email: 'kim@example.com' });
      expect(participants[2]).toEqual({ nom: 'Αλέξανδρος', email: 'alex@example.com' });
    });

    it('devrait gérer les émojis dans les noms', () => {
      const csv = 'Name,Email\nAlice 🎉,alice@example.com\nBob 😊,bob@example.com';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0]).toEqual({ nom: 'Alice 🎉', email: 'alice@example.com' });
      expect(participants[1]).toEqual({ nom: 'Bob 😊', email: 'bob@example.com' });
    });
  });

  describe('CSV malformé', () => {
    it('devrait lever une erreur si la colonne Name est absente', () => {
      const csv = 'Email\nalice@example.com\nbob@example.com';
      writeFileSync(testFile, csv);

      expect(() => parseParticipants(testFile)).toThrow(CSVParserError);
      expect(() => parseParticipants(testFile)).toThrow(/le champ 'Name' est requis/);
    });

    it('devrait lever une erreur si un nom contient uniquement des espaces', () => {
      const csv = 'Name,Email\n   ,alice@example.com';
      writeFileSync(testFile, csv);

      expect(() => parseParticipants(testFile)).toThrow(CSVParserError);
      // csv-parse avec trim:true convertit les espaces en chaîne vide avant notre validation
      // donc le champ est considéré comme manquant (!record.Name est true pour "")
      expect(() => parseParticipants(testFile)).toThrow(/le champ 'Name' est requis/);
    });

    it('devrait lever une erreur avec un numéro de ligne correct', () => {
      const csv = 'Name,Email\nAlice,alice@example.com\nBob,bob@example.com\n,charlie@example.com';
      writeFileSync(testFile, csv);

      expect(() => parseParticipants(testFile)).toThrow(/Ligne 4/);
    });

    it('devrait gérer les lignes vides correctement', () => {
      const csv = 'Name,Email\nAlice,alice@example.com\n\n\nBob,bob@example.com\n\n';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0].nom).toBe('Alice');
      expect(participants[1].nom).toBe('Bob');
    });

    it('devrait gérer les colonnes supplémentaires', () => {
      const csv = 'Name,Email,extra1,extra2\nAlice,alice@example.com,data1,data2\nBob,bob@example.com,data3,data4';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0]).toEqual({ nom: 'Alice', email: 'alice@example.com' });
      expect(participants[1]).toEqual({ nom: 'Bob', email: 'bob@example.com' });
    });

    it('devrait gérer les guillemets dans les valeurs', () => {
      const csv = 'Name,Email\n"Alice ""Wonder"" Doe",alice@example.com\n"Bob, Jr.",bob@example.com';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0].nom).toBe('Alice "Wonder" Doe');
      expect(participants[1].nom).toBe('Bob, Jr.');
    });

    it('devrait gérer les virgules dans les noms entre guillemets', () => {
      const csv = 'Name,Email\n"Doe, John",john@example.com\n"Smith, Jane",jane@example.com';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0].nom).toBe('Doe, John');
      expect(participants[1].nom).toBe('Smith, Jane');
    });

    it('devrait gérer les retours à la ligne dans les valeurs entre guillemets', () => {
      const csv = 'Name,Email\n"Alice\nDoe",alice@example.com\nBob,bob@example.com';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0].nom).toBe('Alice\nDoe');
      expect(participants[1].nom).toBe('Bob');
    });
  });

  describe('Cas limites et performance', () => {
    it('devrait gérer des noms très longs', () => {
      const longName = 'A'.repeat(500);
      const csv = `Name,Email\n${longName},long@example.com`;
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(1);
      expect(participants[0].nom).toBe(longName);
    });

    it('devrait gérer un grand nombre de participants', () => {
      let csv = 'Name,Email\n';
      const participantCount = 1000;

      for (let i = 1; i <= participantCount; i++) {
        csv += `Participant${i},participant${i}@example.com\n`;
      }

      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(participantCount);
      expect(participants[0].nom).toBe('Participant1');
      expect(participants[participantCount - 1].nom).toBe(`Participant${participantCount}`);
    });

    it('devrait gérer les doublons insensibles à la casse', () => {
      const csv = 'Name\nAlice\nalice\nALICE\nBob';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      // Les doublons sont supprimés (insensible à la casse)
      expect(participants).toHaveLength(2);
      expect(participants[0].nom).toBe('Alice');
      expect(participants[1].nom).toBe('Bob');
    });

    it('devrait gérer les fins de ligne CRLF (format Windows)', () => {
      // Test avec des fins de ligne Windows (CRLF) uniquement
      const csv = 'Name,Email\r\nAlice,alice@example.com\r\nBob,bob@example.com\r\nCharlie,charlie@example.com';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(3);
      expect(participants[0].nom).toBe('Alice');
      expect(participants[1].nom).toBe('Bob');
      expect(participants[2].nom).toBe('Charlie');
    });

    it('devrait gérer les caractères spéciaux dans les emails', () => {
      const csv = 'Name,Email\nAlice,alice+test@example.co.uk\nBob,bob.smith@sub-domain.example.com';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0].email).toBe('alice+test@example.co.uk');
      expect(participants[1].email).toBe('bob.smith@sub-domain.example.com');
    });

    it('devrait gérer un CSV avec uniquement des en-têtes et des lignes vides', () => {
      const csv = 'Name,Email\n\n\n\n';
      writeFileSync(testFile, csv);

      expect(() => parseParticipants(testFile)).toThrow(CSVParserError);
      expect(() => parseParticipants(testFile)).toThrow(/aucun participant valide/);
    });

    it('devrait préserver l\'ordre des participants', () => {
      const csv = 'Name\nZebra\nAlpha\nMike\nBravo';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(4);
      expect(participants[0].nom).toBe('Zebra');
      expect(participants[1].nom).toBe('Alpha');
      expect(participants[2].nom).toBe('Mike');
      expect(participants[3].nom).toBe('Bravo');
    });
  });

  describe('Format Meetup', () => {
    it('devrait filtrer les emails masqués Meetup', () => {
      const csv = 'Name,Email\nAlice,alice@example.com\nBob,Email hidden • Upgrade to Pro to view';
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(2);
      expect(participants[0]).toEqual({ nom: 'Alice', email: 'alice@example.com' });
      expect(participants[1]).toEqual({ nom: 'Bob', email: undefined });
    });

    it('devrait parser un export Meetup complet avec plusieurs colonnes', () => {
      const csv = `Name,Member ID,Email,Location,Role,RSVP
Alice Smith,12345,alice@example.com,Paris,Member,Yes
Bob Johnson,67890,Email hidden • Upgrade to Pro,Lyon,Member,Yes
Charlie Brown,11111,charlie@example.com,Marseille,Organizer,Yes`;
      writeFileSync(testFile, csv);

      const participants = parseParticipants(testFile);

      expect(participants).toHaveLength(3);
      expect(participants[0]).toEqual({ nom: 'Alice Smith', email: 'alice@example.com' });
      expect(participants[1]).toEqual({ nom: 'Bob Johnson', email: undefined });
      expect(participants[2]).toEqual({ nom: 'Charlie Brown', email: 'charlie@example.com' });
    });
  });
});
