interface EntityTypeDescription {
  identifier: string;
  properties?: Record<string, {
    type: "bool" | "enum" | "float" | "int";
    values?: Array<string>,
    range?: [number, number];
    default: string | number | boolean;
  }>;
}

export type { EntityTypeDescription };
