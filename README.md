# Signage Desk — Innovation Center

A control desk for the LED wall and the Future X vertical screens. You upload finished
artwork or video, see it exactly as the wall will show it, drop a countdown or QR code on
top, and publish. Nothing here designs graphics — it runs screens.

Two files matter:

| File | What it is |
|---|---|
| `index.html` | The whole application — desk and display pages. No build step, no internet, no dependencies. |
| `server.js` | Optional sync server (Node 18+, zero dependencies). Needed to drive screens on other devices. |

---

## Running it

**For real screens — use the server.**

```bash
node server.js            # http://localhost:8080
PORT=9000 node server.js  # different port
```

It prints the control-desk address and the display links, including the machine's LAN
address. Published content, uploaded media and live commands all flow through it, so any
player on the network can open a display link. State lives in `data/state.json`, media in
`data/media/` — back that folder up and you have backed up the whole system.

**Just looking around?** Open `index.html` directly in a browser. Everything works, but
content stays inside that one browser, and Chrome blocks local file storage for `file://`
pages, so uploaded media may not play. Firefox handles it. For anything beyond a look,
run the server.

---

## The screens

| Screen | Physical size | Ratio | Link |
|---|---|---|---|
| Main LED wall | 10 × 5 m | 2:1 landscape | `/display/main` |
| InnovateX | 0.60 × 2.70 m | 2:9 portrait | `/display/innovatex` |

Add more from **Screens → Add screen**; enter the real metres and the platform derives the
ratio and the design space. Sizes are editable later without losing content — widget
positions are stored as percentages, so they follow the frame.

A display page is only the content: no menus, no cursor, no margins. Open it on the
player, press F11 (or double-click the page) for fullscreen, and leave it. It requests a
screen wake lock, reconnects on its own, and if the network drops it keeps showing the
last content it received rather than going black.

---

## The workflow

**Pick screen → upload → put on screen → widgets → preview → publish.**

*Media library* — drag in anything the browser can play: PNG, JPG, WebP, AVIF, SVG,
animated GIF and animated WebP, MP4, WebM, MOV and the rest. Transparent PNGs stay
transparent, animation keeps animating. An unfamiliar container is still accepted, with a
note that some browsers may not decode it. Rename, preview, replace (keeps the file's
place in every playlist) or delete. Up to 2 GB per file with the server running, 300 MB
without.

*Playlist* — each item gets its own seconds; videos always play in full. Tick **Keep on
screen** and that item stays up until you change it — nothing rotates past it, nothing
fades. A screen holding a single image or video does this on its own. Drag the handle
to reorder. Transitions are cut, fade or crossfade, with an adjustable length — 600–900 ms
crossfade reads best on a wall this size. Loop and shuffle are in the transport bar.

Four ways a picture can sit on the screen:

- **Fit** — whole design visible, bars where the ratio doesn't match. Nothing is ever cut.
- **Fill** — covers the screen, edges may be cropped.
- **Stretch** — forced to the frame, distorts.
- **Original size** — pixel-for-pixel, centred.

*Widgets* sit on top of the media: countdown, clock, date, text, QR code, logo. Drag them
in the preview, resize from the corners, or type exact X / Y / W / H percentages. The
nine-square control snaps a widget to a corner, edge or centre inside the safe area.

- Arrow keys nudge 0.5% · Shift+arrows 2%
- Ctrl/⌘+D duplicates · Delete removes
- Space plays or pauses · Ctrl/⌘+S saves the draft · Ctrl/⌘+Enter publishes

The countdown works two ways. **To a date** counts down to a moment — the opening, the
launch. **Timer** counts down a length you set, for a pitch slot or a workshop round.
Either one has Start, Pause and Reset in the panel, and those act on the wall the instant
you press them, without publishing. Pause freezes the numbers where they are; Start picks
up from exactly there.

The date widget does Hijri (Umm al-Qura) and Gregorian, in Arabic or English, separately
or together. The QR code is generated on the spot — no internet, no third-party service.

*Guides* sit under the preview: safe area (5% inset), centre lines, grid. They are never
part of what the screens show.

---

## Taking a screen somewhere else

**Screens → Export as a website** turns any screen into a single `.html` file that plays on
its own: no server, no storage, no connection. Put it on a web host, a USB stick, a kiosk
player, or inside an existing page. It always keeps the screen's proportions — in a wider
box it letterboxes and centres rather than stretching, so a 2:9 InnovateX layout stays 2:9
everywhere.

Two ways to pack it:

- **Everything in one file** — media is embedded. Nothing else is needed, works offline.
  The file grows with the media, so it suits stills and short clips.
- **Link media to this server** — a small file that pulls media from this server. Good for
  long videos, but the device has to reach the server.

After the download you get an embed snippet to paste into any page:

```html
<iframe src="innovatex-display.html"
  style="width:100%; aspect-ratio:0.6/2.7; border:0; display:block"
  allow="autoplay; fullscreen"></iframe>
```

The exported file is a snapshot of what was published. Export again after you change
things.

## Scheduling

Blocks are checked top to bottom and the first match wins; with no match, the playlist
selected in the sidebar plays. All times are Riyadh wall-clock (changeable in Settings),
and "Sun–Thu" / "Fri–Sat" follow the Saudi working week.

```
Morning content    08:00 – 12:00   every day
Event content      12:00 – 17:00   chosen days
Evening content    17:00 – 22:00   Sun–Thu
```

A block spanning midnight (22:00 – 02:00) works as written.

---

## During an event

Changes reach the screens the moment you press **Publish** — no refreshing anything. The
transport bar under the preview drives the live screen too: play, pause, previous, next,
blackout, and a remote reload if a player ever needs one. The dot beside each screen name
is a real heartbeat from that player: green means it reported in within the last few
seconds.

**Publish while editing** (Settings) pushes every change instantly, without pressing
Publish. Useful when someone is standing next to you asking for the countdown to move
left. Leave it off while preparing content.

**Draft and live are separate.** You can rebuild tomorrow's screen while today's keeps
playing; nothing moves until you publish. The Publish button carries a dot while the draft
differs from what is on air.

---

## Housekeeping

**Settings → Download backup** writes a JSON file with every screen, playlist, widget and
schedule. Restoring replaces everything. With the server running, `data/` is the live copy.

**Troubleshooting**

- *Screen shows Not connected* — the player isn't reporting. Check the display page is
  open and that it can reach the server address (not `localhost` from another machine).
- *Video doesn't start* — browsers only autoplay muted video, which is what the display
  page does. Signage audio is off by design.
- *Storage is full* — browser-local mode holds media in the browser. Run the server, or
  remove unused media.
- *Upgrading from an earlier copy* — the old `vertical-1` screen becomes `innovatex`, so
  update any bookmark on the player. An untouched second vertical screen is removed.
- *Fonts* — the platform uses fonts already on the player so it never waits on a network.
  Baked-in typography belongs in your uploaded artwork.
