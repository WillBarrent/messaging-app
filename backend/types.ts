export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Payload {
  sub: number;
}

export type NewUser = Omit<User, "id">;
