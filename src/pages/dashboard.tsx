import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Message = {
  username: string | null;
  message: string;
  timestamp: Date;
};

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userLink, setUserLink] = useState<string>("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.data.username);
          setUserLink(`http://localhost:3000/dashboard/${data.data.username}`);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUsername("");
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetch("http://localhost:3000/api/messages", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const messages = await data.json();
        setMessages(messages.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(userLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSend = async () => {
    if (newMessage.trim()) {
      setMessages([
        { username: username, message: newMessage, timestamp: new Date() },
        ...messages,
      ]);
      try {
        await fetch("http://localhost:3000/api/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            message: newMessage,
          }),
          credentials: "include",
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="font-medium mb-2">Your cungur link:</div>
            <div className="flex items-center gap-2">
              {username && (
                <Input value={userLink} readOnly className="flex-1" />
              )}
              <Button size="sm" variant="outline" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <div className="font-medium mb-2">
              Send yourself an anonymous message:
            </div>
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
          <div>
            <div className="font-medium mb-2">Received Messages:</div>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-gray-500">No messages yet.</div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded p-3 text-gray-800"
                  >
                    {msg.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
