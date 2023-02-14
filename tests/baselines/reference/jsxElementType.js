//// [jsxElementType.tsx]
/// <reference path="/.lib/react16.d.ts" />
import * as React from "react";

type React18ReactFragment = ReadonlyArray<React18ReactNode>;
type React18ReactNode =
  | React.ReactElement<any>
  | string
  | number
  | React18ReactFragment
  | React.ReactPortal
  | boolean
  | null
  | undefined;

// // React.JSXElementConstructor but it now can return React nodes from function components.
type NewReactJSXElementConstructor<P> =
  | ((props: P) => React18ReactNode)
  | (new (props: P) => React.Component<P, any>);

declare global {
  namespace JSX {
    type ElementType = string | NewReactJSXElementConstructor<any>;
  }
}

let Component: NewReactJSXElementConstructor<{ title: string }>;

const RenderString = ({ title }: { title: string }) => title;
Component = RenderString;
<RenderString />;
<RenderString title="react" />;
<RenderString excessProp />;

const RenderNumber = ({ title }: { title: string }) => title.length;
Component = RenderNumber;
<RenderNumber />;
<RenderNumber title="react" />;
<RenderNumber excessProp />;

const RenderArray = ({ title }: { title: string }) => [title];
Component = RenderArray;
<RenderArray />;
<RenderArray title="react" />;
<RenderArray excessProp />;

// Future ReactNode can be Promises.
// But they should be rejected in React 18.0.
const RenderPromise = async ({ title }: { title: string }) => "react";
Component = RenderPromise;
<RenderPromise />;
<RenderPromise title="react" />;
<RenderPromise excessProp />;

// Highlighting various ecosystem compat issues
// react-native-gesture-handler
// https://github.com/software-mansion/react-native-gesture-handler/blob/79017e5e7cc2e82e6467851f870920ff836ee04f/src/components/GestureComponents.tsx#L139-L146
interface ReactNativeFlatListProps<Item> {}
function ReactNativeFlatList(
  props: {},
  ref: React.ForwardedRef<typeof ReactNativeFlatList>
) {
  return null;
}
<ReactNativeFlatList />;

//// [jsxElementType.js]
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="react16.d.ts" />
var React = require("react");
var Component;
var RenderString = function (_a) {
    var title = _a.title;
    return title;
};
Component = RenderString;
React.createElement(RenderString, null);
React.createElement(RenderString, { title: "react" });
React.createElement(RenderString, { excessProp: true });
var RenderNumber = function (_a) {
    var title = _a.title;
    return title.length;
};
Component = RenderNumber;
React.createElement(RenderNumber, null);
React.createElement(RenderNumber, { title: "react" });
React.createElement(RenderNumber, { excessProp: true });
var RenderArray = function (_a) {
    var title = _a.title;
    return [title];
};
Component = RenderArray;
React.createElement(RenderArray, null);
React.createElement(RenderArray, { title: "react" });
React.createElement(RenderArray, { excessProp: true });
// Future ReactNode can be Promises.
// But they should be rejected in React 18.0.
var RenderPromise = function (_a) {
    var title = _a.title;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        return [2 /*return*/, "react"];
    }); });
};
Component = RenderPromise;
React.createElement(RenderPromise, null);
React.createElement(RenderPromise, { title: "react" });
React.createElement(RenderPromise, { excessProp: true });
function ReactNativeFlatList(props, ref) {
    return null;
}
React.createElement(ReactNativeFlatList, null);
