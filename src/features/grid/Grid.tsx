export const startNodeRow = 10;
export const startNodeCol = 5;
export const finishNodeRow = 10;
export const finishNodeCol = 34;

export const getInitialGrid = (): Node[][] => {
  const grid = Array.from({ length: 25 }, (_, row) =>
    Array.from({ length: 40 }, (_, col) => createNode(col, row)),
  );
  return grid;
};

export type Node = {
  col: number;
  row: number;
  isStart: boolean;
  isFinish: boolean;
  distance: number;
  isVisited: boolean;
  isWall: boolean;
  previousNode: Node | null;
};

export const createNode = (col: number, row: number): Node => ({
  col,
  row,
  isStart: row === startNodeRow && col === startNodeCol,
  isFinish: row === finishNodeRow && col === finishNodeCol,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  previousNode: null,
});

export const getNewGridWithToggledWall = (
  grid: Node[][],
  row: number,
  col: number,
): Node[][] => {
  const newGrid = [...grid];
  const node = { ...newGrid[row][col] };
  node.isWall = !node.isWall;
  newGrid[row][col] = node;
  return newGrid;
};
