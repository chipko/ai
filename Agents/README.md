# Agent Team Simulator

`mock-agent-team.html` is a mock "agent team / cowork" demo for presentations. It's one self-contained file with no dependencies, and it works offline. By default nothing calls a model; every run plays back a script.

Open the file in any browser. Press **Space** to play, **→** to step, and **S** to open the Scenario panel.

## Making a scenario
- **Quick build**: enter a goal, a team (`Name | Role | emoji`, one per line) and the items the team should mention. A seeded generator fills in the rest: planning, tool calls, agents asking each other questions, deliverables, a review and revision loop, and a human approval step.
- **Presets**: product launch, incident response, board report, invoice automation, support triage and policy rollout.
- **Generate with any LLM**: copy the ready-made prompt into any model or chat tool, then paste back the JSON it returns. There's also an optional direct call to any OpenAI-compatible endpoint, such as Ollama, LM Studio or a hosted gateway.
- **Script (JSON)**: edit, import or export the exact script that plays.

## Keys
Space play/pause · → step or finish typing · R restart · E jump to end · A approve · S scenario · F fullscreen · T theme · +/− text size
