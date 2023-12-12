// src/api/websocket.ts

let websocket: WebSocket | null = null;
const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL as string;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const connectWebSocket = (userId: string, onMessage: (data: any) => void, onError: (event: Event) => void, onClose: () => void) => {
   if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.close();
   }

   websocket = new WebSocket(websocketUrl);

   websocket.onopen = () => {
      console.log('WebSocket Connected');
      sendWebSocketMessage({ userId }); // Send userId upon connection
   };

   websocket.onmessage = event => {
      const data = JSON.parse(event.data);
      onMessage(data);
   };

   websocket.onerror = event => {
      console.error('WebSocket Error:', event);
      onError(event);
   };

   websocket.onclose = () => {
      console.log('WebSocket Disconnected');
      onClose();
   };
};

export const closeWebSocket = () => {
   if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.close();
   }
};

export const sendWebSocketMessage = (message: object) => {
   if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
   }
};
