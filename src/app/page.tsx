'use client'

import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const words = [
    {
      text: "应用等价类生成随机迷宫",
    },
    {
      text: "寻找迷宫路径",
      className: "text-yellow-500 dark:text-yellow-500",
    },
  ];

  const handleClick = () => {
    console.log("Click enter!");
    router.push('/main');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        数据结构课设十二
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={handleClick}>
          进入
        </button>
      </div>
    </div>
  );
}
