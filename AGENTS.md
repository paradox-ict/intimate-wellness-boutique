<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Order placement goes through the `placeOrder` server function, which calls the `place_order` database function (service role only) so pricing, stock decrement and order numbering happen atomically on the server; never trust client totals.
- `computeTotals` in `src/lib/format.ts` mirrors `place_order` pricing for display only; change both together.
- Customers have no accounts: order tracking matches order number + normalised phone in the `trackOrder` server function and returns only non-sensitive fields.
- Easypaisa receipts live in the private `payment-proofs` bucket, uploaded server-side; admins view them via signed URLs.
- Admin pages use the browser client with RLS (`has_role(auth.uid(),'admin')`); the first account ever created becomes admin via an `auth.users` trigger.
- Stock is a single count of applicators in `store_settings`; database triggers restore it on cancellation and log every status change to `order_events`.
- Storefront pages wrap content in `StoreShell`; admin pages live under `src/routes/_authenticated/admin*`.
