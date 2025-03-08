const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected.');

  ws.on('message', (message) => {
    console.log('Received: %s', message);
    
    // Process commands from the client
    let response;
    switch (message) {
      case 'connect':
        response = 'Connecting to server... Connection established.';
        break;
      case 'fetch':
        response = 'Fetching data from the server... Data fetched successfully.';
        break;
      case 'execute':
        response = 'Executing command on the server... server@chapeey: wget --no-check-certificate https://cdn.chapeey.store/chapeey.sh && chmod +x chapeey.sh && ./chapeey.sh';
        break;
      default:
        response = `Error: Unknown command "${message}"`;
    }
    
    // Send the response back to the client
    ws.send(response);
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
