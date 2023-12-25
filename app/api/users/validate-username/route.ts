import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/components/get-session-user";

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = session;
    if (!username) {
      return NextResponse.json(
        { message: "username is required" },
        { status: 400 }
      );
    }
    const isUsernameValid = await db.user.findFirst({
      where: {
        username: username,
        id: { not: id },
      },
      select: {
        username: true,
        id: true,
      },
    });

    if (isUsernameValid && isUsernameValid.id !== id) {
      return NextResponse.json({ isValid: false }, { status: 200 });
    } else {
      return NextResponse.json({ isValid: true }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
