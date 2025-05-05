import express from 'express';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Transport by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

app.post('/mcp', async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        transports[sessionId] = transport;
      }
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    const server = new McpServer({
      name: 'VC MCP Agent',
      version: '1.0.0'
    });

    server.tool(
        'add',
        'Tool to add two numbers',
        {
            a: z.number().describe('First number'),
            b: z.number().describe('Second number'),
        },
        async ({ a, b }) => {
            return {
                content: [{
                    type: 'text',
                    text: `The sum of ${a} and ${b} is ${a + b}`
                }]
            }
        }
    );

    server.tool(
      'fetch-weather',
      'Tool to fetch weather of a city',
      {
          city: z.string().describe('City Name'),
      },
      async ({ city }) => {
          const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
          const data = await response.json();

          if (data.length === 0) {
              return {
                  content: [{
                      type: 'text',
                      text: `Information about ${city} not found`
                  }]
              }
          }

          const { latitude, longitude } = data.results[0];

          const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherResponse.json();


          return {
              content: [{
                  type: 'text',
                  text: JSON.stringify(weatherData, null, 2)
              }]
          }
      }
    );

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
