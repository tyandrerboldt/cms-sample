"use client";

import { getPageSchemas } from "@/app/(public)/actions";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

export function JsonLdSchema() {
  const pathname = usePathname();
  const [schemas, setSchemas] = useState<any[]>([]);

  const fetchSchemas = async () => {
    const data = await getPageSchemas(pathname);
    data && setSchemas(data);
  };

  useEffect(() => {
    fetchSchemas();
  }, []);

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
