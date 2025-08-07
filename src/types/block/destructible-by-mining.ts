interface DestructibleByMiningOptions {
  seconds_to_destroy: number;
}
  
type DestructibleByMiningComponent = DestructibleByMiningOptions | boolean;
  
export type { DestructibleByMiningComponent };