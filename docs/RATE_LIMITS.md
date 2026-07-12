# Gemini Rate-Limit Handling

The dashboard shows `429 TooManyRequests` errors. This means a project-level limit was exceeded; it can be requests per minute, input tokens per minute, requests per day, or a spend limit. It is not a JSON-prompting error.

## What the application now does

- Uses `gemini-3-flash-preview` (Gemini 3 Flash) by default.
- Retries only temporary errors: `429`, request timeout, and selected `5xx` responses.
- Waits before each retry using exponential backoff plus random jitter: approximately 2s, 4s, 8s, then 16s.
- Stops after four total attempts and presents a safe user-facing error.
- Does not retry invalid keys, bad requests, or permission failures.

## What you must check in AI Studio

1. Open the project’s **Rate Limit** tab and confirm the API key belongs to this project. Usage reporting may be delayed.
2. Check RPM, TPM, and RPD for `gemini-3-flash-preview`; exceeding any one causes a 429.
3. For a production workload, enable billing or request a rate-limit increase. Lower prompt length and output tokens if TPM is the limit.

For batches of resumes, queue work and process at a controlled rate; do not send parallel requests without a concurrency/rate limiter.

## Project access errors

An `HTTP 403` with **"Your project has been denied access"** is different from a rate limit. No code retry or model change can resolve it. Create/use an approved Google AI Studio project and API key, or contact Google AI Studio support for that project. Once you have an approved key, keep `MODEL_NAME=gemini-3-flash-preview` in `.env`.
