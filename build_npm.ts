import { build, emptyDir } from "jsr:@deno/dnt";

await emptyDir("./build");

await build({
  entryPoints: ["./firestore.ts"],
  outDir: "./build",
  test: false,
  shims: {},
  package: {
    // package.json properties
    name: "@tkashiro/shopify-app-session-storage-firestore",
    version: Deno.args[0],
    description: "Shopify App Session Storage for Firestore",
    license: "MIT",
    author: "Tomoyuki Kashiro",
    repository: {
      type: "git",
      url:
        "https://github.com/tomoyukikashiro/shopify-app-session-storage-firestore",
    },
    bugs: {
      url:
        "https://github.com/tomoyukikashiro/shopify-app-session-storage-firestore/issues",
    },
    keywords: [
      "shopify",
      "node",
      "app",
      "graphql",
      "rest",
      "webhook",
      "Admin API",
      "Storefront API",
      "session storage",
      "firestore",
      "firebase",
    ],
    peerDependencies: {
      "@shopify/shopify-api": "^11.6.1",
      "@shopify/shopify-app-session-storage": "^3.0.9",
      "firebase-admin": "^13.0.1",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "build/LICENSE");
    Deno.copyFileSync("README.md", "build/README.md");
  },
});
