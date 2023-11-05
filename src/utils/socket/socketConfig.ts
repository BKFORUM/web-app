import { io } from 'socket.io-client';

const auth: any = JSON.parse(String(localStorage.getItem("auth")));
console.log(auth?.accessToken)

const socket = io('http://52.139.152.154', {
    transports: ['websocket'],
    extraHeaders: {
        Authorization: `${auth?.accessToken}`
    }
})



export default socket;