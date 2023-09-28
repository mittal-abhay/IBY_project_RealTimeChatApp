import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ChatContext = createContext();

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [isAIChat, setIsAIChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(ENDPOINT);
    socketRef.current.on("get-online-users", (users) => {
      setOnlineUsers(onlineUsers);
    });
    socketRef.current.on("connected", (user) => {
      console.log(user);
      setOnlineUsers((prev) => [...prev, user]);
    });
    const userInfo = JSON.parse(localStorage.getItem("User"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }

    return () => {
      socketRef.current = null;
      setOnlineUsers([]);
    };
  }, [navigate]);

  useEffect(() => {
    console.log(onlineUsers);
  }, [onlineUsers]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        isAIChat,
        setIsAIChat,
        onlineUsers,
        setOnlineUsers,
        socket: socketRef.current,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
