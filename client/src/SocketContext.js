import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from './socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Only connect once, when the component mounts
    socket.connect();

    return () => {
      // Disconnect when the component unmounts
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
