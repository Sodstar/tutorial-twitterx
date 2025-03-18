"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

export default function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleFollow = async () => {
    setIsLoading(true);
    try{
        // follow user
        await toggleFollow(userId)
        toast.success("Амжилттай дагалаа");
    }catch(error){
      console.error(error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Дагах"}
    </Button>
  );
}
