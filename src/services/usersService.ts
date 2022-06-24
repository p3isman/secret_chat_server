import { User } from '../types';

const users: User[] = [];

interface AddUserResponse {
  user?: User;
  error?: string;
}

export const addUser = ({ id, name, room }: User): AddUserResponse => {
  const roomTrimmed = room.trim();
  const nameTrimmed = name.trim();

  const existingUser = users.find(
    (user) => user.room === roomTrimmed && user.name === nameTrimmed,
  );

  if (existingUser) {
    return {
      error: 'Username already exists.',
    };
  }

  const user = { id, name: nameTrimmed, room: roomTrimmed };
  users.push(user);

  return { user };
};

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id: string) => users.find((user) => user.id === id);

export const getUsersInRoom = (room: string) => users.filter((user) => user.room === room);
