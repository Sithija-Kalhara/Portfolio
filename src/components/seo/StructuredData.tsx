// JSON-LD structured data — tells Google exactly who "Sithija Kalhara" is.
// This is the strongest signal for a named Knowledge Panel / rich result.

export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.sithijakalhara.com/#person",
    name: "Sithija Kalhara",
    alternateName: ["Mr. Flexy", "Sithija K"],
    url: "https://www.sithijakalhara.com",
    image: {
      "@type": "ImageObject",
      url: "https://www.sithijakalhara.com/opengraph-image",
      width: 1200,
      height: 630,
    },
    description:
      "Sithija Kalhara is a Full-Stack Developer, Founder of Eyerone, AI Data Analyst, and Gaming Content Creator based in Sri Lanka. He specialises in React, Next.js, Node.js, Three.js, and scalable web platforms. Known online as Mr. Flexy, he creates gaming content on YouTube.",
    jobTitle: [
      "Full-Stack Developer",
      "AI Data Analyst",
      "Gaming Content Creator",
      "Founder",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Eyerone",
      url: "https://www.sithijakalhara.com",
      founder: "Sithija Kalhara",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "Three.js",
      "TypeScript",
      "MongoDB",
      "Docker",
      "Artificial Intelligence",
      "Full-Stack Web Development",
      "Game Streaming",
      "3D Web Applications",
    ],
    nationality: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    sameAs: [
      "https://github.com/Sithija-Kalhara",
      "https://www.linkedin.com/in/sithija-kalhara/",
      "https://www.youtube.com/@mrflexy1",
      "https://www.facebook.com/sithijakalhara0/",
      "https://www.sithijakalhara.com",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.sithijakalhara.com/#website",
    name: "Sithija Kalhara",
    url: "https://www.sithijakalhara.com",
    description:
      "Official portfolio of Sithija Kalhara — Full-Stack Developer, AI Data Analyst, Founder of Eyerone, and Gaming Content Creator (Mr. Flexy).",
    author: {
      "@id": "https://www.sithijakalhara.com/#person",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.sithijakalhara.com/?s={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
