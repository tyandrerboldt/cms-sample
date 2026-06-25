import { revalidatePath } from "next/cache";

async function revalidatePage(path: string) {
  await revalidatePath(path, "page");
}

export async function revalidateHome() {
  await revalidatePage("/");
}

export async function revalidatePackage({
  packageTypeSlug,
  packageSlug,
}: {
  packageTypeSlug: string;
  packageSlug: string;
}) {
  await revalidateHome();
  await revalidatePage("/pacotes");
  await revalidatePage(`/pacotes/${packageTypeSlug}`);
  await revalidatePage(`/pacotes/${packageTypeSlug}/${packageSlug}`);
}

export async function revalidatePackageType(typeSlug: string) {
  await revalidatePage("/pacotes");
  await revalidatePage(`/pacotes/${typeSlug}`);
}

export async function revalidateArticle({
  categorySlug,
  articleSlug,
}: {
  categorySlug: string;
  articleSlug: string;
}) {
  await revalidatePage("/blog");
  await revalidatePage(`/blog/${categorySlug}`);
  await revalidatePage(`/blog/${categorySlug}/${articleSlug}`);
}

export async function revalidateArticleCategory(categorySlug: string) {
  await revalidatePage("/blog");
  await revalidatePage(`/blog/${categorySlug}`);
}

export async function revalidateSettings() {
  await revalidatePage("/");
  await revalidatePage("/quem-somos");
  await revalidatePath("/", "layout");
}
