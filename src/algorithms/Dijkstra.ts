import type { Node } from '@/features/grid/Grid';

export function Dijkstra(
  grid: Node[][],
  startNode: Node,
  finishNode: Node,
): Node[] {
  const visitedNodesInOrder: Node[] = [];
  startNode.distance = 0;
  const unvisitedNodes = GetAllNodes(grid);
  const unvisitedSet = new Set<Node>(unvisitedNodes);
  while (unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();

    if (!closestNode || closestNode.isWall) {
      continue;
    }

    if (closestNode.distance === Infinity) {
      return visitedNodesInOrder;
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }
    UpdateUnvisitedNeighbors(closestNode, grid, unvisitedNodes, unvisitedSet);
  }
  return visitedNodesInOrder;
}

function UpdateUnvisitedNeighbors(
  node: Node,
  grid: Node[][],
  unvisitedNodes: Node[],
  unvisitedSet: Set<Node>,
): void {
  const neighbors = GetUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
    if (!unvisitedSet.has(neighbor)) {
      unvisitedNodes.push(neighbor);
      unvisitedSet.add(neighbor);
    }
  }
}

function GetUnvisitedNeighbors(node: Node, grid: Node[][]): Node[] {
  const neighbors: Node[] = [];
  const { col, row } = node;
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function GetAllNodes(grid: Node[][]): Node[] {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function GetNodesInShortestPathOrder(finishNode: Node): Node[] {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = finishNode;
  while (currentNode) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
