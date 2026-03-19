# Logbit SDK

A lightweight logging SDK that batches log entries and sends them to your API. Supports structured logs, spans, metrics, and optional Workbit issue creation on errors.

## Setup

### Install

```bash
npm install @thedatablitz/logbit-sdk
```

### Registry

The package is published to GitHub Packages. If you use a private registry, ensure `.npmrc` is configured:

```
@thedatablitz:registry=https://npm.pkg.github.com
```

### Build from source

```bash
npm install
npm run build
```

Output is in `dist/` (ESM, UMD, and `.d.ts`).

---

## Initialization

Call `init()` once at application startup, before any logging. This sets context (service, env, release), configures the HTTP transport and batcher, and optionally wires up Workbit and process error handlers.

```ts
import { init } from "@thedatablitz/logbit-sdk";

init({
   service: "my-app",
   env: "development",
   release: "1.0.0",
   // Optional: override API URL and batching (see Configuration)
});
```

**Required before use:** You must call `init()` before calling any `logbit` methods; otherwise logs are dropped.

---

## Usage

### Logging

Use the `logbit` object to log. Each call **uploads** to your API (batched) and **logs to the console** (chalk) by default - no separate `console.log()` needed. All methods accept a `message` and an optional `payload` object.

```ts
import { logbit } from "@thedatablitz/logbit-sdk";

logbit.info("User signed in", { userId: "u-123" });
logbit.debug("Cache hit", { key: "session:abc" });
logbit.warn("Rate limit approaching", { remaining: 5 });
logbit.error("Payment failed", { code: 500, orderId: "ord-456" });
```

| Method            | Level    | Use case                          |
|-------------------|----------|-----------------------------------|
| `logbit.debug()`  | `debug`  | Detailed diagnostics              |
| `logbit.info()`   | `info`   | General events                     |
| `logbit.warn()`   | `warning`| Warnings, degraded behavior       |
| `logbit.error()`  | `error`  | Errors (triggers Workbit if set)  |

### Spans

Measure operation duration and get trace/span IDs attached to your context:

```ts
const span = logbit.startSpan("checkout", { attributes: { orderId: "ord-1" } });
// ... do work ...
span.end();
```

Spans are sent as span events in the same batch. Nested spans share a trace ID.

### Metrics

Emit counter metrics (batched like logs):

```ts
logbit.metric.counter("orders.completed");
logbit.metric.counter("bytes.sent", 1024, { protocol: "http" });
```

### Flush and shutdown

- **`flushNow()`** or **`logbit.flush()`** - Send any buffered events immediately (e.g. before process exit or page unload).
- **`logbit.close()`** - Flush, then tear down the transport and remove process error handlers. Call when shutting down the app.

The SDK also registers a `beforeExit` handler (Node) to flush automatically.

```ts
import { logbit, flushNow } from "@thedatablitz/logbit-sdk";

// On demand
flushNow();

// Or before graceful shutdown
logbit.close();
```

---

## Configuration

Pass configuration to `init()`. All fields except the API target are optional.

| Option             | Type     | Default                    | Description |
|--------------------|----------|----------------------------|-------------|
| `apiBaseUrl`       | `string` | `"http://localhost:3000"`   | Base URL of your log ingest API. |
| `endpoint`         | `string` | `"/ingest"`                | Path for the POST endpoint. |
| `service`          | `string` | -                          | Service name (included in context). |
| `env`              | `string` | -                          | Environment (e.g. `"production"`, `"staging"`). |
| `release`          | `string` | -                          | Release/version. |
| `flushIntervalMs`  | `number` | `2000`                     | Max milliseconds before flushing a partial batch. |
| `maxBatchSize`     | `number` | `100`                      | Max events per batch before flushing. |
| `workbit`          | `object` | -                          | Enable Workbit: create issues on logged errors. |
| `console`          | `boolean`| `true`                     | When `true`, log methods also pretty-print to the console (chalk). Set `false` to only upload. |

### Workbit integration

When `workbit` is set, each `logbit.error()` (and uncaught exceptions / unhandled rejections) can create an issue in Workbit (project `proj-2`).

```ts
init({
   service: "my-app",
   env: "production",
   workbit: {
      apiKey: process.env.WORKBIT_API_KEY!,
      baseUrl: "https://api.workbit.io", // optional
   },
});
```

### Console output (chalk)

By default, `logbit.info()`, `logbit.error()`, `logbit.debug()`, and `logbit.warn()` both **upload** to your API and **log** to the console with chalk-colored levels and timestamps, so you do not need a separate `console.log()`. Uncaught errors are also printed. Set `console: false` to only upload (e.g. in production).

```ts
init({ service: "my-app", env: "development" });
logbit.error("Payment failed", { orderId: "ord-1" });
// -> Uploaded to API and printed to terminal (e.g. red ERROR line)

// To only upload, no console output:
init({ service: "my-app", env: "production", console: false });
```

### Example: production config

```ts
init({
   service: "api-gateway",
   env: process.env.NODE_ENV ?? "development",
   release: process.env.APP_VERSION,
   apiBaseUrl: "https://logs.example.com",
   endpoint: "/v1/ingest",
   flushIntervalMs: 5000,
   maxBatchSize: 50,
   workbit: process.env.WORKBIT_API_KEY
      ? { apiKey: process.env.WORKBIT_API_KEY }
      : undefined,
});
```

---

## API summary

- **`init(config)`** - Initialize the SDK (required before logging).
- **`logbit.info(message, payload?)`** - Info-level log.
- **`logbit.debug(message, payload?)`** - Debug-level log.
- **`logbit.warn(message, payload?)`** - Warning-level log.
- **`logbit.error(message, payload?)`** - Error-level log.
- **`logbit.startSpan(name, options?)`** - Start a span; call `.end()` when done.
- **`logbit.metric.counter(name, value?, attributes?)`** - Increment a counter.
- **`logbit.flush()`** - Flush buffered events (async).
- **`logbit.close()`** - Flush and tear down the SDK.
- **`flushNow()`** - Convenience to trigger an immediate flush (fire-and-forget).

Logs, spans, and metrics are batched and sent via POST to `apiBaseUrl + endpoint`. Uncaught exceptions and unhandled rejections are automatically logged as errors and flushed; if Workbit is configured, they also create issues.
