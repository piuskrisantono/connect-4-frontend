
var socket;

const connect = cb => {
    socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => { };

    socket.onmessage = msg => {
        cb(msg);
    };

    socket.onclose = event => { };

    socket.onerror = error => { };
};

const sendMessage = msg => {
    socket.send(msg);
};

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

export { connect, sendMessage, connectToLobby, sendLobbyMessage };
