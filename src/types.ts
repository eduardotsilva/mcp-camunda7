export interface CamundaVariable {
  value: unknown;
  type: string;
}

export type CamundaVariables = Record<string, CamundaVariable>;

export function toVariables(
  vars: Record<string, unknown> | undefined
): CamundaVariables | undefined {
  if (!vars) return undefined;
  const result: CamundaVariables = {};
  for (const [key, value] of Object.entries(vars)) {
    result[key] = { value, type: inferType(value) };
  }
  return result;
}

function inferType(value: unknown): string {
  if (value === null) return "Null";
  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "number") return Number.isInteger(value) ? "Long" : "Double";
  if (typeof value === "string") return "String";
  if (typeof value === "object") return "Json";
  return "String";
}
