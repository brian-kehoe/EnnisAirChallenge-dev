import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web';
import { MessageChannel, MessagePort } from 'worker_threads';

// Ensure encoding globals exist before importing undici (it relies on TextDecoder).
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
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

// Ensure performance exists and has markResourceTiming for undici timing hooks.
if (!globalThis.performance) {
  globalThis.performance = require('perf_hooks').performance;
}
if (!(globalThis.performance as any).markResourceTiming) {
  (globalThis.performance as any).markResourceTiming = () => {};
}

// Polyfill timers with unref support for undici compatibility
const timers = require('node:timers');
global.setTimeout = timers.setTimeout;
global.setInterval = timers.setInterval;
global.setImmediate = timers.setImmediate;
global.clearTimeout = timers.clearTimeout;
global.clearInterval = timers.clearInterval;
global.clearImmediate = timers.clearImmediate;

// Use undici's fetch implementation (includes Request/Response with static helpers).
const { fetch, Headers, Request, Response, FormData, File } = require('undici');
global.fetch = fetch as unknown as typeof global.fetch;
global.Headers = Headers as unknown as typeof global.Headers;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;
global.FormData = FormData as unknown as typeof global.FormData;
(global as any).File = File;
