import { getPageSchemas } from "@/app/(public)/actions";
import { headers } from "next/headers";
import Script from "next/script";

export async function JsonLdSchema() {
  const headersList = headers();
  const pathname = headersList.get('next-url') || ""
  const schemas = await getPageSchemas(pathname);

  console.log("pathname", pathname);

  return (
    <>
      {schemas?.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
