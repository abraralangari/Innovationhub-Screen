# Signage Desk — Innovation Center

Built on the Digital Government Authority visual identity.

A control desk for the LED wall and the InnovateX vertical screen. You upload finished
artwork or video, see it exactly as the wall will show it, drop a countdown or QR code on
top, and publish. Nothing here designs graphics — it runs screens.

Two files matter:

| File | What it is |
|---|---|
| `index.html` | The whole application — desk and display pages. No build step, no internet, no dependencies. |
| `server.js` | Optional sync server (Node 18+, zero dependencies). Needed to drive screens on other devices. |

---

## The identity

The desk, the widgets and the exported screens all sit on the DGA identity from the brand
guideline:

| | |
|---|---|
| Primary | `#1cc182` green · `#1d9af2` blue · `#2a206a` indigo · `#852cd0` purple, each with its four tints |
| Secondary | `#c40000` `#ff6700` `#ffa300` `#ffe257` `#00abaf` `#5d6167` `#594aff` |
| Gradient | green → blue → purple, the logo's own sweep |
| Type | Diodrum Arabic, with Calvino for English display |
| Shape | the identity's swept corner, used on the stage, cards and dialogs |

**Brand kit** in the sidebar holds it together:

- **Desk theme** — Light for daylight offices, Night for a dim control room. Both are the
  same palette; only the surfaces change.
- **Logo** — the official lockups ship with the app: the colour version for light
  backgrounds and the reversed one for dark. They sit at the top left of the desk (in Arabic
  too) and the logo widget offers them with one click. Upload your own master files any time,
  or press **Restore the Authority logo** to come back to the supplied ones.
- **Fonts** — every widget starts in Diodrum Arabic, and the font picker lists each face by
  its real name with a live sample and whether its file is actually installed. Diodrum Arabic ships with the platform in its Regular, Medium and Semibold
  weights, converted to WOFF2 so it travels inside the file and inside every exported
  screen — nothing to install on the players. Add Calvino, or replace any weight, from the
  same page.
- **Palette** — click any swatch to copy its hex. The same colours sit under every colour
  picker in the app, so nothing off-brand gets typed by accident.
- **Type scale** — the guideline's HD hierarchy (96 / 58 / 34 / 21 / 17 px). A text widget
  takes any level in one click.

---

## Running it

**For real screens — use the server.** It is also the only way to keep a large media
library: a browser will not hold big video files for a page opened straight from disk.

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

*Playlist* — each item gets its own seconds; videos always play in full, and **Repeat this
video** keeps a clip running over and over with no gap (a clip that is the only thing on
the screen does this on its own). Tick **Keep on
screen** and that item stays up until you change it — nothing rotates past it, nothing
fades. A screen holding a single image or video does this on its own. Drag the handle
to reorder. Transitions are cut, fade or crossfade, with an adjustable length — 600–900 ms
crossfade reads best on a wall this size. Loop and shuffle are in the transport bar.

Four ways a picture can sit on the screen:

- **Fit** — whole design visible, bars where the ratio doesn't match. Nothing is ever cut.
- **Fill** — covers the screen, edges may be cropped.
- **Stretch** — forced to the frame, distorts.
- **Original size** — pixel-for-pixel, centred.

*Widgets* sit on top of the media. Drag them
in the preview, resize from the corners, or type exact X / Y / W / H percentages. The
nine-square control snaps a widget to a corner, edge or centre inside the safe area.

### Layouts and widgets are separate

A **layout** decides how the screen is divided; **widgets** are the live pieces that go
into it. Pick a structure from **Layouts** in the bar above the preview — header/body/footer,
hero + bottom bar, main + side rail, three columns, a 2×2 dashboard, the identity's swept
panel, the motion guideline's lower third, or a free canvas — and its content zones appear
as outlines on the preview. Drag any widget over a zone and it snaps in and fills it; the
panel also has a zone dropdown and a release button. Change structure later and anything
bound to a zone re-flows with it.

The same menu offers **ready-made screens** that arrive fully built: event welcome, event
live, innovation dashboard, visitor experience, interactive event, social event,
wayfinding, and upcoming events. Each picks the right structure for a landscape wall or a
portrait screen.

Guides follow the motion guideline's two rings: the action-safe area at 90% and the
title-safe area at 80%, where wording belongs.

| Widget | What it does |
|---|---|
| Countdown / timer | To a date, a set length, or counting up — with Start, Pause and Reset |
| Clock · Date | Live time; Hijri (Umm al-Qura) and Gregorian, Arabic or English |
| Prayer times | Calculated on the screen itself, Umm al-Qura, no internet needed |
| Agenda | The session list, with whatever is on now highlighted automatically |
| Text | Any wording, with the brand type scale one click away |
| News bar | A scrolling strip along the bottom, right-to-left in Arabic |
| Number | A big figure with a caption — visitors, startups, days to launch |
| QR code | Generated on the spot, no third-party service |
| Weather | Current temperature for a Saudi city (needs internet on the player) |
| Wayfinding | Destinations with arrows, hall names and icons — "Workshop → LXD Lab" |
| Social wall | Event posts as a grid, cards, or one feature post with smaller ones, rotating on a timer |
| Live poll | Question, answers with animated result bars, participant count and a QR code to vote |
| Stat cards | Figures with animated counters, icons and captions — beneficiaries, workshops, entities |
| Quotes | Short quotes with their source, cycling on their own |
| Welcome | Bilingual welcome for a delegation, with the Authority mark and the guest's logo; changing the guest takes one field |
| Upcoming events | Events with date, time, place and a status chip that turns itself to *Starting soon* then *Live now* — the chip's size is yours to set, filled or outlined, or switched off |
| Logo · Icon · Shape | The brand mark, a line icon from the library, or a brand colour block, gradient or swept panel |

