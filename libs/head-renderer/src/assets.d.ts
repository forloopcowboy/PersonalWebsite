declare module '*.glsl?raw' {
  const source: string;
  export default source;
}

declare module '*.png' {
  const url: string;
  export default url;
}
