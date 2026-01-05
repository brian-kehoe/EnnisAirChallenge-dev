import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web';
import { MessageChannel, MessagePort, MessageEvent } from 'worker_threads';

// Ensure encoding globals exist before importing undici (it relies on TextDecoder).
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
// @ts-expect-error TextDecoder may not be present on the global in some environments
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}
if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream as unknown as typeof global.ReadableStream;
}
if (!global.WritableStream) {
  global.WritableStream = WritableStream as unknown as typeof global.WritableStream;
}
if (!global.TransformStream) {
  global.TransformStream = TransformStream as unknown as typeof global.TransformStream;
}
if (!global.MessageChannel) {
  global.MessageChannel = MessageChannel as unknown as typeof global.MessageChannel;
}
if (!global.MessagePort) {
  global.MessagePort = MessagePort as unknown as typeof global.MessagePort;
}
// @ts-expect-error MessageEvent may not be present on the global in some environments
if (!global.MessageEvent) {
  global.MessageEvent = MessageEvent as unknown as typeof global.MessageEvent;
}

// Ensure performance exists and has markResourceTiming for undici timing hooks.
if (!globalThis.performance) {
  globalThis.performance = require('perf_hooks').performance;
}
// @ts-expect-error markResourceTiming is optional on the Performance interface
if (!(globalThis.performance as any).markResourceTiming) {
  (globalThis.performance as any).markResourceTiming = () => {};
}

// Use undici's fetch implementation (includes Request/Response with static helpers).
const { fetch, Headers, Request, Response, FormData, File, setGlobalDispatcher, Agent } =
  require('undici');
setGlobalDispatcher(new Agent({ keepAliveTimeout: 0, keepAliveMaxTimeout: 0 }));
global.fetch = fetch as unknown as typeof global.fetch;
global.Headers = Headers as unknown as typeof global.Headers;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;
global.FormData = FormData as unknown as typeof global.FormData;
// @ts-expect-error File may not be present on the global in some environments
global.File = File;
