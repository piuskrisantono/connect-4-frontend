var lobbySocket;

const connectToServer = (id, username, messageCallback, disconnectCallback) => {
    lobbySocket = new WebSocket(`ws://localhost:8080/lobby?id=${id}&username=${encodeURIComponent(username)}`);

    lobbySocket.onmessage = message => {
        messageCallback(message)
    }

    lobbySocket.onclose = () => {
        disconnectCallback();
    }
}

const sendMessage = message => {
    lobbySocket.send(message);
};

export { connectToServer, sendMessage };
