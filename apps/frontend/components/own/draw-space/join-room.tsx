import React from "react";

import toast from "react-hot-toast";
import { useState } from "react";
import useSession from "../../../hooks/useSession";
import useSocket from "../../../hooks/useSocket";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "@radix-ui/react-label";

export default function JoinRoom() {
  const [link, setLink] = useState("");
  const { mode, roomId } = useSession();
  const { joinRoom } = useSocket();

  const getRoomIdfromLink = () => {
    try {
      const url = new URL(link.trim());
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1];
    } catch (error) {
      console.error("Invalid URL format:", error);
    }
  };

  return (
    // <div
    //   className="fixed inset-0 w-full h-full flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm"
    //   onClick={() => setJoinRoom(false)}
    // >
    //   <div className="relative" onClick={(e) => e.stopPropagation()}>
    //     <div className="border border-neutral-800 p-4 w-72 sm:p-6 sm:w-96 h-72 flex flex-col gap-10 rounded-2xl bg-neutral-900/80 backdrop-blur-md shadow-2xl">
    //       <div className="flex justify-between items-center">
    //         <div className="text-3xl text-white">Join Room</div>
    //         <div
    //           onClick={() => setJoinRoom(false)}
    //           className="cursor-pointer hover:bg-neutral-700 p-2 rounded-lg transition-colors"
    //         >
    //           <X className="text-white" />
    //         </div>
    //       </div>
    //       <div className="flex flex-col gap-4">
    //         <Label>Room link</Label>
    //         <Input
    //           placeholder="Enter Room Link"
    //           className=""
    //           value={link}
    //           onChange={(e) => setLink(e.target.value)}
    //         />
    //         <Button
    //           className={`sm:w-full`}
    //           onClick={() => {
    //             const roomId = getRoomIdfromLink();
    //             if (roomId) {
    //               joinRoom(roomId);
    //             } else {
    //               toast.error("Invalid room link. Please check the format.");
    //             }
    //           }}
    //         >
    //           Join Room
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="w-full flex flex-col gap-4 mt-4">
      <Label className="text-md text-neutral-600 dark:text-neutral-300">
        Room Link
      </Label>
      <Input
        placeholder="Enter room link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full"
      />
      <Button
        onClick={() => {
          const roomId = getRoomIdfromLink();
          if (roomId) {
            joinRoom(roomId);
          } else {
            toast.error("Invalid room link. Please check the format.");
          }
        }}
        className="bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
      >
        Join Room
      </Button>
    </div>
  );
}
