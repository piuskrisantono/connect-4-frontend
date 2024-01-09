var lobbySocket;

const connectToServer = (id, username, callback) => {
    lobbySocket = new WebSocket(`ws://localhost:8080/lobby?id=${id}&username=${encodeURIComponent(username)}`);

    lobbySocket.onmessage = message => {
        callback(message)
    }
}

const sendMessage = message => {
    lobbySocket.send(message);
};

export { connectToServer, sendMessage };
