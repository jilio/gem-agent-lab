# Gem Agent Lab

Tiny Bun/TypeScript project for an end-to-end Gem MCP repair demo.

The baseline project is intentionally clean. The end-to-end demo starts after a
bug is introduced in a later commit: running the checkout demo will send that
runtime exception to Gem through the Sentry-compatible DSN. A repair agent should
subscribe to Gem MCP, pick up the new error group, inspect the fix packet, patch
the code, and verify the tests.

## Run

```sh
bun install
cp .env.example .env
GEM_DSN=https://9154b6a9a89647f8a5c02106b8f5d664@gem.unfazed.engineering/1 bun run demo:checkout
```

## Expected Agent Loop

Give the agent this repository and connect it to Gem MCP:

```json
{
  "mcpServers": {
    "gem": {
      "type": "streamableHttp",
      "url": "https://gem.unfazed.engineering/mcp",
      "headers": {
        "Authorization": "Bearer <GEM_API_KEY>"
      }
    }
  }
}
```

Ask the agent to:

1. Subscribe to `gem://projects/1/agent-queue`.
2. Run `bun install`, then `bun run demo:checkout`.
3. Use Gem MCP `get_fix_packet` for the new group.
4. Fix the bug in the smallest safe patch.
5. Verify with `bun test` and `bun run typecheck`.
6. Record the fix through Gem MCP `record_fix_attempt`.

If the MCP client does not support resource subscriptions yet, poll
`list_error_groups` with `status: "unresolved"` and then call `get_fix_packet`.
