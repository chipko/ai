# Agent Team Simulator

`mock-agent-team.html` is a mock "agent team / cowork" demo for presentations and recordings. It's one self-contained file (HTML, CSS and JS) with no dependencies, and it works offline. By default nothing calls a model; every run plays back a script.

Open the file in any browser. Press **Space** to play, **→** to step, **S** for the Scenario panel and **V** for Appearance.

## Making a scenario
- **Quick build**: enter a goal, a team (`Name | Role | emoji`, one per line) and the items the team should mention. A seeded generator fills in the rest: planning, tool calls, agents asking each other questions, deliverables, a review and revision loop, and a human approval step.
- **Presets**:
  - **SDLC:** feature delivery, legacy modernisation, bug to release, greenfield MVP.
  - **Business:** product launch, incident response, board report, invoice automation, support triage, policy rollout.
- **Roles** are recognised from the role text:
  - **Delivery:** product manager or owner / tech lead / engineering manager (these coordinate), architect, full-stack, frontend and backend developers, DevOps / platform / SRE, QA or test engineer, code reviewer.
  - **Business:** research, data, writer, design, security / compliance / legal, support, finance.

  Each role brings its own tools, questions and deliverables, for example an ADR with an options table and a container diagram, a full-stack feature slice, an accessible UI component, an OpenAPI spec with a SQL migration, a CI/CD pipeline with a canary rollout plan, and a test plan with test code. When the team is mostly engineers, the run uses SDLC phases (Requirements → Planning & design → Build → Integration → Deliverables → Code review → Release). Work goes design first and release last, items go to the roles they suit, and the approval step becomes "deploy to production?".
- **Generate with any LLM**: copy the ready-made prompt (it can ask for JSON or JSONL) into any model or chat tool, then paste back what it returns. There's also an optional direct call to any OpenAI-compatible endpoint.
- **Data (JSON / JSONL)**: edit, import, export or drag-and-drop the exact data that plays.

## Data format
The page accepts either a JSON document (`{title, goal, appearance?, agents[], tasks[], steps[]}`) or JSONL, one record per line:

```jsonl
// comments and blank lines are ignored
{"type":"meta","title":"Launch crew","goal":"Prepare the launch"}
{"type":"appearance","theme":"paper","fs":18,"frame":"1920x1080"}
{"type":"agent","id":"atlas","name":"Atlas","role":"Orchestrator","icon":"🧭"}
{"type":"agent","id":"scout","name":"Scout","role":"Researcher","icon":"🔎"}
{"type":"task","id":"t1","title":"Research pricing","owner":"scout"}
{"type":"note","text":"Phase 1 · Planning"}
{"type":"human","text":"Please prepare the launch."}
{"type":"message","from":"atlas","to":"scout","kind":"handoff","text":"@Scout, take t1"}
{"type":"task","id":"t1","status":"doing"}
{"type":"thinking","agent":"scout","text":"Checking sources…","duration":1500}
{"type":"tool","agent":"scout","tool":"web_search","input":"\"pricing\"","output":"12 results"}
{"type":"output","agent":"scout","id":"brief","title":"Brief","format":"markdown","content":"# Brief\n- point"}
{"type":"approval","from":"atlas","text":"Ready to publish?"}
{"type":"task","id":"t1","status":"done"}
```

Step types: `note, human, message (kind: ask|answer|handoff|review|say), thinking, tool, status, task, output (markdown|code, append:true to revise), approval, pause`. A `task` step with a new id and a `title` creates that task mid-run.

Ways to load data:
- Paste it into the Data pane.
- Use the Import button, or drop a file anywhere on the page.
- Add `?src=file.jsonl` to the URL when the page is served over http.
- Use **Download standalone HTML**, which embeds the scenario (and optionally the look) in a copy of the page.

## Recording
- **Frame**: fit the window, or use a fixed 16:9 (1920×1080 or 1280×720), 4:3, 1:1, 4:5, 9:16 vertical or custom size. A fixed frame lays out at exactly that size and scales to fit the window. The layout follows the frame, not the window.
- **Layout**: choose *Columns* or *Free canvas*. Press **L** (or ✥) to edit on the stage: drag a panel to move it, and drag its edges or corners to resize. Panels snap to a 1% grid and to each other's edges. Arrow keys nudge the selected panel; hold Shift to resize, or Alt for finer steps. Panels can be hidden from the editor. Presets: Classic columns, Conversation focus, Studio (agents strip), Network hero, Deliverables hero, Vertical (9:16). Positions are stored as percentages of the frame, so a layout works at any resolution and is saved with exported scenarios.
- **Look**: 7 themes (dark, midnight, slate, light, paper, high contrast, terminal), an accent colour, 5 font styles, 3 background styles, text size, column widths, spacing, corner radius and typing speed.
- **Panels**: you can show or hide the header, progress bar, team network, agent cards, counters, tasks, outputs, footer and the "Simulated" badge.
- **Recording mode** (**H**): hides the controls and key hints. Hover over the header to use the controls, or press **H** or **Esc** to exit. The cursor also hides when idle.
- **No scrollbars**: the stage never shows scrollbars (you can switch this off in Appearance). Panels still scroll with the wheel, trackpad or touch. They fade at the edges where there's more content, and the activity feed follows live output. Scroll up to read back, and a **↓ Latest** button takes you back to live.
- **Agent icons**: *Line icons* (the default) gives each role a matching outline icon, such as a compass for the lead, a blueprint for the architect, layers for full-stack, a database for backend, a cloud for DevOps and a flask for QA, drawn in the agent's colour. *Monograms* shows the agent's initials, and *Emoji* uses each agent's emoji. Tool, document and counter glyphs follow the same style. A scenario can pin an agent's line icon with `"glyph": "backend"` (any role name, or `human`, `team`).
- **Light/dark**: the ◐ button in the header toggles light and dark; **T** cycles through all 7 themes.
- **Countdown**: an optional 3-2-1 countdown when playing from the start.
- **Auto-approve**: optional, for hands-free runs.
- **URL parameters** for a browser source in recording software: `?src=demo.jsonl&frame=1920x1080&theme=midnight&fs=18&speed=1.5&rec=1&autoplay=1`.

## Keys
Space play/pause · → step or finish typing · R restart · E jump to end · A approve · S scenario · V appearance · L edit layout · H recording mode · F fullscreen · T next theme · +/− text size · Esc close
