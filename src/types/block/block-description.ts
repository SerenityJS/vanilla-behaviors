interface BlockTypeDescription {
  identifier: string;
  states?: Record<string, Array<number | string | boolean>>;
}

export type { BlockTypeDescription };
