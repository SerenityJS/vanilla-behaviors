import type { MaterialRenderMethod } from "@serenityjs/protocol";

interface MaterialInstance {
  texture: string;
  render_method: MaterialRenderMethod;
  face_diming: boolean;
  ambient_occlusion: boolean;
}

type MaterialInstancesComponent = Record<string, MaterialInstance>;

export type { MaterialInstancesComponent };
