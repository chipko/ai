# Copilot Chat Simulator

`m365-copilot-sim.html` is a scripted copy of the Microsoft 365 Copilot Chat web interface. It records short, PowerPoint-ready video clips, so a presentation can show Copilot "live" with an experience you control completely. It's one self-contained file that works offline and calls no model. Every answer, thinking step and click comes from a script.

Open the file in Chrome or Edge. Press **Space** to play, **D** for the scenes and editor, and **C** to record.

## What it looks like
- Copilot Chat on the web: the sidebar (New chat, Search, Library, Notebooks), the **Work IQ / Web** toggle, the model picker (Auto, Quick Response, Think Deeper), the message box with **+**, the home chips, and your name and plan.
- **Light or dark.** The ◐ button or **T** switches the whole interface. A scene can also be pinned to light or dark.
- **Looks live.** An animated pointer moves to each control and clicks it. Prompts are typed character by character. Copilot shows reasoning steps (*Reading Board paper.docx…*) with a realistic pause for each one, then streams its answer with tables, citations, references, created files and follow-up chips. Think Deeper thinks for longer and Quick Response barely pauses. If a script has no thinking steps, they're generated from the sources the answer cites.
- **Documents.** Attach one or more files to a prompt. They appear as file chips with icons in the message box and above the sent prompt.
- Notebooks (create, add references, set instructions) and the Prompt Gallery (save a prompt, share it with the team) are scripted too.
- All names, numbers and documents in the built-in scenes are invented.

## Built-in scenes (Section C of the away-day deck)
| Section | Slide | Scenes |
|---|---|---|
| Controls | 42–45 | Quick tour · Quick Response · Think Deeper on a business case · Work or Web, same prompt |
| The inbox | 47 | Catch up on a thread · Draft a reply · Who is waiting on me · Sort the morning |
| Meetings | 48 | Prepare · Recap one you missed · Your own actions · Confirm it in writing |
| Documents | 49 | Read the long policy · Executive summary · Change the audience · Compare versions |
| Excel | 50 | Explain an inherited model · Build the formula · Find what is odd · Clean it up |
| Decks, and finding things | 51 | Paper into deck · Speaker notes · Find it across everything · Which version is current |
| A day | 52 | 08:30 morning briefing · 16:30 the chase · 17:30 close the loop |
| One task | 53 | Month end, handed from question to numbers to commentary to slides |
| Notebooks | 57–58 | Where to find it · Set the context once |
| Prompt Gallery | 59 | Save what works, share it with the team |

## Writing your own scenes
**☰ Scenes** lists the saved scenes by section. They're stored in this browser as you edit. **New scene**, **Duplicate**, ▲ ▼ and **Delete** manage them. **Export** and **Import** (.json or .jsonl) back them up or share them. **Download standalone HTML** makes a copy of the page with your scenes and look built in.

**Script** edits the current scene: title, section, slide number, theme, starting mode and model, the title card and end card, and the script itself. You can edit the script in either of two formats:

**Script** (quick to type):
```
@model Think Deeper
@attach Board paper.docx; Month-end pack.xlsx
> Stress-test this paper. What will the board challenge first?
~ Reading Board paper.docx {1800}
~ Checking the numbers in Month-end pack.xlsx
~= Thought for 24 seconds
< ### What the board will challenge
1. **Utilisation** is 11 points above today's [1]
| Option | Cost |
|---|---|
| A | £0.3m |
^ Board paper.docx | docx | You attached this
? Draft the risks section
@file Summary.docx | Word document · 1 page
```

**JSONL** (one JSON object per line; good for generating with an LLM):
```jsonl
{"type":"scene","title":"Stress-test a paper","section":"Documents","slide":"49","outro":{"title":"Lead with the decision"}}
{"type":"model","value":"Think Deeper"}
{"type":"prompt","text":"Stress-test this paper.","context":["Board paper.docx","Month-end pack.xlsx",{"name":"Budget queries","kind":"email"}]}
{"type":"think","steps":["Reading Board paper.docx",{"text":"Checking the numbers","ms":2500}],"summary":"Thought for 24 seconds"}
{"type":"response","markdown":"### What the board will challenge\n1. **Utilisation** [1]","refs":[{"title":"Board paper.docx","kind":"docx","meta":"You attached this"}],"followups":["Draft the risks section"],"files":[{"name":"Summary.docx","meta":"1 page"}]}
```
- `context` lists the documents attached to that prompt.
- Every script command also works as a JSONL line, for example `{"type":"newchat"}`, `{"type":"pause","value":1500}` or `{"type":"caption","text":"…","ms":4000}`.
- A .jsonl file with several `scene` lines imports as several scenes.
- **Copy LLM prompt** copies instructions for writing a scene in this format. Add your topic, paste it into any LLM, then paste the reply into the JSONL box or import it.

Other commands: `@mode web`, `@type` / `@send`, `@newchat`, `@caption text | ms`, `@highlight model | label` / `@unhighlight`, `@click target`, `@pause ms`, `@scroll prompt`, `@save`, `@gallery Saved`, `@share`, `@close`, `@notebooks`, `@create Name`, `@refs a.xlsx; b.docx`, `@instructions text`, `@instant … @live` (sets up earlier turns with no animation) and `@theme dark`. The cheat sheet is in the Script tab.

## Recording for PowerPoint
- **● Rec** (or **C**) records the current scene. **● Rec section** records every scene in the section, one file each, with a single "share this tab" prompt. Choose **this tab** when the browser asks.
- **Only the Copilot window is recorded.** The toolbar and editor are hidden, and the capture is cropped to the window, with no browser bars.
- Each clip runs title card → the scene, hands-free → a short hold on the finished screen → end card, then stops by itself. Untick **Title & end cards** to record only the Copilot window.
  - The **title card** shows the kicker (*C · Microsoft 365 Copilot*), the scene title, the section and the slide number.
  - The **end card** shows the takeaway, the prompts used and a "simulated demonstration" footnote.
  - Both use the deck's navy, Cambria and Calibri by default. You can switch them to light, or to match Copilot.
- Files are named by slide, such as `47-catch-up-on-a-thread.mp4`, and saved to your downloads folder. A **Clips ready** panel offers preview and Save.
- Chrome and Edge record H.264. The tool then rebuilds the file as a standard MP4, without re-encoding, so PowerPoint accepts it: Insert → Video → This Device. Browsers without H.264 save WebM, which needs converting (Clipchamp or HandBrake). **Make a clip PowerPoint-ready** fixes an earlier MP4.
- Quality: Standard 4 Mbps (≈ 30 MB/min), **High 8 Mbps (≈ 60 MB/min, default)** or Very high 12 Mbps. The recorder asks for a keyframe every second and favours sharp text. Keyframes are read from the video data itself, so PowerPoint can start or seek anywhere without smearing.
- Video size is 1920 × 1080 by default, with 1280 × 720, 2560 × 1440 and 4:3 options. **UI zoom** (125% by default) makes the interface large enough to read on a slide. Make the browser window large (F11) for the sharpest clip.
- Open the file directly. Previews and embedded frames block screen capture.

## Keys
Space play/pause · R reset · E jump to the finished screen · ← → previous/next scene · T light/dark · D scenes and editor · C record · H hide the toolbar · F fullscreen · Esc stop
