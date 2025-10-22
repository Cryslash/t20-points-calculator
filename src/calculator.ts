export type AttributeName = "Força" | "Destreza" | "Constituição" | "Inteligência" | "Sabedoria" | "Carisma";

const costTable: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 6,
  15: 8,
  16: 10,
  17: 13,
  18: 16
  // ajuste depois conforme as regras corretas
};

export function getCostForValue(value: number): number {
  return costTable[value] ?? 0;
}

export function calculateTotalCost(values: Record<AttributeName, number>): number {
  let total = 0;
  for (const key of Object.keys(values) as AttributeName[]) {
    total += getCostForValue(values[key]);
  }
  return total;
}
