This is a React + Vite + TypeScript single-page web app (chat client for Backend-Chat). It was migrated from Expo/React Native; the last Expo version is commit `71e30cf`.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server on http://localhost:8082
npm run build        # typecheck + production build into dist/
npm run typecheck    # tsc -b
npm run lint         # eslint
```

Run lint and typecheck before declaring any task done.

## Structure

- `src/router.tsx` — all routes (React Router). Guards in `src/layouts/AuthGuards.tsx`, bottom tab bar in `src/layouts/TabsLayout.tsx`.
- `src/pages/` — one component per route. Non-route code lives in `src/components`, `src/api`, `src/socket`, `src/utils`.
- `src/api/client.ts` — fetch wrapper: adds access token, refreshes on 401, sends cookies (`credentials: "include"`).
- `src/socket/` — everything socket.io, import from `@/socket`:
  - `events.ts` event names + payload types (`ServerToClientEvents`, `ClientToServerEvents`, `AppSocket`)
  - `client.ts` single shared connection (`connectSocket`, `disconnectSocket`, `getSocket`, `useSocket`)
  - `online.ts` shared online-users store + `useOnlineUsers`
  - `hooks.ts` `useSocketEvent(event, handler)`, `useSocketConnect(handler)` (runs on connect/reconnect) + per-event hooks (`useNewMessage`, `useTyping`, `useMessageSeen`, `useConversationRead`, `useMessageRecalled`, `useNotification`, `useBlockChanged`)
  - `emit.ts` client -> server events (`emitTyping`)
  - Don't call `socket.on/off` in components; use the hooks (they subscribe/unsubscribe and always see the latest state).
- Styling: Tailwind CSS v3 (`tailwind.config.js`), icons via `<Icon name="..." />` (Material Icons font), toasts via `sonner`.
- Env: `VITE_API_URL`, `VITE_SOCKET_URL` in `.env` (see `.env.example`).
