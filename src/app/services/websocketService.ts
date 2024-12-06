import { Server } from 'http';
import { WebSocketServer } from 'ws';

import { getCallState } from '#app/state/callManager.js';

function setupWebSocket(server: Server) {
  console.log('Starting websocket server');
  const wss: WebSocketServer = new WebSocketServer({ server });

  wss.on("error", (err) => {
    console.log("There was a problem with websocket server", err.message);
  })

  wss.on('connection', (ws: any, request) => {
    const callId = request.url?.split('/').pop();

    if (!callId) {
      console.error('No call ID found in WebSocket connection URL');
      ws.close();
      return;
    }

    console.log('WebSocket connection established for call ID:', callId);

    const callState = getCallState(callId);

    if (!callState) return;

    callState.websocketConnection = ws;

    ws.on('message', (message: any) => {
      const data = JSON.parse(message);

      switch (data.event) {
        case 'connected':
          console.log('Audio Connected for: ', callId);
          break;
        case 'start':
          console.log('Audio Started for: ', callId);
          callState.audioStreamId = data.start.streamSid;
          break;
        case 'media':
          // Pass the media chunk to the Google Speech-to-Text API
          callState.recognizeStream.write(data.media.payload);
          break;
        case 'closed':
          console.log('Closed: ', data);
          callState?.recognizeStream.end();
          break;
        default:
          console.log('Unknown event type');
      }
    });

    ws.on('close', async () => {
      console.log('WebSocket connection closed');
      callState?.recognizeStream.end();
    });
  });
}

export { setupWebSocket };
