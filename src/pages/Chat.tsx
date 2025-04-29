
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, ArrowLeft, User, Phone, Video } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  avatar?: string;
}

const Chat = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId || null);

  // Mock contacts data
  useEffect(() => {
    const mockContacts: ChatContact[] = [
      {
        id: "1",
        name: "John Smith",
        lastMessage: "Your car is ready for pickup!",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        unread: true,
      },
      {
        id: "2",
        name: "Car Support",
        lastMessage: "How was your rental experience?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unread: false,
      },
      {
        id: "3",
        name: "Sarah Johnson",
        lastMessage: "The car was in excellent condition, thank you!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unread: false,
      }
    ];
    
    setContacts(mockContacts);
    
    // Set demo messages for the active chat
    if (activeChatId) {
      const demoMessages: Message[] = [
        {
          id: "1",
          text: "Hello! How can I help you with your car rental today?",
          sender: "other",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
          id: "2",
          text: "I'd like to know if the car is available for pickup today?",
          sender: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        },
        {
          id: "3",
          text: "Yes, it's available! You can pick it up anytime between 9 AM and 5 PM.",
          sender: "other",
          timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        },
      ];
      
      setMessages(demoMessages);
    }
  }, [activeChatId, chatId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate a reply after 1 second
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you shortly.",
        sender: "other",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, replyMessage]);
    }, 1000);
  };

  const handleOpenChat = (id: string) => {
    setActiveChatId(id);
    navigate(`/chat/${id}`);
    
    // Mark as read
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, unread: false } : c
    ));
  };

  const handleGoBack = () => {
    setActiveChatId(null);
    navigate("/chat");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-144px)]">
      {!activeChatId ? (
        // Chat list view
        <div className="h-full flex flex-col">
          <h1 className="text-xl font-semibold p-4">Messages</h1>
          
          <Tabs defaultValue="all" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="flex-1">
              <div className="space-y-1">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer ${
                      contact.unread ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleOpenChat(contact.id)}
                  >
                    <Avatar>
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium text-sm ${contact.unread ? "font-semibold" : ""}`}>
                          {contact.name}
                        </h3>
                        <span className="text-xs text-gray-500">{formatTime(contact.timestamp)}</span>
                      </div>
                      <p className={`text-sm truncate ${contact.unread ? "font-medium text-black" : "text-gray-500"}`}>
                        {contact.lastMessage}
                      </p>
                    </div>
                    {contact.unread && (
                      <div className="w-2 h-2 bg-car rounded-full"></div>
                    )}
                  </div>
                ))}

                {contacts.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="unread">
              <div className="space-y-1">
                {contacts.filter(c => c.unread).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenChat(contact.id)}
                  >
                    <Avatar>
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-sm">{contact.name}</h3>
                        <span className="text-xs text-gray-500">{formatTime(contact.timestamp)}</span>
                      </div>
                      <p className="text-sm font-medium truncate">{contact.lastMessage}</p>
                    </div>
                    <div className="w-2 h-2 bg-car rounded-full"></div>
                  </div>
                ))}
                
                {contacts.filter(c => c.unread).length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p>No unread messages</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Individual chat view
        <div className="h-full flex flex-col">
          {/* Chat header */}
          <div className="flex items-center p-3 border-b">
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {/* Contact info from the selected chat */}
            {(() => {
              const contact = contacts.find(c => c.id === activeChatId);
              return contact ? (
                <div className="flex items-center flex-1">
                  <Avatar className="mr-2">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">{contact.name}</h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              ) : null;
            })()}
            
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "other" && (
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarFallback>
                      {contacts.find(c => c.id === activeChatId)?.name.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-car text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[10px] opacity-70 block text-right mt-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message input */}
          <div className="p-3 border-t flex items-center">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 mr-2"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSendMessage}
              disabled={message.trim() === ""}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
