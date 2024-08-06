import http from "http";
import { Server } from "socket.io";
import express from "express";

// App router
const app = express();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(process.cwd() + "/src/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// Port
const LOCAL_PORT = 3000;
const PORT = process.env.PORT || LOCAL_PORT;

// WebSockets server
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
    headers: {
        "Content-Type": `application/json`,
        "ngrok-skip-browser-warning": "69420",
    },
});

httpServer.listen(PORT, () => {
    if (PORT === LOCAL_PORT) {
        console.log(`Listening on http://localhost:${PORT}`);
    }
});

// WebSockets
wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket event: ${event} from ${socket.id} `);
    });
    wsServer.sockets.emit("update_rooms", getPublicRooms());
    socket.on("check_room", (roomName) => {
        if (isUserInRoom(socket.id)) {
            socket.emit("already_in_room");
        } else {
            const cnt = countUserInRoom(roomName) ? countUserInRoom(roomName) + 1 : 1;
            if (cnt > 2) {
                socket.emit("is_full", roomName);
            } else {
                socket.emit("is_available", roomName);
            }
        }
    });

    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("start_chat");
        socket.to(roomName).emit("send_offer");
        wsServer.sockets.emit("update_rooms", getPublicRooms());
    });

    socket.on("join_chat", (roomName) => {
        socket.to(roomName).emit("join_chat");
    });

    socket.on("offer", (offer, roomName) => {


        socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });

    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
    socket.on("calling", (message) => {
        socket.to(message).emit("calling", message);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("leave_chat", socket.nickname);
            socket.to(room).emit("leave_call");
        });
    });

    socket.on("disconnect", () => {
        wsServer.sockets.emit("update_rooms", getPublicRooms());
    });
});

//SECTION - Functions

function getPublicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = {};
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms[key] = countUserInRoom(key);
        }
    });
    return publicRooms;
}

function countUserInRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

// Return If the user is "already" in the room.
function isUserInRoom(userId) {
    const {
        sockets: {
            adapter: { rooms },
        },
    } = wsServer;
    const publicRooms = Object.keys(getPublicRooms());
    let exist = false;

    publicRooms.forEach((roomName) => {
        let users = rooms.get(roomName);
        if (users.has(userId)) {
            exist = true;
            return;
        }
    });

    return exist;
}