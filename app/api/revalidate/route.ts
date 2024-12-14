import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { secret, route } = await request.json();

    console.log(secret);
    console.log(route);



    if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Invalid access" },
        { status: 401 }
      );
    }

    await revalidatePath(`${route}`);
    return NextResponse.json(
      { message: "Revalidated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error revalidation" },
      { status: 500 }
    );
  }
}