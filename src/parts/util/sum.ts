/** The numbers added up; none gives 0. */
export const sum = (numbers: readonly number[]) => numbers.reduce((total, n) => total + n, 0);
