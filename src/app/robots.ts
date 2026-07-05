import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.sithijakalhara.com/sitemap.xml",
    host: "https://www.sithijakalhara.com",
  };
}
