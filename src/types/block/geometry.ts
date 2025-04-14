interface GeometryOptions {
  identifier: string;
  bone_visibility: Record<string, boolean | string>;
}

type GeometryComponent = GeometryOptions | string;

export type { GeometryComponent };