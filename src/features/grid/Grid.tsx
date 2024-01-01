export const getGridDimensions = (): [number, number] => {
  if (window.innerWidth < 768) {
    return [6, 13];
  }
  return [25, 40];
};

export const getInitialGrid = (): Node[][] => {
  const [numRows, numCols] = getGridDimensions();
  const startRow = Math.floor(numRows / 2);
  const finishRow = Math.floor(numRows / 2);
  const startCol = Math.floor(numCols / 4);
  const finishCol = Math.floor((3 * numCols) / 4);

  const grid = Array.from({ length: numRows }, (_, row) =>
    Array.from({ length: numCols }, (_, col) =>
      createNode(col, row, startRow, startCol, finishRow, finishCol),
    ),
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

export const createNode = (
  col: number,
  row: number,
  startRow: number,
  startCol: number,
  finishRow: number,
  finishCol: number,
): Node => ({
  col,
  row,
  isStart: row === startRow && col === startCol,
  isFinish: row === finishRow && col === finishCol,
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
  return grid.map((innerRow, rowIndex) =>
    innerRow.map((node, colIndex) => {
      if (
        rowIndex === row &&
        colIndex === col &&
        !node.isStart &&
        !node.isFinish
      ) {
        return { ...node, isWall: !node.isWall };
      }
      return node;
    }),
  );
};
