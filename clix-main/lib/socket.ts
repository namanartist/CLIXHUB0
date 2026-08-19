/**
 * Centralized, Always-Connected Socket.IO Singleton Client
 * Maintains auto-reconnection across all pages, joins user and club channels, and handles offline retry.
 */

import { io, Socket } from 'socket.io-client';
import { getSocketUrl } from './apiConfig';
import { User, Club } from '../types';

let socketInstance: Socket | null = null;
let currentJoinedUser: User | null = null;
let currentJoinedClubs: Club[] = [];

/**
 * Get or initialize the persistent Socket.IO connection
 */
export function getSocket(): Socket | null {
  const socketUrl = getSocketUrl();
  if (!socketUrl) return null;

  if (!socketInstance) {
    socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected / Reconnected to server:', socketInstance?.id);
      rejoinCurrentRooms();
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('[Socket] Connection attempt warning:', error.message);
    });
  }

  if (socketInstance && !socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
}

/**
 * Re-emit join for user and all subscribed clubs
 */
function rejoinCurrentRooms() {
  if (!socketInstance || !socketInstance.connected) return;

  if (currentJoinedUser) {
    const clubIds = (currentJoinedClubs || []).map(c => c.id).concat(['institutional']);
    socketInstance.emit('join', {
      userId: currentJoinedUser.id,
      userEmail: currentJoinedUser.email,
      clubIds
    });
  }
}

/**
 * Sync user identity & clubs with persistent socket
 */
export function syncSocketRooms(user: User | null, clubs: Club[] = []): Socket | null {
  currentJoinedUser = user;
  currentJoinedClubs = clubs;
  const s = getSocket();
  if (s && s.connected) {
    rejoinCurrentRooms();
  }
  return s;
}
