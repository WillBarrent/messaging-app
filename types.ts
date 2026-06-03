interface User {
  id: number;
  username: string;
  password: string;
}

type NewUser = Omit<User, "id">;

export { User, NewUser };
