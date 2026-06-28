export interface Message {
  id: number;
  content: string;
  senderId: number | null;
  receiverId: number | null;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  profilePictureUrl: string;
}

export interface Chat {
  id: number;
  messages: Message[];
  users: User[];
}

export interface IUserContext {
  token: string | undefined;
  userId: number | undefined;
  username: string | undefined;
  pfpUrl: string | undefined
}

export interface UserContextType {
  user: IUserContext | null;
  setLocalStorage: ({ token, userId, username, pfpUrl }: IUserContext) => void;
  clearLocalStorage: () => void;
}
