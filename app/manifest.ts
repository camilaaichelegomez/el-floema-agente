import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "El Floema Lab",
    short_name: "Floema Lab",
    description: "Inventario, fórmulas y asistente de formulación de El Floema",
    start_url: "/lab",
    scope: "/lab",
    display: "standalone",
    background_color: "#0d1a0f",
    theme_color: "#0d1a0f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
