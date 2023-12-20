import { io } from 'socket.io-client';
// const auth: any = JSON.parse(String(localStorage.getItem('auth')))

const socket = io('52.139.152.154/',
  {
    reconnection: true,
    reconnectionAttempts: Infinity,
    transports: ['websocket', 'polling']

    // transportOptions: {
    //   polling: {
    //     extraHeaders: {
    //       Authorization: `Bearer ${auth.accessToken}`,
    //     },
    //   },
    // }
  })




export default socket;