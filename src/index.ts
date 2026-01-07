#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import screenshot from "screenshot-desktop";
import Jimp from "jimp";
import robot from "robotjs";

// Initialize MCP Server
const server = new Server(
    {
        name: "mcp-vision-input",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Helper to encode image buffer to base64
async function encodeImage(buffer: Buffer): Promise<string> {
    const image = await Jimp.read(buffer);
    // Optional: Resize if too large to keep payload size manageable
    // image.scaleToFit(1920, 1080); 
    const processedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    return processedBuffer.toString("base64");
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "screen_capture",
                description: "Capture the current screen content. Returns a base64 encoded JPEG image.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "calculate_screen_dimensions",
                description: "Get the dimensions (width, height) of the primary display.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "mouse_move",
                description: "Move the mouse cursor to a specific (x, y) coordinate.",
                inputSchema: {
                    type: "object",
                    properties: {
                        x: { type: "number", description: "X coordinate" },
                        y: { type: "number", description: "Y coordinate" },
                    },
                    required: ["x", "y"],
                },
            },
            {
                name: "mouse_click",
                description: "Click the mouse at the current position.",
                inputSchema: {
                    type: "object",
                    properties: {
                        button: { type: "string", enum: ["left", "right", "middle"], description: "Button to click. Default is left." },
                        double: { type: "boolean", description: "Whether to double click. Default is false." },
                    },
                },
            },
            {
                name: "mouse_drag",
                description: "Click and drag the mouse from current position to (x, y).",
                inputSchema: {
                    type: "object",
                    properties: {
                        x: { type: "number", description: "Destination X coordinate" },
                        y: { type: "number", description: "Destination Y coordinate" },
                    },
                    required: ["x", "y"],
                },
            },
            {
                name: "keyboard_type",
                description: "Type a string of text.",
                inputSchema: {
                    type: "object",
                    properties: {
                        text: { type: "string", description: "Text to type" },
                        delay: { type: "number", description: "Delay between key presses in ms. Default is 10." },
                    },
                    required: ["text"],
                },
            },
            {
                name: "keyboard_press",
                description: "Press a single key or key combination (e.g., 'command', 'c').",
                inputSchema: {
                    type: "object",
                    properties: {
                        key: { type: "string", description: "The key to press (e.g., 'a', 'enter', 'backspace')." },
                        modifiers: {
                            type: "array",
                            items: { type: "string" },
                            description: "Modifier keys (e.g., ['command', 'shift'])."
                        },
                    },
                    required: ["key"],
                },
            },
            {
                name: "mouse_scroll",
                description: "Scroll the mouse wheel.",
                inputSchema: {
                    type: "object",
                    properties: {
                        magnitude: { type: "number", description: "Scroll amount. Positive is up, negative is down." },
                        direction: { type: "string", enum: ["up", "down"], description: "Scroll direction (optional, can use magnitude sign instead)." },
                    },
                    required: ["magnitude"],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "screen_capture": {
                const displays = await screenshot.listDisplays();
                // Default to primary display (index 0 usually)
                // Adjust logic if multi-monitor support is needed specifically
                const imgBuffer = await screenshot({ format: 'jpg' });
                const base64Img = await encodeImage(imgBuffer);

                return {
                    content: [
                        {
                            type: "text",
                            text: "Screen captured successfully.",
                        },
                        {
                            type: "image",
                            data: base64Img,
                            mimeType: "image/jpeg",
                        }
                    ],
                };
            }

            case "calculate_screen_dimensions": {
                const screenSize = robot.getScreenSize();
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({ width: screenSize.width, height: screenSize.height }),
                        },
                    ],
                };
            }

            case "mouse_move": {
                const { x, y } = args as { x: number; y: number };
                robot.moveMouse(x, y);
                return {
                    content: [{ type: "text", text: `Moved mouse to (${x}, ${y})` }],
                };
            }

            case "mouse_click": {
                const { button = "left", double = false } = args as { button?: string; double?: boolean };
                robot.mouseClick(button, double);
                return {
                    content: [{ type: "text", text: `${double ? "Double " : ""}Clicked ${button} button` }],
                };
            }

            case "mouse_drag": {
                const { x, y } = args as { x: number; y: number };
                robot.dragMouse(x, y);
                return {
                    content: [{ type: "text", text: `Dragged mouse to (${x}, ${y})` }],
                };
            }

            case "keyboard_type": {
                const { text } = args as { text: string };
                robot.typeString(text);
                return {
                    content: [{ type: "text", text: `Typed: "${text}"` }],
                };
            }

            case "keyboard_press": {
                const { key, modifiers = [] } = args as { key: string; modifiers?: string[] };
                robot.keyTap(key, modifiers);
                return {
                    content: [{ type: "text", text: `Pressed key: ${key} with modifiers: ${modifiers.join(", ")}` }],
                };
            }

            case "mouse_scroll": {
                const { magnitude } = args as { magnitude: number };
                robot.scrollMouse(0, magnitude);
                return {
                    content: [{ type: "text", text: `Scrolled mouse.` }],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Vision & Input Server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
