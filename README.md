# MCP Vision & Input Control

A Model Context Protocol (MCP) server that enables LLMs to:
1.  **See the screen** (via screenshots).
2.  **Control the mouse** (move, click, drag, scroll).
3.  **Control the keyboard** (type, key combinations).

## Prerequisites

-   **Node.js**: v16 or higher.
-   **macOS Permissions**:
    -   **Screen Recording**: Required for `screen_capture`.
    -   **Accessibility**: Required for `mouse` and `keyboard` control.

## Installation

1.  Clone or download this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```

## Configuration

Add the following to your MCP client configuration (e.g., `claude_desktop_config.json` or Cursor settings):

```json
{
  "mcpServers": {
    "vision-input": {
      "command": "/path/to/your/node",
      "args": [
        "/absolute/path/to/mcp_watch_screen_and_interact_with_keyboard_mouse/build/index.js"
      ]
    }
  }
}
```

## Tools

-   `screen_capture`: Get a base64 encoded JPEG of the screen.
-   `calculate_screen_dimensions`: Get screen size.
-   `mouse_move(x, y)`: Move cursor.
-   `mouse_click(button, double)`: Click mouse.
-   `mouse_drag(x, y)`: Drag to coordinates.
-   `mouse_scroll(magnitude)`: Scroll wheel.
-   `keyboard_type(text)`: Type text.
-   `keyboard_press(key, modifiers)`: Press key combos (e.g., `cmd` + `c`).

## Troubleshooting

-   **Permission Denied / Grey Screen**: Ensure the application running the server (e.g., Terminal, Cursor, Claude) has Screen Recording permission in System Settings.
-   **Input Not Working**: Ensure Accessibility permission is granted.
