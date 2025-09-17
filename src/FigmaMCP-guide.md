# Figma MCP Setup Guide for Cursor

This guide will walk you through setting up the Figma MCP (Model Context Protocol) server in Cursor to enable AI-assisted design operations.

## Prerequisites

- Cursor IDE installed
- Node.js and npm installed
- Figma Desktop app installed and logged in
- Terminal access

## Step 1: Install Bun (Required)

The Figma MCP server requires Bun to run. Install it using the following command:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal or run:
```bash
source ~/.bashrc
# or
source ~/.zshrc
```

Verify the installation:
```bash
bun --version
```

## Step 2: Configure MCP Server in Cursor

1. **Open Cursor Settings**
   - Press `Cmd + ,` (Mac) or `Ctrl + ,` (Windows/Linux)
   - Go to "Features" → "Model Context Protocol"

2. **Add Figma MCP Server Configuration**
   - Click "Add Server"
   - Use the following configuration:

```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bunx",
      "args": [
        "cursor-talk-to-figma-mcp@latest"
      ]
    }
  }
}
```

3. **Alternative: Manual Configuration**
   - Navigate to your Cursor configuration file: `~/.cursor/mcp.json`
   - Add the Figma MCP server configuration:

```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["@jpisnice/shadcn-ui-mcp-server", "--github-api-key", "your-key-here"]
    },
    "TalkToFigma": {
      "command": "bunx",
      "args": [
        "cursor-talk-to-figma-mcp@latest"
      ]
    }
  }
}
```

## Step 3: Start the WebSocket Server

1. **Open Terminal**
   - Navigate to your project directory
   - Run the following command:

```bash
bunx cursor-talk-to-figma-socket
```

2. **Verify Server is Running**
   - You should see output indicating the server is listening on port 3845
   - Keep this terminal window open while using the MCP server

## Step 4: Connect in Cursor

1. **Open Figma Desktop**
   - Make sure you're logged in
   - Open the Figma file you want to work with

2. **Connect MCP Server in Cursor**
   - In Cursor, look for the "Cursor Talk To Figma Plugin" interface
   - Click "Connect" button
   - The plugin should show "Connected to server in channel: [channel-id]"

## Step 5: Verify Connection

1. **Test the Connection**
   - The MCP server should now be available in Cursor
   - You can ask the AI to access your Figma file
   - Try commands like "Read my current Figma design" or "Get document info"

2. **Troubleshooting Connection Issues**
   - Ensure Figma Desktop is open with your file active
   - Make sure the WebSocket server is still running
   - Try disconnecting and reconnecting in the plugin interface
   - Restart Cursor if needed

## Step 6: Using Figma MCP

Once connected, you can:

- **Extract Design Tokens**: Get colors, typography, spacing from your designs
- **Export Assets**: Download images, icons, and other assets
- **Read Component Information**: Get details about Figma components
- **Access Text Content**: Extract text content from your designs
- **Get Layer Information**: Understand the structure of your designs




## Troubleshooting

### Common Issues

1. **"bunx: command not found"**
   - Solution: Install Bun using the curl command above
   - Restart your terminal after installation

2. **"Not connected to Figma"**
   - Solution: Make sure Figma Desktop is open with your file active
   - Ensure the WebSocket server is running
   - Try reconnecting in the plugin interface

3. **"Must join a channel before sending commands"**
   - Solution: The AI needs to join the channel first
   - This should happen automatically when you ask the AI to access Figma

4. **Connection errors**
   - Solution: Restart the WebSocket server
   - Restart Cursor
   - Check that port 3845 is not blocked

### Port Configuration

- **Default Port**: 3845
- **Alternative Port**: 3055 (if using different plugin version)
- **Check Port**: The terminal output will show which port is being used

## Best Practices

1. **Keep Figma Desktop Open**: Always have your design file open and active
2. **Maintain WebSocket Server**: Keep the terminal running the server
3. **Restart When Needed**: If connections fail, restart both the server and Cursor
4. **File Permissions**: Ensure your Figma file is accessible (not in a private team requiring special permissions)





## Advanced Configuration

### Custom Port Configuration

If you need to use a different port, update your MCP configuration:

```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bunx",
      "args": [
        "cursor-talk-to-figma-mcp@latest",
        "--port",
        "3055"
      ]
    }
  }
}
```

### Multiple Figma Files

- Only one Figma file can be accessed at a time
- Switch between files by opening them in Figma Desktop
- The MCP server will automatically connect to the active file

## Support

If you encounter issues:

1. Check the terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure Figma Desktop is properly logged in
4. Try restarting both the server and Cursor
5. Check the Cursor Talk To Figma Plugin documentation

## Success Indicators

You'll know the setup is working when:
- ✅ WebSocket server shows "listening on port 3845"
- ✅ Cursor plugin shows "Connected to server in channel: [id]"
- ✅ AI can access your Figma file and extract design information
- ✅ You can ask the AI to read your design and get detailed responses

---

**Note**: This setup enables powerful AI-assisted design workflows, allowing you to extract design tokens, export assets, and implement designs directly from Figma into your codebase.