type SelectionTuple = [number, number, number];

interface SelectionBoxOptions {
  origin: SelectionTuple;
  size: SelectionTuple;
}

type SelectionBoxComponent =  SelectionBoxOptions | boolean;

export type { SelectionBoxComponent };
