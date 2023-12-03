// src/api/websocket.ts

let websocket: WebSocket | null = null;
const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL as string;

export const connectWebSocket = (
  onMessage: (data: any) => void, 
  onError: (event: Event) => void, 
  onClose: () => void
) => {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.close();
  }

  websocket = new WebSocket(websocketUrl);

  websocket.onopen = () => {
    console.log('WebSocket Connected');
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
