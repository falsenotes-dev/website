import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FalseNotes",
    short_name: "FalseNotes",
    description:
      "🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    start_url: "/",
    icons: [
     {
      src: "/apple-192x192.png",
      sizes: "192x192",
      type: "image/png",
     }
    ],
  };
}
