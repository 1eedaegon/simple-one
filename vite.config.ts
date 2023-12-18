import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { glob } from "glob";
import alias from "@rollup/plugin-alias";

// https://vitejs.dev/config/
export default defineConfig({
  // dts 자동생성 및 css import문 자동 주입
  plugins: [dts({ include: ["lib"] }), libInjectCss()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./lib", import.meta.url)),
      },
    ],
    // alias: {
    //   "@": resolve(__dirname, "./lib"), // import {} from @/[something]
    //   "@/components": resolve(__dirname, "./lib/components"),
    // },
  },
  build: {
    copyPublicDir: false, // public asset 불러오기 금지
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      // If we want to publish standalone components we don't externalize lit,
      // if you are going to use lit in your own project, you can make it a dep instead.
      // external: /^lit/, <-- comment this line
      input: Object.fromEntries(
        // lib의 ts|x파일은 가져오지만 stories는 가져오면 안된다.
        glob
          .sync("lib/**/*.{ts,tsx}", { ignore: "lib/**/*.stories.{ts,tsx}" })
          .map((file) => [
            // 하위 디렉토리에 있는 모듈 전부 lib으로 끌어옴
            relative("lib", file.slice(0, file.length - extname(file).length)),
            // The absolute path to the entry file
            // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
            // 상대경로를 Node.js의 URL로 변경한다.
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
