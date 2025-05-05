import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

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
)
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

const transport = new StdioServerTransport();
await server.connect(transport);
