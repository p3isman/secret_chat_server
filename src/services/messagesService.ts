import Cryptr from 'cryptr';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types';

const messages: Message[] = [];

export const cryptr = new Cryptr(process.env.SECRET_KEY!);

export const addMessage = (name: string, room: string, text: string) => {
  const id = uuidv4();
  text = cryptr.encrypt(text);

  const message = {
    id,
    room,
    userName: name,
    text,
  };
  messages.push(message);
};

export const getMessages = (room: string) => {
  return messages.filter((msg) => msg.room === room);
};
