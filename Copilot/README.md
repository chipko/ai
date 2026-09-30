# Copilot Training Studio

`copilot-training.html` is a scripted, offline mock of **Microsoft 365 Copilot** for training sessions. It's one self-contained file with no dependencies. It never connects to Microsoft 365, and every prompt, answer and document is fictional, so a demo can't go wrong in front of a room.

Open it in Chrome or Edge. Press **→** (or **Next**) to run each step, and **T** to switch light/dark.

## What's in it
**Copilot Chat** (where most people start):
1. **Catch up on my week:** emails, chats and meetings summarised with actions, then a follow-up reply draft.
2. **Prepare for the board:** `/` file references, a KPI table, top risks and questions to ask.
3. **From vague to great prompts:** the same request, first vague, then with *Goal · Context · Source · Expectations*.
4. **Analyse length of stay:** Analyst with an attached spreadsheet, a chart and outliers.
5. **CQC Well-led summary:** Researcher working across an evidence folder, with a referenced table.

**Microsoft 365 apps** (quick showcase, each with the Copilot pane):
6. **Outlook:** thread summary and a drafted reply.
7. **Teams:** meeting decisions and action owners.
8. **Word:** a business case drafted from a file.
9. **Excel:** a chart plus highlighted outliers.
10. **PowerPoint:** a deck from a document.

The chat mirrors Copilot's layout and behaviour: agents list, Work/Web switch, `/` references and attachments, grounding steps, numbered citations and references, answer actions, suggested follow-ups, and the "AI-generated content may be incorrect" note. It uses neutral stand-in icons, not Microsoft logos.

## Presenting
- **→ / Next:** next step. It types the prompt, then Copilot answers. Pressing → while it's typing finishes it instantly.
- **Space:** auto-play the scene.
- **Scene navigation:** **←** and **Shift+→** move between scenes, and **1–9** jump straight to one.
- **R** restarts the scene, and **E** finishes it.
- **T:** light/dark.
- **H:** hide the presenter bar.
- **F:** fullscreen.
- **+ / −:** text size.
- **D:** setup: your name, organisation, frame size, typing and answer speed, and trainer captions.
- **Trainer captions** show a short teaching point at key moments. You can switch them off in Setup.

## Recording for slides
Press **● Rec** (or **C**), choose **this tab**, and the scene, or all scenes back to back, is recorded to an MP4. The clip is rebuilt as a standard MP4 so PowerPoint accepts it, with no re-encoding and no increase in size.

## Adapting it for other audiences
Every scene is JSON (**⚙ → Scenes (JSON)**): the prompts, answers (markdown with `[1]` citations and `chart` blocks), references, documents, emails, spreadsheet rows and slides. Edit it for ward managers, finance, HR or any other team, then **Download .json** to share with other trainers. They can **Import** it or drop the file on the page.
