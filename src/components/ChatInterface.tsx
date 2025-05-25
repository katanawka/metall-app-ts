
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ChatService, { Message, ChatUser } from "@/services/ChatService";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatInterface = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, ChatUser[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadPreviousMessages = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const previousMessages = await ChatService.loadPreviousMessages();
        setMessages(previousMessages);
      } catch (error) {
        console.error("Failed to load previous messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreviousMessages();
  }, [user, t]);
  
  useEffect(() => {
    if (!user) return;

    console.log("Setting up realtime subscriptions for user:", user.email);

    const chatService = ChatService.init();
    
    chatService.subscribeToRealtimeMessages((newMessage) => {
      console.log("Received realtime message:", newMessage);
      
      if (newMessage.sender_id === user.id) {
        return;
      }
      
      setMessages((prev) => {
        const exists = prev.some(msg => msg.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    });
    
    chatService
      .subscribeToMessages((newMessage) => {
        console.log("Received broadcast message:", newMessage);
        
        setMessages((prev) => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      })
      .subscribeToPresence((state) => {
        console.log("Presence state updated:", state);
        setOnlineUsers(state);
      });
    
    if (user.id && user.email) {
      chatService.trackPresence(user.id, user.email);
      chatService.ensureSubscribed();
    }

    return () => {
      console.log("Cleaning up subscriptions");
      chatService.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !message.trim()) return;
    
    try {
      const sentMessage = await ChatService.sendMessage(
        user.id, 
        user.email || "", 
        message.trim()
      );
      
      setMessages((prev) => {
        const exists = prev.some(msg => msg.id === sentMessage.id);
        if (exists) return prev;
        return [...prev, sentMessage];
      });
      
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onlineUserCount = Object.values(onlineUsers).reduce(
    (acc, users) => acc + users.length, 
    0
  );

  return (
    <div className="flex flex-col h-full">
      {/*  */}
      <div className="bg-metall-purpleDark/30 p-3 rounded-t-lg">
        <h2 className="text-lg text-white font-medium">{t("chats")}</h2>
        <p className="text-sm text-gray-300">
          {onlineUserCount} {onlineUserCount === 1 ? t("userOnline") : t("usersOnline")}
        </p>
      </div>
      
      {/*  */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">{t("loading")}...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">{t("newMessage")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender_id === user?.id 
                      ? "bg-metall-purple/70 text-white" 
                      : "bg-gray-700/50 text-white"
                  }`}
                >
                  {msg.sender_id !== user?.id && (
                    <div className="flex items-center mb-1">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="text-xs">
                          {msg.sender_email[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-300">{msg.sender_email}</span>
                    </div>
                  )}
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/*  */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("typeMessage")}
            className="bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
          />
          <Button 
            type="submit" 
            disabled={!message.trim() || isLoading}
            className="bg-metall-purple hover:bg-metall-purpleDark"
          >
            <Send size={18} />
            <span className="sr-only">{t("send")}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
