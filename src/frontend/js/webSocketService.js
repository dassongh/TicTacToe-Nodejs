export function WebSocketService(url) {
  this.socket = new WebSocket(url);
  this.socket.onopen = () => console.log('connected');

  this.socket.onclose = event => {
    if (event.wasClean) {
      alert('Clean disconnect');
    } else {
      alert('Missed connection');
    }
  };
}

WebSocketService.init = url => new WebSocketService(url);
