import { useContext } from "react";
import UserContext, { type UserContextType } from "../UserContext";
import type { User } from "../App";
import { Link } from "react-router";

const ChatList = ({ users }: { users: User[] }) => {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <div>
      <h1>{user?.username}'s Chats</h1>
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id}>
              <Link to={`/chats/${user.id}`}>{user.username}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
