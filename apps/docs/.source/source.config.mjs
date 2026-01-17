// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";
var docs = defineDocs({
  dir: "content/docs"
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light"
          },
          keepBackground: false
        }
      ]
    ]
  }
});
export {
  source_config_default as default,
  docs
};
