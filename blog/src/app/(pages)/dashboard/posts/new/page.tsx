import { NewPostRedirect } from "@/src/app/components/pages/Dashboard/NewPostPage/NewPostRedirect";
import { db } from "@/src/db";
import { posts, users } from "@/src/db/schemas";
import { getSession } from "@/src/lib/auth/next-auth";
import { checkPermission } from "@/src/lib/auth/check-permission";
import { PostSelect } from "@/src/types";
import { IdGenerator } from "@/src/utils";
import { eq } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | New Post",
};
export default async function DashboardNewPostPage() {
  const shortId = IdGenerator.bigIntId().substring(6, 12);
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      throw new Error("No user session found");
    }

    const newPost = {
      title: "Untitled post",
      slug: "untitled-" + shortId,
      author_id: session?.user?.id as string,
    };

    const createdPost = (await checkPermission(
      { requiredPermission: "posts:create" },
      async () => {
        const [insertResponse] = await db
          .insert(posts)
          .values(newPost)
          .onDuplicateKeyUpdate({
            set: {
              slug: newPost.slug,
              updated_at: new Date(),
            },
          })
          .$returningId();
        return await db.query.posts.findFirst({
          where: eq(posts.id, insertResponse.id),
        });
      },
      true
    )) as PostSelect;

    if (!createdPost) {
      return <div>Failed to create post</div>;
    }

    return <NewPostRedirect postId={createdPost?.post_id as string} />;
  } catch (error) {
    console.error("Error creating post:", error);
    return <div>Failed to create post</div>;
  }
}
