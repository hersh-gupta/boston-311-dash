// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Boston 311 Dashboard",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: `<div>GitHub</div>`,
  head: `<link rel="icon" type="image/vnd.microsoft.icon" href="https://raw.githubusercontent.com/hersh-gupta/boston-311-dash/main/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Explore Boston's 311 data">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Boston 311 Dashboard">
  <meta property="og:description" content="Explore Boston's 311 data">
`,
  footer: `Built by <a href="https://github.com/hersh-gupta">Hersh Gupta</a> using the <a href="https://observablehq.com/">Observable Framework</a>.`, // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
};
