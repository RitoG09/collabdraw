import { useState } from "react";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { createRoom } from "api/room";
import { Label } from "components/ui/label";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { Check, Copy } from "lucide-react";
import useSocket from "hooks/useSocket";
import useSession from "hooks/useSession";

export default function CreateRoom({ setCreateRoom }: any) {
  const [roomLink, setRoomLink] = useState("");
  const [loader, setLoader] = useState(false);
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { joinRoom } = useSocket();
  const { mode, roomId } = useSession();

  const generateRoomLink = async () => {
    try {
      setLoader(true);
      const roomId = nanoid(15);
      const link = `${window.location.origin}/canvas/room/${roomId}`;
      setRoomLink(link);
      const roomData = { linkId: roomId };
      await createRoom(roomData);
      toast.success("Room created succesfully! Share the link with anyone.");
      setIsRoomCreated(true);
      setLoader(false);
    } catch (error: any) {
      toast.error(
        error.message || "Oops! Something went wrong during room creation."
      );
      setLoader(false);
    }
  };

  const copyLinktoClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  return (
    <div>
      {isRoomCreated ? (
        <div className="w-full flex flex-col gap-4 mt-4">
          <Label className="text-md text-neutral-600 dark:text-neutral-300">
            Room Link Genreated
          </Label>
          <Input
            placeholder="Enter room link"
            value={roomLink}
            readOnly
            className="flex-1 bg-neutral-800 border-neutral-700 text-neutral-200 w-52 sm:w-72"
          />
          <Button
            onClick={copyLinktoClipboard}
            className="px-1 py-3 mt-9 bg-neutral-200 hover:bg-neutral-300 border border-neutral-600 flex justify-center items-center"
          >
            {isCopied ? (
              <Check className="size-4 text-green-700" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
          <div className="text-neutral-400 bg-neutral-800/50 p-3 rounded-lg">
            Share this link with others to invite them to your room.
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const roomId = roomLink.split("/").pop() || "";
                joinRoom(roomId);
              }}
            >
              Join Room
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-neutral-300">
            Click the button below to generate a new room link that you can
            share with others.
          </p>
          <Button onClick={generateRoomLink} className="w-full">
            {loader ? "Generating Room..." : "Generate Room Link"}
          </Button>
        </div>
      )}
    </div>
  );
}
