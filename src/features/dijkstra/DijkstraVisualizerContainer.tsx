/* eslint-disable no-console */
import { useEffect } from 'react';
import { getInitialGrid, getNewGridWithToggledWall } from '../grid/Grid';
import { Dijkstra, GetNodesInShortestPathOrder } from '@/algorithms/Dijkstra';
import type { Node as NodeType } from '../grid/Grid';
import '@/styles/feature/dijkstra_visualizer.css';
import DijkstraVisualizerPresenter from './DijkstraVisualizerPresenter';
import { atom, useAtom } from 'jotai';

const dijkstraStateAtom = atom({
  grid: getInitialGrid(),
  mouseIsPressed: false,
  isVisualizationStarted: false,
  startNode: null as NodeType | null,
  finishNode: null as NodeType | null,
  currentNode: null as NodeType | null,
  executionTime: null as number | null,
  isAnimationFinished: true,
  visitedNodes: [] as NodeType[],
});

function DijkstraVisualizer(): React.ReactElement {
  const [state, setState] = useAtom(dijkstraStateAtom);

  const initializeGridAndNodes = (): void => {
    const initialGrid = getInitialGrid();
    let foundStartNode: NodeType | null = null;
    let foundFinishNode: NodeType | null = null;

    for (const row of initialGrid) {
      for (const node of row) {
        if (node.isStart) {
          foundStartNode = node;
        }
        if (node.isFinish) {
          foundFinishNode = node;
        }
      }
    }

    if (foundStartNode && foundFinishNode) {
      setState((prevState) => ({
        ...prevState,
        grid: initialGrid,
        startNode: foundStartNode,
        finishNode: foundFinishNode,
        isAnimationFinished: true,
      }));
    }
  };

  // no need to add the dependencies
  useEffect(() => {
    initializeGridAndNodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (row: number, col: number): void => {
    if (state.isVisualizationStarted || !state.isAnimationFinished) {
      return;
    }
    const newGrid = getNewGridWithToggledWall(state.grid, row, col);
    const node = newGrid[row][col];
    setState((prevState) => ({
      ...prevState,
      grid: newGrid,
      mouseIsPressed: true,
      startNode: node.isStart ? node : prevState.startNode,
      finishNode: node.isFinish ? node : prevState.finishNode,
    }));
  };

  const handleMouseEnter = (row: number, col: number): void => {
    if (
      !state.mouseIsPressed ||
      state.isVisualizationStarted ||
      !state.isAnimationFinished
    ) {
      return;
    }
    const newGrid = getNewGridWithToggledWall(state.grid, row, col);
    setState((prevState) => ({
      ...prevState,
      grid: newGrid,
    }));
  };

  const handleMouseUp = (): void => {
    if (state.isVisualizationStarted || !state.isAnimationFinished) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      mouseIsPressed: false,
    }));
  };

  const checkStartFinishIsolation = (): boolean => {
    const checkIsolation = (node: NodeType): boolean => {
      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      return directions.every(([dx, dy]) => {
        const neighborRow = node.row + dy;
        const neighborCol = node.col + dx;
        if (
          neighborRow >= 0 &&
          neighborRow < state.grid.length &&
          neighborCol >= 0 &&
          neighborCol < state.grid[0].length
        ) {
          const neighbor = state.grid[neighborRow][neighborCol];
          return neighbor.isWall;
        }
        return true;
      });
    };

    const startIsolated = state.startNode
      ? checkIsolation(state.startNode)
      : false;
    const finishIsolated = state.finishNode
      ? checkIsolation(state.finishNode)
      : false;

    return startIsolated || finishIsolated;
  };

  const visualizeDijkstra = (): void => {
    if (checkStartFinishIsolation()) {
      console.log('Start or Finish node is isolated by walls.');
      return;
    }
    if (checkStartFinishIsolation()) {
      console.log(
        'Start or Finish node is isolated. Cannot run the algorithm.',
      );
      return;
    }
    if (state.startNode === null || state.finishNode === null) {
      console.log('Start or Finish node is null, cannot run algorithm.');
      return;
    }
    const startTime = performance.now();
    const visitedNodesInOrder = Dijkstra(
      state.grid,
      state.startNode,
      state.finishNode,
    );
    const endTime = performance.now();
    const nodesInShortestPathOrder = GetNodesInShortestPathOrder(
      state.finishNode,
    );

    setState((prevState) => ({
      ...prevState,
      isVisualizationStarted: true,
      isAnimationFinished: false,
      executionTime: endTime - startTime,
      visitedNodes: visitedNodesInOrder,
    }));

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animateDijkstra = (
    visitedNodesInOrder: NodeType[],
    nodesInShortestPathOrder: NodeType[],
  ): void => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        setState((prevState) => ({
          ...prevState,
          currentNode: node,
        }));
        document
          .getElementById(`node-${node.row}-${node.col}`)
          ?.classList.add('node-visited');
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: NodeType[]): void => {
    const animationDuration = 50 * nodesInShortestPathOrder.length;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          ?.classList.add('node-shortest-path');
      }, 50 * i);
    }
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isVisualizationStarted: false,
        isAnimationFinished: true,
      }));
    }, animationDuration);
  };

  const clearAnimations = (): void => {
    const nodes = document.querySelectorAll(
      '.node-visited, .node-shortest-path',
    );
    nodes.forEach((node) => {
      node.classList.remove('node-visited', 'node-shortest-path');
    });
  };

  const resetAlgorithm = (): void => {
    clearAnimations();
    initializeGridAndNodes();
    setState((prevState) => ({
      ...prevState,
      isVisualizationStarted: false,
      isAnimationFinished: true,
      currentNode: null,
      visitedNodes: [],
    }));
  };

  return (
    <DijkstraVisualizerPresenter
      grid={state.grid}
      handleMouseDown={handleMouseDown}
      handleMouseEnter={handleMouseEnter}
      handleMouseUp={handleMouseUp}
      visualizeDijkstra={visualizeDijkstra}
      resetAlgorithm={resetAlgorithm}
      isVisualizationStarted={state.isVisualizationStarted}
      currentNode={state.currentNode}
      visitedNodes={state.visitedNodes}
      executionTime={state.executionTime}
      isAnimationFinished={state.isAnimationFinished}
    />
  );
}

export default DijkstraVisualizer;
