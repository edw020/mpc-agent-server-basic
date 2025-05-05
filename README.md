# Basic MCP Agent Portfolio Project

This project demonstrates a basic implementation of a Model Context Protocol (MCP) server. It serves as a portfolio piece showcasing how to set up a minimal MCP server with a few example tools for basic request testing.

## Overview

The Model Context Protocol (MCP) is a specification for how AI models can interact with external tools and data sources in a standardized way. This project provides a simple server that adheres to this protocol.

This server utilizes the `@modelcontextprotocol/typescript-sdk` and specifically implements the `StreamableHTTPServerTransport` using the `express` framework. This means it functions as a standard HTTP server, capable of handling streaming responses, and can be deployed and accessed remotely as a remote MCP server.

## Requirements

To run and test this project, you need the following installed:

*   **Node.js:** Version 20 or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npx:** This is typically included with Node.js/npm installations. It's used to run Node packages without having to install them globally or locally.

## Getting Started: Running for Testing

You can easily run and test this MCP server using the **MCP Inspector**, a dedicated developer tool for testing and debugging MCP servers.

1.  **Navigate to the project directory** in your terminal.
2.  **Install dependencies** by running "npm install"
3.  **Run the server with the MCP Inspector using the provided script:**

    ```bash
    npm run inspect
    ```

4.  **Open the Inspector UI:** The command will output URLs for the MCP Inspector client UI (usually `http://localhost:6274`) and the MCP Proxy server (usually `http://localhost:6277`). Open the client UI URL in your web browser.

5.  **Interact with your server:** Use the Inspector UI to connect to your running server, view available tools, and make test requests.

For more detailed information on using the MCP Inspector, refer to its official documentation:
[https://github.com/modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)

## Built With

*   **[@modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk):** The official TypeScript SDK for building MCP servers and clients. This project utilizes the SDK to define the server structure and tools according to the MCP specification.
