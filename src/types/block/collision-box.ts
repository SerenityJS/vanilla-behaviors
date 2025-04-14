type CollisionTuple = [number, number, number];

interface CollisionBoxOptions {
  origin: CollisionTuple;
  size: CollisionTuple;
}

type CollisionBoxComponent =  CollisionBoxOptions | boolean;

export type { CollisionBoxComponent };
