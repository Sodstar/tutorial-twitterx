import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import { SignIn, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();

  if (!authUser) return unauthenticatedSidebar("Тавтай морил");

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  return (
    <div className="top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2">
                <AvatarImage src={user.image || "avatar.jpg"} />
              </Avatar>
              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </Link>
            {user.bio && (
              <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>
            )}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{user._count.following}</p>
                  <p className="text-xs text-muted-foreground">Дагаж байгаа</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                <p className="font-medium">{user._count.posts}</p>
                <p className="text-xs text-muted-foreground">Пост</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                <p className="font-medium">{user._count.followers}</p>
                <p className="text-xs text-muted-foreground">Дагагчид</p>
                </div>
              </div>
              <Separator className="my-4" />

              <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user.location || "Нууцалсан"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {user.website ? (
                  <a href={`${user.website}`} className="hover:underline truncate" target="_blank">
                    {user.website}
                  </a>
                ) : (
                  "Нууцалсан"
                )}
              </div>
            </div>
            
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;

const unauthenticatedSidebar = (welcome: any | null) => {
  return (
    <div className="sticky top-20">
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            {welcome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Та нэвтэрч ороод бусад үйлдлийг гүйцэтгэнэ үү
          </p>
        </CardContent>
        <SignInButton mode="modal">
          <Button variant="outline" className="w-full">
            Нэвтрэх
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="default" className="w-full mt-2">
            Бүртгүүлэх
          </Button>
        </SignUpButton>
      </Card>
    </div>
  );
};
