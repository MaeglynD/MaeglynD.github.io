export const sandpackCfg = {
  theme: {
    colors: {
      surface1: "#ffffff",
      surface2: "#F3F3F3",
      surface3: "#f5f5f5",
      clickable: "#959da5",
      base: "#24292e",
      disabled: "#d1d4d8",
      hover: "#24292e",
      accent: "#24292e",
    },
    syntax: {
      keyword: "#d73a49",
      property: "#005cc5",
      plain: "#24292e",
      static: "#032f62",
      string: "#032f62",
      definition: "#6f42c1",
      punctuation: "#24292e",
      tag: "#22863a",
      comment: {
        color: "#6a737d",
        fontStyle: "normal",
      },
    },
    font: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
      size: "8px",
      lineHeight: "1.7",
    },
  },
  template: "vanilla",
  customSetup: {
    dependencies: {
      mathjs: "latest",
      "plotly.js-dist-min": "latest",
    },
  },
  options: {
    resizablePanels: false,
    autoReload: false,
    showTabs: false,
    editorHeight: 350,
  },
};

export const gruvboxColors = [
  "#262626",
  "#3a3a3a",
  "#4e4e4e",
  "#8a8a8a",
  "#949494",
  "#dab997",
  "#d5c4a1",
  "#ebdbb2",
  "#d75f5f",
  "#ff8700",
  "#ffaf00",
  "#afaf00",
  "#85ad85",
  "#83adad",
  "#d485ad",
  "#d65d0e",
];
