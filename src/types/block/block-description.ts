interface BlockTypeDescription {
  identifier: string;
  states?: Record<string, Array<number | string | boolean>>;
  menu_category?: {
    category?: string;
    group?: string;
  }
}

export type { BlockTypeDescription };
