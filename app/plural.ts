const rules = new Intl.PluralRules('ru');

/**
 * Picks the Russian noun form that agrees with a number.
 *
 * Russian has three: 1 запись, 2 записи, 5 записей — and 21 takes the first
 * again. `Intl.PluralRules` knows the rule; this only maps its answer.
 */
export const plural = (count: number, one: string, few: string, many: string): string => {
  const category = rules.select(count);

  return category === 'one' ? one : category === 'few' ? few : many;
};
