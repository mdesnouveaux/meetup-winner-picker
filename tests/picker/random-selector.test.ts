import { selectWinners, PickerError } from '../../src/picker/random-selector';
import { Participant } from '../../src/types/participant';
import { createFixedClock } from '../../src/utils/clock';

describe('Random Selector', () => {
  const participants: Participant[] = [
    { nom: 'Alice' },
    { nom: 'Bob' },
    { nom: 'Charlie' },
    { nom: 'David' },
    { nom: 'Eve' },
  ];

  it('devrait sélectionner un gagnant par défaut', () => {
    const result = selectWinners(participants);

    expect(result.winners).toHaveLength(1);
    expect(participants).toContainEqual(result.winners[0]);
    expect(result.totalParticipants).toBe(5);
    expect(result.hash).toBeDefined();
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('devrait sélectionner plusieurs gagnants', () => {
    const result = selectWinners(participants, { count: 3 });

    expect(result.winners).toHaveLength(3);
    expect(result.totalParticipants).toBe(5);

    // Vérifier qu'il n'y a pas de doublons
    const names = result.winners.map((w) => w.nom);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(3);
  });

  it('devrait produire le même résultat avec le même seed et la même clock', () => {
    const fixedClock = createFixedClock(new Date('2025-01-01T00:00:00.000Z'));

    const result1 = selectWinners(participants, { seed: 'test-seed', count: 3 }, fixedClock);
    const result2 = selectWinners(participants, { seed: 'test-seed', count: 3 }, fixedClock);

    // Avec le même seed et la même clock, tout doit être identique
    expect(result1.winners).toEqual(result2.winners);
    expect(result1.timestamp).toEqual(result2.timestamp);
    expect(result1.hash).toBe(result2.hash);
  });

  it('devrait produire des résultats différents avec des seeds différents', () => {
    const fixedClock = createFixedClock(new Date('2025-01-01T00:00:00.000Z'));

    const result1 = selectWinners(participants, { seed: 'seed1' }, fixedClock);
    const result2 = selectWinners(participants, { seed: 'seed2' }, fixedClock);

    // Avec des seeds différents, les hash doivent être différents
    expect(result1.hash).not.toBe(result2.hash);
  });

  it('devrait produire des hash différents avec des timestamps différents', () => {
    const clock1 = createFixedClock(new Date('2025-01-01T00:00:00.000Z'));
    const clock2 = createFixedClock(new Date('2025-01-01T00:01:00.000Z'));

    const result1 = selectWinners(participants, { seed: 'same-seed' }, clock1);
    const result2 = selectWinners(participants, { seed: 'same-seed' }, clock2);

    // Même seed mais timestamps différents = hash différents
    expect(result1.winners).toEqual(result2.winners); // Mêmes gagnants
    expect(result1.hash).not.toBe(result2.hash); // Mais hash différents
  });

  it('devrait exclure les participants spécifiés', () => {
    const result = selectWinners(participants, {
      count: 2,
      exclude: ['Alice', 'Bob'],
    });

    expect(result.totalParticipants).toBe(3); // 5 - 2 exclus
    expect(result.winners).toHaveLength(2);

    const names = result.winners.map((w) => w.nom);
    expect(names).not.toContain('Alice');
    expect(names).not.toContain('Bob');
  });

  it('devrait gérer les exclusions insensibles à la casse', () => {
    const result = selectWinners(participants, {
      count: 1,
      exclude: ['alice', 'BOB'], // Minuscules/majuscules mélangés
    });

    expect(result.totalParticipants).toBe(3);
    const names = result.winners.map((w) => w.nom);
    expect(names).not.toContain('Alice');
    expect(names).not.toContain('Bob');
  });

  it('devrait lever une erreur si la liste est vide', () => {
    expect(() => selectWinners([])).toThrow(PickerError);
    expect(() => selectWinners([])).toThrow(/liste des participants est vide/);
  });

  it('devrait lever une erreur si count < 1', () => {
    expect(() => selectWinners(participants, { count: 0 })).toThrow(PickerError);
    expect(() => selectWinners(participants, { count: -1 })).toThrow(PickerError);
  });

  it("devrait lever une erreur si count n'est pas un entier", () => {
    expect(() => selectWinners(participants, { count: 1.5 })).toThrow(PickerError);
  });

  it('devrait lever une erreur si count > participants', () => {
    expect(() => selectWinners(participants, { count: 10 })).toThrow(PickerError);
    expect(() => selectWinners(participants, { count: 10 })).toThrow(/Impossible de sélectionner/);
  });

  it('devrait lever une erreur si tous les participants sont exclus', () => {
    expect(() =>
      selectWinners(participants, {
        exclude: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
      })
    ).toThrow(PickerError);
    expect(() =>
      selectWinners(participants, {
        exclude: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
      })
    ).toThrow(/Aucun participant éligible/);
  });

  it('devrait avoir une distribution équitable (test statistique ±2% sur 10k tirages)', () => {
    // Test de fairness : sur beaucoup de tirages, chaque participant
    // devrait être sélectionné environ le même nombre de fois

    const iterations = 10000;
    const counts = new Map<string, number>();

    for (let i = 0; i < iterations; i++) {
      const result = selectWinners(participants, { seed: `test-${i}` });
      const winner = result.winners[0].nom;
      counts.set(winner, (counts.get(winner) || 0) + 1);
    }

    // Chaque participant devrait être sélectionné environ 20% du temps (± 2%)
    const expectedRate = 1 / participants.length;
    const tolerance = 0.02; // 2%

    for (const participant of participants) {
      const count = counts.get(participant.nom) || 0;
      const rate = count / iterations;
      expect(rate).toBeGreaterThan(expectedRate - tolerance);
      expect(rate).toBeLessThan(expectedRate + tolerance);
    }
  });
});
