type TransformationTuple = [number, number, number];

interface TransformationComponent {
  rotation: TransformationTuple;
  rotation_pivot: TransformationTuple;
  scale: TransformationTuple;
  scale_pivot: TransformationTuple;
  translation: TransformationTuple;
}

export type { TransformationComponent};
