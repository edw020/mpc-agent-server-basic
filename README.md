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

## Running from Docker image

If you want to use the project as a docker image, which is another common usage for MCPs as a more portable service, follow these steps:

1.  **Install Docker:** can be the cli or the desktop version. The point is to have docker daemon running locally
2.  **Build the Docker image by using the following command:**
    
    ```bash
    docker build -t <your_dockerhub_user>/mpc-agent-server-basic:<tag> .
    ```

3.  **Push to your Dockerhub by using the command:** (Optional if you don't need to deploy the container to cloud)

    ```bash
    docker push <your_dockerhub_user>/mpc-agent-server-basic:<tag>
    ```

4.  **Run the docker image with this command:**

    ```bash
    docker run -i -p 3001:3001 --rm <your_dockerhub_user>/mpc-agent-server-basic:<tag>
    ```
5.  **Start the MCP inspector client:**

    ```bash
    npx -y @modelcontextprotocol/inspector
    ```

6.  **Open the inspector client site:** `http://localhost:6274`
7.  **Interact with your server:** Use the Inspector UI to connect to your docker server (URL=`http:localhost:3001/mcp`), view available tools, and make test requests.

## Running from GCP Run instance

If you want to deploy your MCP as a docker image to use it as a remote service, follow the next steps

1.  **For this case you need to have a GCP cloud account with Cloud Run enabled**
2.  **Install GCloud CLI and set up your CLI user** [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3.  **Be sure you have a Docker build published to Dockerhub** (Optional)
    - If you want to use the published image from my dockerhub account you don't need to build an image by yourself. Otherwise, check the next details.
    - You can check on the previous section for guidance on building a docker image.
    - **Important** the docker image should be published as an linux amd64 os container. If you are building from an Apple silicon processor machine, you need to publish the docker image like this
        ```bash
        docker buildx build --platform linux/amd64 -t <your_dockerhub_user>/mpc-agent-server-basic:<tag> . 
        ```
4.  **Use GCloud CLI for deploying the docker image to a Run instance**
    - In the root you'll see service.yaml file which you will use as deployment config file.
    - On the serviceAccountName section be sure to use a valid Service Account from your GCP namespace.
    - On the containers/image section the image created was set as default, but you can replace it with your dockerhub image path if you want.
    - Use this command for gcloud deployment 
        ```bash
        gcloud run services replace service.yaml --region us-east1 
        ```

5.  **Go to the GCP console on the Run section:** [https://console.cloud.google.com/run](https://console.cloud.google.com/run)

    - Your Run instance should be deployed and fully serving (Revisions Tab)
    - Before testing with inspector, go to the Security tab and temporarily disable the Cloud IAM authentication, so the inspector can request to your instance with no problem.
    - Now check the URL assigned to the Run instance, should be something like this `https://us-east-1-<YOUR-PROJECT-ID>.cloudrun.net/mpc-agent-server-basic`. You'll use it as the server URL on the MCP inspector

6.  **Start the MCP inspector client:**

    ```bash
    npx -y @modelcontextprotocol/inspector
    ```

6.  **Open the inspector client site:** `http://localhost:6274`
7.  **Interact with your server:** Use the Inspector UI to connect to your Cloud Run server (URL=`<YOUR_RUN_SERVICE_URL>/mcp`), view available tools, and make test requests.


## Built With

*   **[@modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk):** The official TypeScript SDK for building MCP servers and clients. This project utilizes the SDK to define the server structure and tools according to the MCP specification.
