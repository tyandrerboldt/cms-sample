import { getPageSchemas } from "@/app/(public)/actions";
import { headers } from "next/headers";
import Script from "next/script";

export async function JsonLdSchema() {
  const headersList = headers();

  const domain = headersList.get("host") || "";
  const fullUrl = headersList.get("referer") || "";

  console.log("domain", domain);
  console.log("fullUrl", fullUrl);
  
  
  const pathname = fullUrl.split("//")[1].replace(domain, "");
  console.log("pathname", pathname);

  const schemas = await getPageSchemas(pathname);

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
