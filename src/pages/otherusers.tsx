import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Message } from "./dashboard";
import { useParams } from "react-router-dom";
import handleLogout from "../utils/handleLogout";

const OtherUsersPage = () => {
  const { username } = useParams<{ username: string }>();
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const DBCurrentMessages = await fetch(
          `https://cungur-v2.vercel.app/api/messages/${username}`,
          { credentials: "include" }
        );
        if (DBCurrentMessages.ok) {
          const data = await DBCurrentMessages.json();
          setCurrentMessages(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSend = async () => {
    if (newMessage.trim()) {
      setCurrentMessages([
        {
          username: username ?? null,
          message: newMessage,
          timestamp: new Date(),
        },
        ...currentMessages,
      ]);
      try {
        await fetch(`https://cungur-v2.vercel.app/api/create/${username}`, {
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
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Dashboard</CardTitle>
          <Button size="lg" onClick={handleLogout}>
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="font-medium mb-2">
              Send an anonymous message to {username || "User"}:
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
              {currentMessages.length === 0 ? (
                <div className="text-gray-500">No messages yet.</div>
              ) : (
                currentMessages.map((msg, index) => (
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

export default OtherUsersPage;
