import { io } from 'socket.io-client';

const socket = io('52.139.152.154/',
  {
    reconnection: true,
    reconnectionAttempts: Infinity,
    transports: ['websocket', 'polling']
  })




export default socket;