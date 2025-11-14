/**
 * Interface pour l'injection de dépendance du temps
 * Permet de mocker le temps dans les tests
 */
export interface Clock {
  /** Retourne la date et heure actuelle */
  now(): Date;
}

/**
 * Clock système utilisant la vraie date/heure
 */
export const systemClock: Clock = {
  now: () => new Date(),
};

/**
 * Crée une clock fixe pour les tests
 * @param date - Date fixe à retourner
 */
export const createFixedClock = (date: Date): Clock => ({
  now: () => date,
});
