import { io } from 'socket.io-client';

const URL = 'http://localhost:5178';
export const socket = io(URL, { autoConnect: false });
