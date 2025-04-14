interface DestructibleByExplosionOptions {
  explosion_resistance: number;
}

type DestructibleByExplosionComponent = DestructibleByExplosionOptions | boolean;

export type { DestructibleByExplosionComponent };