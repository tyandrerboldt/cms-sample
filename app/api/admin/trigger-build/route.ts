import { spawn } from "child_process";
import { appendFileSync, readFileSync, existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
const REBUILD_SCRIPT_PATH =
  process.env.REBUILD_SCRIPT_PATH ?? "/root/project/scripts/rebuild-site.sh";
const REBUILD_LOG_FILE =
  process.env.REBUILD_LOG_FILE ?? "/var/log/pescaemordomia-rebuild.log";
const REBUILD_STATUS_FILE =
  process.env.REBUILD_STATUS_FILE ?? "/var/run/pescaemordomia-rebuild.status";
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

function buildCleanEnv(): Record<string, string> {
  const nvmBin = "/root/.nvm/versions/node/v22.11.0/bin";
  const basePath = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";

  return {
    PATH: `${nvmBin}:${basePath}`,
    HOME: process.env.HOME ?? "/root",
    USER: process.env.USER ?? "root",
    PROJECT_DIR: process.env.PROJECT_DIR ?? "/root/project",
    ENV_FILE: process.env.ENV_FILE ?? "/root/project/deploy/.env",
    REBUILD_STATUS_FILE: REBUILD_STATUS_FILE,
    LANG: process.env.LANG ?? "C.UTF-8",
  };
}

function readRebuildStatus(): {
  status: "idle" | "running" | "success" | "failed" | "unknown";
  message?: string;
} {
  if (!existsSync(REBUILD_STATUS_FILE)) {
    return { status: "idle" };
  }

  const raw = readFileSync(REBUILD_STATUS_FILE, "utf8").trim();
  const [status, timestamp, ...messageParts] = raw.split("|");
  const message = messageParts.join("|") || undefined;

  if (status === "running") {
    if (timestamp) {
      const startedAt = Date.parse(timestamp);
      if (!Number.isNaN(startedAt) && Date.now() - startedAt > POLL_TIMEOUT_MS) {
        return {
          status: "failed",
          message: "Rebuild excedeu o tempo limite",
        };
      }
    }
    return { status: "running" };
  }

  if (status === "success") {
    return { status: "success" };
  }

  if (status === "failed") {
    return { status: "failed", message };
  }

  return { status: "unknown" };
}

function spawnDetachedRebuild() {
  appendFileSync(
    REBUILD_LOG_FILE,
    `\n[${new Date().toISOString()}] Build acionada via API\n`
  );

  const child = spawn("bash", [REBUILD_SCRIPT_PATH], {
    detached: true,
    stdio: "ignore",
    env: buildCleanEnv() as NodeJS.ProcessEnv,
  });

  child.unref();
}

export async function GET() {
  const current = readRebuildStatus();
  return NextResponse.json(current);
}

export async function POST(req: NextRequest) {
  const { key } = await req.json();

  if (key !== SECRET_KEY) {
    return NextResponse.json(
      { message: "Acesso não autorizado" },
      { status: 401 }
    );
  }

  const current = readRebuildStatus();
  if (current.status === "running") {
    return NextResponse.json(
      { message: "Rebuild já em andamento.", status: "running" },
      { status: 409 }
    );
  }

  try {
    spawnDetachedRebuild();

    return NextResponse.json(
      {
        message: "Rebuild iniciado. Aguarde a conclusão.",
        status: "running",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Erro ao iniciar a build:", error);
    return NextResponse.json(
      {
        message: "Falha ao iniciar a build",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
