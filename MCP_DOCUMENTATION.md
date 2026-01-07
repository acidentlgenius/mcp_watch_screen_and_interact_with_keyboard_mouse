# MCP Vision & Input Control - Documentation

## Overview
The **MCP Vision & Input Control** server is a powerful Model Context Protocol (MCP) tool that empowers Large Language Models (LLMs) with the ability to perceive and interact with your computer's visual interface.

**Key Capabilities:**
- **Vision:** Capture real-time screenshots of your primary display.
- **Input Control:** complete mouse and keyboard automation (move, click, drag, scroll, type, key combos).
- **Context Awareness:** Retrieve screen dimensions to perform accurate relative movements.

---

## ⚠️ Security & Risks - READ CAREFULLY ⚠️

> [!CAUTION]
> **HIGH RISK TOOL**: This tool grants the AI **direct control** over your mouse and keyboard. It can perform actions just like a human user, including clicking buttons, typing text, and dragging files.

### 1. Unintended Actions
The AI might misinterpret a command or a screen element and click the wrong location. This could lead to:
- Deleting or modifying files.
- Sending unintended messages.
- Closing important applications.
- Changing system settings.

### 2. Privacy Exposure
The `screen_capture` tool takes full screenshots of your primary display.
- **Everything visible on your screen is sent to the AI.**
- This includes credentials, private messages, financial information, and sensitive documents.
- **Recommendation:** Clear your screen of sensitive data before allowing the AI to capture it.

### 3. "Runaway" Control
In rare cases, a loop or a sequence of rapid commands could make it difficult to regain control of your mouse/keyboard.
- **Mitigation:** Ensure you can easily terminate the MCP server process (e.g., `Ctrl+C` in the terminal running the server) or revoke permissions.

### 4. Best Practices for Safety
- **Supervision:** ALWAYS monitor the AI's actions. Do not leave it running unattended.
- **Sandboxing:** Ideally, run this tool in a virtual machine (VM) or a non-critical environment.
- **Permissions:** You can toggle MacOS "Screen Recording" and "Accessibility" permissions in System Settings to temporarily disable the tool's access.

---

## Installation & Setup

### Prerequisites
- **Node.js**: v16 or higher.
- **macOS**: This tool is optimized for macOS (uses `robotjs` and native screening permissions).

### 1. Clone & Install
```bash
git clone <repository_url>
cd mcp_watch_screen_and_interact_with_keyboard_mouse
npm install
```

### 2. Build
```bash
npm run build
```

### 3. Grant Permissions
On first run (or when triggered), macOS will ask for permissions. You must grant:
- **Screen Recording**: For `screen_capture`.
- **Accessibility**: For `robotjs` (mouse/keyboard control).

*If you denied these initially, go to System Settings -> Privacy & Security -> Screen Recording / Accessibility and enable the terminal or application running this server.*

### 4. Integration
Add to your MCP Client configuration (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "vision-input": {
      "command": "/usr/local/bin/node", 
      "args": [
        "/absolute/path/to/mcp_watch_screen_and_interact_with_keyboard_mouse/build/index.js"
      ]
    }
  }
}
```
*Note: Replace `/usr/local/bin/node` with your actual node path (`which node`), and update the absolute path to the build directory.*

---

## Efficient Usage Guide

To use this tool effectively and safely, follow these patterns.

### 1. The "Look-Then-Act" Loop
Never guess coordinates. Always capture the screen first to understand the current state.

**Inefficient:**
"Click on the file icon." (AI guesses coordinates -> fails)

**Efficient:**
Step 1. Call `screen_capture`.
Step 2. AI analyzes image to find "File Icon" at (200, 300).
Step 3. Call `mouse_move(200, 300)`.
Step 4. Call `mouse_click("left")`.

### 2. Handling Screen Dimensions
Tools return absolute coordinates. Use `calculate_screen_dimensions` to understand the boundaries.

```javascript
// Example Workflow
const customDims = await use_tool("calculate_screen_dimensions");
// Returns { width: 1920, height: 1080 }

// If you want to click the center:
await use_tool("mouse_move", { x: 1920/2, y: 1080/2 });
```

### 3. Typing Text
Use `keyboard_type` for strings and `keyboard_press` for shortcuts.
- **Typing:** `keyboard_type("Hello World")`
- **Shortcuts:** `keyboard_press("c", ["command"])` (Copy)

---

## Tool Reference

| Tool | Description | Parameters |
|------|-------------|------------|
| `screen_capture` | Captures primary display. | None |
| `calculate_screen_dimensions` | Returns screen width/height. | None |
| `mouse_move` | Moves cursor to absolute (x, y). | `x` (num), `y` (num) |
| `mouse_click` | Clicks mouse button. | `button` ("left"/"right"/"middle"), `double` (bool) |
| `mouse_drag` | Drags from current pos to (x, y). | `x` (num), `y` (num) |
| `mouse_scroll` | Scrolls the wheel. | `magnitude` (num: + up, - down) |
| `keyboard_type` | Types a string. | `text` (string), `delay` (ms) |
| `keyboard_press` | Presses a key combination. | `key` (char), `modifiers` (array: "command", "shift", etc.) |

---

## Troubleshooting

- **Grey Screen / Black Screen?**
    - Checks System Settings -> Privacy & Security -> Screen Recording. Remove and re-add the terminal app permissions if needed.
- **Mouse not moving?**
    - Checks System Settings -> Privacy & Security -> Accessibility.
- **"Module not found"?**
    - Ensure you ran `npm install` and `npm run build`.
