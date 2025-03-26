import React, { createContext, useContext, useEffect, useState } from "react";
type MessageContext = {
  useMessage: () => void;
  setMessage: (message: string) => void;
};
const MessageContext = createContext<MessageContext | undefined>(undefined);
export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useCookieContext must be used within a CookieProvider");
  }
  return context;
};

export const MessageContextProvider = ({ children }) => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (message !== "") {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message]);

  const useMessage = () => {};
  return (
    <MessageContext.Provider value={{ useMessage, setMessage }}>
      <div className="fixed flex w-full justify-center bg-white shadow-sm z-50">
        {message}
      </div>
      {children}
    </MessageContext.Provider>
  );
};
