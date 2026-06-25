import { spawn } from "child_process";
import { appendFileSync, openSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
const REBUILD_SCRIPT_PATH =
  process.env.REBUILD_SCRIPT_PATH ?? "/root/project/scripts/rebuild-site.sh";
const REBUILD_LOG_FILE =
  process.env.REBUILD_LOG_FILE ?? "/var/log/pescaemordomia-rebuild.log";

export async function POST(req: NextRequest) {
  const { key } = await req.json();

  if (key !== SECRET_KEY) {
    return NextResponse.json(
      { message: "Acesso não autorizado" },
      { status: 401 }
    );
  }

  try {
    const logFd = openSync(REBUILD_LOG_FILE, "a");
    appendFileSync(
      logFd,
      `\n[${new Date().toISOString()}] Build acionada via API\n`
    );

    const child = spawn("bash", [REBUILD_SCRIPT_PATH], {
      detached: true,
      stdio: ["ignore", logFd, logFd],
      env: process.env,
    });

    child.unref();

    return NextResponse.json(
      { message: "Build iniciada. Aguarde alguns minutos para conclusão." },
      { status: 202 }
    );
  } catch (error) {
    console.error("Erro ao iniciar a build:", error);
    return NextResponse.json(
      { message: "Falha ao iniciar a build", error: String(error) },
      { status: 500 }
    );
  }
}