**Direction takes care of itself.** Every line finds its own direction from its first
letter: an Arabic line reads right-to-left, an English line left-to-right, and both can sit
in the same widget with each starting at its own edge. Alignment is logical rather than
physical, so "align to the start" means the right edge in Arabic and the left in English.
Where a mixed line needs settling by hand, each widget has a direction control —
automatic, Arabic, or English. The desk's own text fields flip as you type, too.

Every widget also takes an **entrance animation** (fade, rise, slide, zoom, sweep — with
length and delay, previewable from the panel) and its own **visibility window**: the hours,
dates and days it appears, so a lunch notice or a session-only poll comes and goes by
itself without anyone publishing anything.

Every tool on the screen appears as a chip in the bar above the preview, each with its own
switch. Flicking a switch shows or hides that tool **on the wall immediately** — no
publishing step — which is what you want when someone asks for the countdown to come off
mid-session. **Add** sits in the same bar, so tools can be dropped onto a design from any
page, not only the widgets page.

**Layouts** in that bar drop a finished arrangement onto the screen — event countdown,
welcome screen, agenda board, lower third — all built from the identity and adapted to the
screen's orientation. Your media is untouched.

Widgets stack. The list in the panel reads front-to-back and can be dragged to restack,
with **to front / forward / back / to back** buttons beside it and `Ctrl+]` / `Ctrl+[`
(add Shift to jump straight to the front or back). A newly added tool always lands in
front, ready to be placed. Media can be dragged from the library straight onto the preview.

The **Screens** page runs a real, live preview inside every card — the same renderer as the
wall — so you can see what each screen is showing without switching to it. A card carries a
red note when its draft has changes you haven't published.

- Arrow keys nudge 0.5% · Shift+arrows 2%
- Ctrl/⌘+D duplicates · Delete removes · Ctrl/⌘+Z undoes
- Space plays or pauses · Ctrl/⌘+S saves the draft · Ctrl/⌘+Enter publishes

The countdown works two ways. **To a date** counts down to a moment — the opening, the
launch. **Timer** counts down a length you set, for a pitch slot or a workshop round.
Either one has Start, Pause and Reset in the panel, and those act on the wall the instant
you press them, without publishing. Pause freezes the numbers where they are; Start picks
up from exactly there.

The date widget does Hijri (Umm al-Qura) and Gregorian, in Arabic or English, separately
or together. The QR code is generated on the spot — no internet, no third-party service.

**Player rotation** lives in the screen panel. If a landscape player drives a screen
mounted portrait, set 90° and the output turns — the layout itself is untouched.

*Guides* sit under the preview: safe area (5% inset), centre lines, grid. They are never
part of what the screens show.

---

## Taking a screen somewhere else

**Screens → Export as a website** turns any screen into a single `.html` file that plays on
its own: no server, no storage, no connection. Put it on a web host, a USB stick, a kiosk
player, or inside an existing page. It always keeps the screen's proportions — in a wider
box it letterboxes and centres rather than stretching, so a 2:9 InnovateX layout stays 2:9
everywhere.

Three ways to pack it:

- **Everything in one file** — media is embedded. Nothing else is needed, works offline.
  The file grows with the media, so it suits stills and short clips.
- **Stays in sync with this desk** — a small file that keeps talking to the sync server.
  Every time you press Publish, the separate site updates itself; no re-export, no touching
  the host. If the server goes quiet the site simply keeps showing the last content it
  received. This is the one to use for a site that must stay current.
- **Link media to this server** — a snapshot file that pulls only its media from this
  server. Good for long videos, but the device has to reach the server.

After the download you get an embed snippet to paste into any page:

```html
<iframe src="innovatex-display.html"
  style="width:100%; aspect-ratio:0.6/2.7; border:0; display:block"
  allow="autoplay; fullscreen"></iframe>
```

The first two options are snapshots — export again after you change things. The live option
never needs re-exporting. Because a live site is usually hosted on a different address, the
sync server answers cross-origin requests.

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

- *The player shows "No screen with this link"* — that display link no longer matches a
  screen. Copy the current link from the Screens page.
- *Screen shows Not connected* — the player isn't reporting. Check the display page is
  open and that it can reach the server address (not `localhost` from another machine).
- *Video doesn't start* — clips are played muted, which is the only way a browser will
  start them without someone clicking first; signage audio is off by design. If a browser
  still refuses, the screen retries, and the first touch or key press on the page starts
  playback.
- *A clip stops part way* — if a player stalls, the screen nudges it back to life after a
  few seconds and moves on if it stays dead, so a wall left running for weeks recovers on
  its own.
- *Uploaded images don't appear* — a page opened with `file://` gets no blob storage in
  Chrome. The app now keeps files under 6 MB inside the page itself so uploads still work,
  and says so on the media page. For anything larger, run the sync server.
- *Storage is full* — browser-local mode holds media in the browser. Run the server, or
  remove unused media.
- *The right-hand panel is missing on a small window* — the panel button in the header
  brings it back.
- *Upgrading from an earlier copy* — the old `vertical-1` screen becomes `innovatex`, so
  update any bookmark on the player. An untouched second vertical screen is removed.
- *Prayer times look a minute off* — sources differ slightly. Asr follows the standard
  (Shafi'i) method by default; Hanafi is one click away in the widget panel.
- *Fonts* — without the licensed files in the brand kit, the platform uses fonts already on the player so it never waits on a network.
  Baked-in typography belongs in your uploaded artwork.
