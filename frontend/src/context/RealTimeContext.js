import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const RealTimeContext = createContext();

const socket = io('http://localhost:5001');

export const RealTimeProvider = ({ children }) => {
  const [stockUpdates, setStockUpdates] = useState({});
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to real-time server');
    });

    socket.on('stock_update', (data) => {
      setStockUpdates((prev) => ({
        ...prev,
        [data.product_id]: data.stock,
      }));
    });

    socket.on('chat_message', (data) => {
      setChatMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off('connect');
      socket.off('stock_update');
      socket.off('chat_message');
    };
  }, []);

  const sendChatMessage = (message) => {
    socket.emit('chat_message', { message });
  };

  const updateStock = (productId, newStock) => {
    socket.emit('update_stock', { product_id: productId, stock: newStock });
  };

  return (
    <RealTimeContext.Provider value={{ stockUpdates, chatMessages, sendChatMessage, updateStock }}>
      {children}
    </RealTimeContext.Provider>
  );
};
