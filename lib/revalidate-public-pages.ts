import { revalidatePath } from "next/cache";

async function revalidatePageAndLayout(path: string) {
  try {
    await revalidatePath(path, "page");
    await revalidatePath(path, "layout");
  } catch (error) {
    console.error(`[revalidate] falha ao revalidar ${path}:`, error);
    throw error;
  }
}

export async function revalidateHome() {
  await revalidatePageAndLayout("/");
}

export async function revalidatePackage({
  packageTypeSlug,
  packageSlug,
}: {
  packageTypeSlug: string;
  packageSlug: string;
}) {
  const detailPath = `/pacotes/${packageTypeSlug}/${packageSlug}`;

  try {
    await revalidateHome();
    await revalidatePageAndLayout("/pacotes");
    await revalidatePageAndLayout(`/pacotes/${packageTypeSlug}`);
    await revalidatePageAndLayout(detailPath);
    console.info(`[revalidate] pacote revalidado: ${detailPath}`);
  } catch (error) {
    console.error(`[revalidate] falha ao revalidar pacote ${detailPath}:`, error);
    throw error;
  }
}

export async function revalidatePackageType(typeSlug: string) {
  try {
    await revalidatePageAndLayout("/pacotes");
    await revalidatePageAndLayout(`/pacotes/${typeSlug}`);
    console.info(`[revalidate] tipo de pacote revalidado: /pacotes/${typeSlug}`);
  } catch (error) {
    console.error(`[revalidate] falha ao revalidar tipo /pacotes/${typeSlug}:`, error);
    throw error;
  }
}

export async function revalidateArticle({
  categorySlug,
  articleSlug,
}: {
  categorySlug: string;
  articleSlug: string;
}) {
  const detailPath = `/blog/${categorySlug}/${articleSlug}`;

  try {
    await revalidatePageAndLayout("/blog");
    await revalidatePageAndLayout(`/blog/${categorySlug}`);
    await revalidatePageAndLayout(detailPath);
    console.info(`[revalidate] artigo revalidado: ${detailPath}`);
  } catch (error) {
    console.error(`[revalidate] falha ao revalidar artigo ${detailPath}:`, error);
    throw error;
  }
}

export async function revalidateArticleCategory(categorySlug: string) {
  try {
    await revalidatePageAndLayout("/blog");
    await revalidatePageAndLayout(`/blog/${categorySlug}`);
    console.info(`[revalidate] categoria revalidada: /blog/${categorySlug}`);
  } catch (error) {
    console.error(
      `[revalidate] falha ao revalidar categoria /blog/${categorySlug}:`,
      error
    );
    throw error;
  }
}

export async function revalidateSettings() {
  try {
    await revalidatePageAndLayout("/");
    await revalidatePageAndLayout("/quem-somos");
    console.info("[revalidate] settings revalidadas");
  } catch (error) {
    console.error("[revalidate] falha ao revalidar settings:", error);
    throw error;
  }
}
