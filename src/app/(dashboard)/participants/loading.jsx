import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ParticipantLoader = () => {
  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 justify-between items-center">
        <h1 className="font-bold text-xl">Participants</h1>
        <div className="flex flex-row flex-wrap gap-2 justify-between max-lg:w-full">
          <div className="flex flex-1 basis-2/3 gap-2">
            <Skeleton className="flex-1 min-w-[180px] h-[30px] bg-foreground/50" />
            <Skeleton className="flex-1 min-w-[100px] h-[30px] bg-foreground/50" />
          </div>
          <Skeleton className="basis-1/3 min-w-[100px] flex-1 h-[30px] bg-foreground/50" />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-grow flex-col gap-2">
        <Skeleton className="h-[10%] w-full bg-foreground/50" />
        <Skeleton className="h-[90%] w-full bg-foreground/50" />
      </div>
    </>
  );
};

export default ParticipantLoader;
