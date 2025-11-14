import { Clock, systemClock, createFixedClock } from '../../src/utils/clock';

describe('Clock', () => {
  describe('systemClock', () => {
    it('devrait retourner une date', () => {
      const now = systemClock.now();
      expect(now).toBeInstanceOf(Date);
    });

    it('devrait retourner des dates différentes à chaque appel', async () => {
      const date1 = systemClock.now();
      // Attendre 1ms
      await new Promise((resolve) => setTimeout(resolve, 1));
      const date2 = systemClock.now();

      expect(date2.getTime()).toBeGreaterThanOrEqual(date1.getTime());
    });
  });

  describe('createFixedClock', () => {
    it('devrait retourner toujours la même date', () => {
      const fixedDate = new Date('2025-01-01T00:00:00.000Z');
      const clock = createFixedClock(fixedDate);

      const date1 = clock.now();
      const date2 = clock.now();
      const date3 = clock.now();

      expect(date1).toEqual(fixedDate);
      expect(date2).toEqual(fixedDate);
      expect(date3).toEqual(fixedDate);
    });

    it('devrait respecter le fuseau horaire de la date fournie', () => {
      const fixedDate = new Date('2025-06-15T14:30:45.123Z');
      const clock = createFixedClock(fixedDate);

      const result = clock.now();

      expect(result.toISOString()).toBe('2025-06-15T14:30:45.123Z');
    });

    it("devrait implémenter l'interface Clock", () => {
      const fixedDate = new Date();
      const clock: Clock = createFixedClock(fixedDate);

      expect(clock.now).toBeDefined();
      expect(typeof clock.now).toBe('function');
    });
  });
});
