# MCP Vision & Input Control

Hey there! 👋

This is a Model Context Protocol (MCP) server that basically gives your AI superpowers on your computer. It lets the AI:
1.  **See what you see** (by taking screenshots).
2.  **Use your mouse** (move, click, drag, scroll).
3.  **Type for you** (keyboard input).

Think of it as giving your AI agent a pair of eyes and hands.

## getting started

You'll need **Node.js v16+**.

### Platform Specifics

**macOS:**
Since this tool controls your mouse and sees your screen, macOS will ask for permission. You'll need to allow:
-   **Screen Recording**
-   **Accessibility**

**Windows:**
-   You may need to install build tools for `robotjs`: `npm install --global --production windows-build-tools`

**Linux:**
-   You will likely need X11 libraries. For Debian/Ubuntu: `sudo apt-get install libxtst-dev libpng++-dev`



## installation

It's pretty standard stuff:

1.  Clone this repo.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Build it:
    ```bash
    npm run build
    ```

## setup

Just add this to your MCP config (like `claude_desktop_config.json` or whatever you're using):

```json
{
  "mcpServers": {
    "vision-input": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/THIS/REPO/build/index.js"
      ]
    }
  }
}
```
*(Make sure to change that path to where you actually put this folder!)*

## capabilities

Here's what it can do out of the box:

-   **`screen_capture`**: Snaps a picture of your screen so the AI knows what's going on.
-   **`calculate_screen_dimensions`**: Checks how big your monitor is.
-   **`mouse_move`** / **`mouse_click`** / **`mouse_drag`**: Does exactly what it says on the tin.
-   **`mouse_scroll`**: Scrolls up or down.
-   **`keyboard_type`**: Types text out.
-   **`keyboard_press`**: Hits specific keys (like `cmd+c` to copy).

## trouble?

-   **Grey/Black Screen?** macOS is probably blocking the screen recording. Check System Settings > Privacy & Security > Screen Recording.
-   **Can't Click?** Check System Settings > Privacy & Security > Accessibility.

Enjoy building cool stuff! 🚀
