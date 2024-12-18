import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;

// Função principal para o endpoint
export async function POST(req: NextRequest) {
  const { key } = await req.json()

  // Verifica a chave secreta para segurança
  if (key !== SECRET_KEY) {
    return NextResponse.json(
      { message: "Acesso não autorizado" },
      { status: 401 }
    );
  }

  // Executa o comando de build no servidor
  try {
    await new Promise((resolve, reject) => {
      exec("yarn deploy", (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao executar a build: ${stderr}`);
          reject(stderr);
        }
        console.log(`Build concluída: ${stdout}`);
        resolve(stdout);
      });
    });

    return NextResponse.json(
      { message: "Build acionada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Falha ao executar a build", error },
      { status: 500 }
    );
  }
}