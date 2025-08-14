import { Buffer } from "buffer";

declare global {
  // Extend global type definitions for TS
  var base64FromArrayBuffer: (arrayBuffer: ArrayBuffer) => string;
  var base64ToArrayBuffer: (base64: string) => ArrayBuffer;
}

// Ensure Buffer is available globally
global.Buffer = global.Buffer || Buffer;

// Polyfill for base64FromArrayBuffer
if (typeof global.base64FromArrayBuffer !== "function") {
  global.base64FromArrayBuffer = (arrayBuffer: ArrayBuffer): string => {
    return Buffer.from(arrayBuffer).toString("base64");
  };
}

// Polyfill for base64ToArrayBuffer
if (typeof global.base64ToArrayBuffer !== "function") {
  global.base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
  };
}

export {};
