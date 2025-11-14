import { generateVerificationHash } from '../../src/utils/hash';
import { Participant } from '../../src/types/participant';

describe('Hash Generator', () => {
  const participants: Participant[] = [
    { nom: 'Alice', email: 'alice@example.com' },
    { nom: 'Bob', email: 'bob@example.com' },
    { nom: 'Charlie' },
  ];

  const timestamp = new Date('2025-01-01T00:00:00.000Z');

  it('devrait générer un hash SHA-256', () => {
    const hash = generateVerificationHash(participants, timestamp);

    // SHA-256 produit un hash de 64 caractères hexadécimaux
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('devrait produire le même hash avec les mêmes entrées', () => {
    const hash1 = generateVerificationHash(participants, timestamp, 'test-seed');
    const hash2 = generateVerificationHash(participants, timestamp, 'test-seed');

    expect(hash1).toBe(hash2);
  });

  it('devrait produire des hash différents avec des participants différents', () => {
    const participants1 = [{ nom: 'Alice' }];
    const participants2 = [{ nom: 'Bob' }];

    const hash1 = generateVerificationHash(participants1, timestamp);
    const hash2 = generateVerificationHash(participants2, timestamp);

    expect(hash1).not.toBe(hash2);
  });

  it('devrait produire des hash différents avec des timestamps différents', () => {
    const timestamp1 = new Date('2025-01-01T00:00:00.000Z');
    const timestamp2 = new Date('2025-01-01T00:00:01.000Z');

    const hash1 = generateVerificationHash(participants, timestamp1);
    const hash2 = generateVerificationHash(participants, timestamp2);

    expect(hash1).not.toBe(hash2);
  });

  it('devrait produire des hash différents avec des seeds différents', () => {
    const hash1 = generateVerificationHash(participants, timestamp, 'seed1');
    const hash2 = generateVerificationHash(participants, timestamp, 'seed2');

    expect(hash1).not.toBe(hash2);
  });

  it('devrait produire le même hash avec seed undefined vs sans seed', () => {
    const hash1 = generateVerificationHash(participants, timestamp);
    const hash2 = generateVerificationHash(participants, timestamp, undefined);

    expect(hash1).toBe(hash2);
  });

  it('devrait trier les participants pour cohérence', () => {
    // L'ordre des participants ne devrait pas affecter le hash
    const participants1 = [{ nom: 'Alice' }, { nom: 'Bob' }, { nom: 'Charlie' }];
    const participants2 = [{ nom: 'Charlie' }, { nom: 'Alice' }, { nom: 'Bob' }];

    const hash1 = generateVerificationHash(participants1, timestamp);
    const hash2 = generateVerificationHash(participants2, timestamp);

    expect(hash1).toBe(hash2);
  });

  it('devrait ignorer les emails dans le hash', () => {
    // Les emails ne devraient pas affecter le hash (seuls les noms comptent)
    const participants1 = [{ nom: 'Alice', email: 'alice@example.com' }];
    const participants2 = [{ nom: 'Alice', email: 'alice2@example.com' }];
    const participants3 = [{ nom: 'Alice' }];

    const hash1 = generateVerificationHash(participants1, timestamp);
    const hash2 = generateVerificationHash(participants2, timestamp);
    const hash3 = generateVerificationHash(participants3, timestamp);

    expect(hash1).toBe(hash2);
    expect(hash1).toBe(hash3);
  });

  it('devrait gérer une liste vide', () => {
    const hash = generateVerificationHash([], timestamp);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('devrait gérer un seul participant', () => {
    const singleParticipant = [{ nom: 'Alice' }];
    const hash = generateVerificationHash(singleParticipant, timestamp);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
