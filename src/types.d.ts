export interface User {
  id: string;
  name: string;
  room: string;
}

export interface Message {
  id: string;
  room: string;
  userName: string;
  text: string;
}
