import { WearableSlot } from "@serenityjs/protocol";

interface ItemWearableOptions {
  slot: WearableSlot; // The slot where the wearable item can be equipped

  protection: number; // The amount of protection the wearable item provides
}

export type { ItemWearableOptions };