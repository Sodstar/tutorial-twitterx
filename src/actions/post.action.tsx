"use server";
import prisma from "@/lib/prisma";
import { getDBUserID } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
  try {
    const userId = await getDBUserID();
    // if (!userId) return {success:false, error:"User not found"};
    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl, // directly write image
        authorId: userId,
      },
    });

    revalidatePath("/"); //purge the cache for the home page
    return { success: true, post };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in getPosts", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function toggleLike(postId: string) {
  if (!postId) return;
  try {
    const userId = await getDBUserID();
    if (!userId) return;
    const existLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            postId,
            userId,
          },
        }),
        ...(post.authorId !== userId //true утга буцаах үед transaction массивт оруулна
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
      revalidatePath("/")
      return {success:true}
    }
  } catch (error) {
    console.error(error);
    return {success:false,error:"Failed to toggle like"}
  }
}

export async function createComment(postId: string, content: string) {
    try {
      const userId = await getDBUserID();
  
      if (!userId) return;
      if (!content) throw new Error("Content is required");
  
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      });
  
      if (!post) throw new Error("Post not found");
  
      // Create comment and notification in a transaction
      const [comment] = await prisma.$transaction(async (tx) => {
        // Create comment first
        const newComment = await tx.comment.create({
          data: {
            content,
            authorId: userId,
            postId,
          },
        });
  
        // Create notification if commenting on someone else's post
        if (post.authorId !== userId) {
          await tx.notification.create({
            data: {
              type: "COMMENT",
              userId: post.authorId,
              creatorId: userId,
              postId,
              commentId: newComment.id,
            },
          });
        }
  
        return [newComment];
      });
  
      revalidatePath(`/`);
      return { success: true, comment };
    } catch (error) {
      console.error("Failed to create comment:", error);
      return { success: false, error: "Failed to create comment" };
    }
  }
  
  export async function deletePost(postId: string) {
    try {
      const userId = await getDBUserID();
  
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      });
  
      if (!post) throw new Error("Post not found");
      if (post.authorId !== userId) throw new Error("Unauthorized - no delete permission");
  
      await prisma.post.delete({
        where: { id: postId },
      });
  
      revalidatePath("/"); // purge the cache
      return { success: true };
    } catch (error) {
      console.error("Failed to delete post:", error);
      return { success: false, error: "Failed to delete post" };
    }
  }
