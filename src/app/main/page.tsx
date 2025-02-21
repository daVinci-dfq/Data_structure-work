"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
import { Slider } from "../../components/ui/slider";
import "./main.css";
import { Maze, generateMaze } from "../../components/maze";

export default function Main() {
  const [inputValue, setInputValue] = useState("");
  const [maze, setMaze] = useState<{ horizWalls: boolean[][]; vertiWalls: boolean[][] }>({
    horizWalls: [],
    vertiWalls: [],
  });
  const [size, setSize] = useState<number>(10);
  const cellSize = 30;

  const [scale, setScale] = useState<number>(1);
  const [showPath, setShowPath] = useState<boolean>(false);
  const [path, setPath] = useState<[number, number][]>([]);

  const placeholders = ["请输入迷宫规格", "请输入大于2并小于100的数字"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const size = Number(inputValue);

    if (isNaN(size) || size <= 2 || size >= 100) {
      alert("请输入大于2并小于100的数字！");
      return;
    }

    const generatedMaze = generateMaze(size);
    setMaze(generatedMaze);
    setSize(size);
    setShowPath(false);
    setPath([]);
  };

  const handleMaze = () => {
    const { horizWalls, vertiWalls } = maze;
    const visited = Array.from({ length: size }, () => new Array(size).fill(false));
    const path: [number, number][] = [];

    const dfs = (i: number, j: number): boolean => {
      if (i === size - 1 && j === size - 1) {
        path.push([i, j]);
        return true;
      }

      if (i < 0 || i >= size || j < 0 || j >= size || visited[i][j]) {
        return false;
      }

      visited[i][j] = true;
      path.push([i, j]);

      // 尝试向右、下、左、上方向探索
      if (j < size - 1 && !vertiWalls[i][j] && dfs(i, j + 1)) {
        return true;
      }
      if (i < size - 1 && !horizWalls[i][j] && dfs(i + 1, j)) {
        return true;
      }
      if (j > 0 && !vertiWalls[i][j - 1] && dfs(i, j - 1)) {
        return true;
      }
      if (i > 0 && !horizWalls[i - 1][j] && dfs(i - 1, j)) {
        return true;
      }

      path.pop();
      return false;
    };

    dfs(0, 0);
    setPath(path);
    setShowPath(true);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-grow p-4">
        <div className="mb-4 flex items-center">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
        <div
          className="border p-4 h-[calc(100%-60px)]"
          style={{ width: "1300px", height: "700px", overflow: "auto" }}
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <Maze
              size={size}
              cellSize={cellSize}
              horizWalls={maze.horizWalls}
              vertiWalls={maze.vertiWalls}
              path={showPath ? path : []}
            />
          </div>
        </div>
      </div>
      <div className="w-1/4 p-4 border-l flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="mb-2">缩放：</div>
          <Slider value={[scale]} onValueChange={(value) => setScale(value[0])} min={0.1} max={2} step={0.1} />
        </div>
        <button
          className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
          onClick={handleMaze}
        >
          显示路径
        </button>
      </div>
    </div>
  );
}