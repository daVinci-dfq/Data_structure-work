import React from 'react';

export const generateMaze = (n: number) => {
  console.log(n);

  const horizWalls = Array.from({ length: n - 1 }, () => new Array(n).fill(true));
  const vertiWalls = Array.from({ length: n }, () => new Array(n - 1).fill(true));

  const edges: Array<[number, number, string]> = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (j < n - 1) {
        edges.push([i, j, 'right']);
      }
      if (i < n - 1) {
        edges.push([i, j, 'down']);
      }
    }
  }

  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [edges[i], edges[j]] = [edges[j], edges[i]];
  }

  class UnionFind {
    private parent: number[];
    private rank: number[];

    constructor(size: number) {
      this.parent = Array.from({ length: size }, (_, index) => index);
      this.rank = new Array(size).fill(0);
    }

    find(x: number): number {
      if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
      }
      return this.parent[x];
    }

    union(x: number, y: number): boolean {
      const xroot = this.find(x);
      const yroot = this.find(y);
      if (xroot === yroot) return false;
      if (this.rank[xroot] < this.rank[yroot]) {
        this.parent[xroot] = yroot;
      } else {
        this.parent[yroot] = xroot;
        if (this.rank[xroot] === this.rank[yroot]) {
          this.rank[xroot]++;
        }
      }
      return true;
    }
  }

  const uf = new UnionFind(n * n);

  for (const [i, j, direction] of edges) {
    const cell1 = i * n + j;
    let cell2 = cell1;
    if (direction === 'right') {
      cell2 = cell1 + 1;
    } else if (direction === 'down') {
      cell2 = cell1 + n;
    }

    if (uf.union(cell1, cell2)) {
      if (direction === 'right') {
        vertiWalls[i][j] = false;
      } else {
        horizWalls[i][j] = false;
      }
    }
  }

  return { horizWalls, vertiWalls };
};

interface MazeProps {
  size: number;
  cellSize: number;
  horizWalls: boolean[][];
  vertiWalls: boolean[][];
  path: [number, number][];
}

export const Maze: React.FC<MazeProps> = ({ size, cellSize, horizWalls, vertiWalls, path }) => {
  return (
    <svg
      width={size * cellSize}
      height={size * cellSize}
      style={{ border: "1px solid black" }}
    >
      {/* 绘制水平墙壁 */}
      {horizWalls.map((row, i) =>
        row.map((isWall, j) =>
          isWall && (
            <line
              key={`h-${i}-${j}`}
              x1={j * cellSize}
              y1={(i + 1) * cellSize}
              x2={(j + 1) * cellSize}
              y2={(i + 1) * cellSize}
              stroke="black"
              strokeWidth="2"
            />
          )
        )
      )}

      {/* 绘制垂直墙壁 */}
      {vertiWalls.map((row, i) =>
        row.map((isWall, j) =>
          isWall && (
            <line
              key={`v-${i}-${j}`}
              x1={(j + 1) * cellSize}
              y1={i * cellSize}
              x2={(j + 1) * cellSize}
              y2={(i + 1) * cellSize}
              stroke="black"
              strokeWidth="2"
            />
          )
        )
      )}

      {/* 绘制路径 */}
      {path.length > 0 && (
        <g>
          {path.map(([i, j], index) => (
            <circle
              key={`path-${index}`}
              cx={(j + 0.5) * cellSize}
              cy={(i + 0.5) * cellSize}
              r={cellSize * 0.2}
              fill="red"
            />
          ))}
          {path.slice(0, -1).map(([i, j], index) => {
            const [nextI, nextJ] = path[index + 1];
            return (
              <line
                key={`line-${index}`}
                x1={(j + 0.5) * cellSize}
                y1={(i + 0.5) * cellSize}
                x2={(nextJ + 0.5) * cellSize}
                y2={(nextI + 0.5) * cellSize}
                stroke="red"
                strokeWidth="2"
              />
            );
          })}
        </g>
      )}
    </svg>
  );
};