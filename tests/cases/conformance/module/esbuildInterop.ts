// @module: esnext
// @moduleResolution: bundler
// @moduleFormatInterop: bundler, bundlernode
// @noEmit: true
// @noTypesAndSymbols: true

// @Filename: /node_modules/dep/package.json
{
    "name": "dep",
    "version": "1.0.0",
    "main": "index.js"
}

// @Filename: /node_modules/dep/index.d.ts
declare const _default: string;
export default _default;

// @Filename: /package.json
{
  "type": "module"
}

// @Filename: /index.ts
import dep from "dep";
dep.toLowerCase(); // Error in bundlernode
dep.default.toLowerCase(); // Error in bundler
