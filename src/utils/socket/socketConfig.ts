import { io } from 'socket.io-client';

const auth: any = JSON.parse(String(localStorage.getItem("auth")));
// console.log(auth?.accessToken)

const socket = io('52.139.152.154/', {
    transportOptions: {
        polling: {
            extraHeaders: {
                Authorization: `Bearer ${auth?.accessToken}`,
            }
        }
    }
})





export default socket;