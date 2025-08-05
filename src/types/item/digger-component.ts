interface DiggerOptions {
  use_efficiency: boolean;
  destroy_speeds: Array<DiggerDestroySpeedOptions>;
}

interface DiggerDestroySpeedOptions {
  speed: number;
  block: { tags: string } | string;
}

export type { DiggerOptions, DiggerDestroySpeedOptions };
