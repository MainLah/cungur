import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Message } from "./dashboard";
import { useParams, Link, useNavigate } from "react-router-dom";
import handleLogout from "../utils/handleLogout";
import { BASE_URL } from "../utils/env";

const OtherUsersPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams<{ username: string }>();
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const DBCurrentMessages = await fetch(
          `${BASE_URL}/api/messages/${username}`,
          { credentials: "include" }
        );
        if (!DBCurrentMessages.ok) {
          const errorData = await DBCurrentMessages.json();
          console.error("Error fetching messages:", errorData.message);
          navigate("/dashboard");
        }
        const data = await DBCurrentMessages.json();
        setCurrentMessages(data.data);
        setIsLoading(false);
      } catch (err) {
        setError((err as unknown as Error).message);
      }
    };
    fetchData();
  }, [navigate, BASE_URL, username]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        const res = await fetch(`${BASE_URL}/api/create/${username}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            message: newMessage,
          }),
          credentials: "include",
        });
        const sendData = await res.json();
        if (!res.ok) {
          setError(sendData.message);
          return;
        }
        setCurrentMessages([
          {
            _id: sendData.id,
            username: username ?? null,
            message: newMessage,
            timestamp: new Date(),
          },
          ...currentMessages,
        ]);
        setError("");
      } catch (err) {
        setError((err as unknown as Error).message);
      }
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {error && (
        <div className="text-red-500 text-center mb-4 text-xl md:text-2xl">
          {error}
        </div>
      )}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Dashboard</CardTitle>
          <div className="flex gap-2">
            <Button size="default" variant="link" asChild>
              <Link to="/dashboard">Your Inbox</Link>
            </Button>
            <Button size="lg" onClick={handleLogout}>
              Logout
            </Button>
          </div>
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
              {isLoading ? (
                <div className="text-gray-500">Loading messages...</div>
              ) : currentMessages.length === 0 ? (
                <div className="text-gray-500">No messages yet.</div>
              ) : (
                currentMessages.map((msg, index) => (
                  <div
                    key={index}
                    data-id={msg._id}
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
