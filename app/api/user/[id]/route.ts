import { getSessionUser } from "@/components/get-session-user";
import db from "@/lib/db";
import { insertUrls } from "@/lib/insert-urls";
import { profileSchema } from "@/lib/profile-schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionUser();
  const userId = params.id;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    const userId = params.id;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session?.id || userId !== session?.id) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const body = await req.json();

    const payload = profileSchema.parse(body);

    await db.user.update({
      where: {
        id: session.id,
      },
      data: {
        image: payload.image || null,
        username: payload.username,
        name: payload.name,
        bio: payload.bio,
        location: payload.location,
        cover: payload.cover || null,
      },
    });

    //if urls contains github profile and twitter profile, remove them from user and add them to userWebsite
    const githubUrl = payload.urls?.find((url: any) =>
      url.value.includes("github.com")
    );
    const twitterUrl = payload.urls?.find((url: any) =>
      url.value.includes("twitter.com")
    );
    if (githubUrl) {
      await db.user.update({
        where: {
          id: session.id,
        },
        data: {
          githubprofile: null,
        },
      });
    }

    if (twitterUrl) {
      await db.user.update({
        where: {
          id: session.id,
        },
        data: {
          twitterProfile: null,
        },
      });
    }

    //delete all urls connected to user
    await db.userWebsite.deleteMany({
      where: {
        userId: session.id,
      },
    });

    await insertUrls({ urls: payload.urls, userId: session.id });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
