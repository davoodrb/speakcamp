import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), viteReact()],
  optimizeDeps: {
    include: ["@tanstack/react-form-start"],
  },
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
  },
});

export default config;
