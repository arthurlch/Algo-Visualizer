import { useEffect, useState } from 'react';
import { getInitialGrid, getNewGridWithToggledWall } from '../grid/Grid';
import { Dijkstra, GetNodesInShortestPathOrder } from '@/algorithms/Dijkstra';
import type { Node as NodeType } from '../grid/Grid';
import '@/styles/feature/dijkstra_visualizer.css';
import DijkstraVisualizerPresenter from './DijkstraVisualizerPresenter';

function DijkstraVisualizer(): React.ReactElement {
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizationStarted, setIsVisualizationStarted] = useState(false);
  const [startNode, setStartNode] = useState<NodeType | null>(null);
  const [finishNode, setFinishNode] = useState<NodeType | null>(null);
  const [currentNode, setCurrentNode] = useState<NodeType | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState<NodeType[]>([]);

  const initializeGridAndNodes = (): void => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
    for (const row of initialGrid) {
      for (const node of row) {
        if (node.isStart) {
          setStartNode(node);
        }
        if (node.isFinish) {
          setFinishNode(node);
        }
      }
    }
  };

  useEffect(() => {
    initializeGridAndNodes();
  }, []);

  useEffect(() => {
    if (isVisualizationStarted && startNode && finishNode) {
      const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = GetNodesInShortestPathOrder(finishNode);
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    // let's make an exception here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisualizationStarted, startNode, finishNode, grid]);

  const handleMouseDown = (row: number, col: number): void => {
    if (isVisualizationStarted || !isAnimationFinished) {
      return;
    }
    const newGrid = getNewGridWithToggledWall(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number): void => {
    if (!mouseIsPressed || isVisualizationStarted || !isAnimationFinished) {
      return;
    }
    if (!mouseIsPressed) {
      return;
    }
    const newGrid = getNewGridWithToggledWall(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = (): void => {
    if (isVisualizationStarted || !isAnimationFinished) {
      return;
    }
    setMouseIsPressed(false);
  };

  const visualizeDijkstra = (): void => {
    setIsAnimationFinished(false);
    if (startNode === null || finishNode === null) {
      return;
    }
    const startTime = performance.now();
    const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
    const endTime = performance.now();
    setExecutionTime(endTime - startTime);
    const nodesInShortestPathOrder = GetNodesInShortestPathOrder(finishNode);
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
        setCurrentNode(node);
        setVisitedNodes((prevNodes) => [...prevNodes, node]);
        document
          .getElementById(`node-${node.row}-${node.col}`)
          ?.classList.add('node-visited');
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: NodeType[]): void => {
    // Calculate total animation duration
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
      setIsVisualizationStarted(false);
      setIsAnimationFinished(true);
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
    setIsVisualizationStarted(false);
    setIsAnimationFinished(false);
    setCurrentNode(null);
    setVisitedNodes([]);
  };

  return (
    <DijkstraVisualizerPresenter
      grid={grid}
      handleMouseDown={handleMouseDown}
      handleMouseEnter={handleMouseEnter}
      handleMouseUp={handleMouseUp}
      visualizeDijkstra={visualizeDijkstra}
      resetAlgorithm={resetAlgorithm}
      isVisualizationStarted={isVisualizationStarted}
      currentNode={currentNode}
      visitedNodes={visitedNodes}
      executionTime={executionTime}
      isAnimationFinished={isAnimationFinished}
    />
  );
}

export default DijkstraVisualizer;
