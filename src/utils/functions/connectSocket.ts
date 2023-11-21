import socket from "@utils/socket/socketConfig";

export const connectSocket = () => {
    socket.on('connect', () => {
        console.log('Socket connected');
    });
    socket.on('connect_error', (err) => console.log(err));
};