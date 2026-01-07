# MCP Vision & Input Control - Deep Dive

## what is this?
This tool basically bridges the gap between your AI and your computer's interface. It allows an AI agent to see your screen and control your mouse and keyboard, just like a human would.

It's powerful, but with great power comes... well, you know.

---

## ⚠️ READ THIS PART CAREFULLY ⚠️

> [!CAUTION]
> **This tool gives AI real control over your computer.**
> It can click buttons, delete files, type emails, and see everything on your screen.

### things that could go wrong
1.  **It might click the wrong thing.** AI isn't perfect. It might try to click "Cancel" and accidentally hit "Delete".
2.  **It sees everything.** When it takes a screenshot, it sees your passwords, private chats, bank details—whatever is on your screen. **Hide sensitive stuff before using this.**
3.  **It might get stuck.** Rarely, it might get into a loop. Be ready to hit `Ctrl+C` in your terminal to kill it if it goes rogue.

### how to stay safe
-   **Watch it.** Don't let it run while you go make coffee.
-   **Sandboxing.** If you can, run this in a VM or a separate user account.
-   **Revoke permissions.** You can always turn off Screen Recording or Accessibility access in macOS System Settings when you're not using it.

---

## how to use it properly

If you're building an agent with this, here is how you should teach it to behave.

### 1. The "Look-Then-Act" Rule
Don't let your AI guess where things are. It's terrible at guessing.

**❌ Bad Way:**
> AI: "I'll click the file icon now." (Guesses coordinates -> Clicks empty space)

**✅ Good Way:**
> 1.  **Look:** Call `screen_capture`.
> 2.  **Think:** AI analyzes the image and finds the "File Icon" at (200, 300).
> 3.  **Act:** Call `mouse_move(200, 300)` then `mouse_click("left")`.

### 2. Check the Screen Size
Coordinates are absolute. (0,0) is usually the top-left corner.
Use `calculate_screen_dimensions` first so the AI knows if it's working on a laptop screen or a 4K monitor.

### 3. Typing vs Pressing
-   Use **`keyboard_type`** when you want to write sentences (e.g., "Hello world").
-   Use **`keyboard_press`** for shortcuts (e.g., `cmd` + `c` to copy).

---

## tool cheating sheet

| Tool | What it does |
|------|-------------|
| `screen_capture` | Takes a screenshot. |
| `calculate_screen_dimensions` | Tells you how big the screen is. |
| `mouse_move` | Moves the mouse to specific X, Y coordinates. |
| `mouse_click` | Clicks. You can choose left/right/middle and single/double click. |
| `mouse_drag` | Clicks and holds, then moves to new coordinates. |
| `mouse_scroll` | Scrolls the page up or down. |
| `keyboard_type` | Types out a long string of text. |
| `keyboard_press` | Hits a specific key combo (like shortcuts). |

---

## troubleshooting

-   **Grey/Black Screen?**
    -   **macOS:** Privacy settings are blocking the view. Go to `System Settings -> Privacy & Security -> Screen Recording` and toggle your terminal/app.
    -   **Linux:** Ensure you are using X11 (Wayland support varies).
-   **Mouse won't move?**
    -   **macOS:** Check `Accessibility` in privacy settings.
    -   **Linux/Windows:** Ensure your user has permissions to control input devices.
-   **"Module not found"?** Did you remember to run `npm install` and `npm run build`?

Stay safe and have fun!
