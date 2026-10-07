# Vic Cafe · Today’s Specials

Phone-friendly GitHub Pages hub for **Vic Cafe** (Victoria Cafe) daily specials.

**Live:** https://mrmurray9.github.io/vic-cafe-specials/

## How daily updates work

No daily republish is needed while the current month’s menu is in force. The page reads `menu.json` and picks soup / savoury / sweet / muffin for **today’s weekday in America/Edmonton**. Standing sandwiches, salad, and feature always show.

On Saturday or Sunday the page previews **Monday’s** specials and notes that the café opens Monday.

## Updating for a new month

1. Open `menu.json`.
2. Change `"month"` (and `"year"` if needed).
3. Replace the Mon–Fri values under `"weekdays"` to match the new board photo.
4. Edit `"standing"` only if sandwiches / salad / feature change.
5. Commit and push to `main`. GitHub Pages updates in a minute or two.

Optional: bump the `?v=YYYYMMDD` query on CSS/JS/JSON in `index.html` / `script.js` if you want a hard cache refresh.

## Local preview

```bash
cd /workspace/vic-cafe-specials
python3 -m http.server 8080
# open http://localhost:8080
```

## Files

| File | Role |
|------|------|
| `index.html` | Layout |
| `menu.json` | Single source of truth |
| `styles.css` | Warm café styles (phone-first) |
| `script.js` | Timezone + weekday selection |
