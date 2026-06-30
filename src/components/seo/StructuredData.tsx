export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sithija Kalhara",
    alternateName: "Mr. Flexy",
    url: "https://sithijakalhara.com",
    jobTitle: [
      "Full-Stack Developer",
      "AI Data Analyst",
      "Gaming Content Creator",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Eyerone",
    },
    sameAs: [
      "https://github.com/Sithija-Kalhara",
      "https://www.linkedin.com/in/sithija-kalhara/",
      "https://www.youtube.com/@mrflexy1",
      "https://www.facebook.com/sithijakalhara0/",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "Three.js",
      "TypeScript",
      "Artificial Intelligence",
      "Game Streaming",
    ],
    email: "mailto:sithijakalhara2@gmail.com",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sithija Kalhara — Portfolio",
    url: "https://sithijakalhara.com",
    author: {
      "@type": "Person",
      name: "Sithija Kalhara",
    },
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
