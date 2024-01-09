var lobbySocket;

const connectToLobby = (id, username, callback) => {
    lobbySocket = new WebSocket(`ws://localhost:8080/lobby?id=${id}&username=${encodeURIComponent(username)}`);

    lobbySocket.onmessage = message => {
        callback(message)
    }
}

const sendLobbyMessage = message => {
    lobbySocket.send(message);
};

export { connectToLobby, sendLobbyMessage };
