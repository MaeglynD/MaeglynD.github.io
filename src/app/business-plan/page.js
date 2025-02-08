"use client";
import Image from "next/image";

export default function BusinessPlan() {
  return (
    <div className="flex w-full max-w-[768px] h-screen m-auto">
      <Image
        className="h-fit w-full mt-[60px] rounded-[5px]"
        height={960}
        width={512}
        src="/mission.png"
        alt="serious business plan"
      />
    </div>
  );
}
