import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import handleLogout from "../utils/handleLogout";
import { BASE_URL } from "../utils/env";

export type Message = {
  _id: string;
  username: string | null;
  message: string;
  timestamp: Date;
};

const DashboardPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMessage, setIsLoadingMessages] = useState(true);
  const [isLoadingLink, setIsLoadingLink] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState(false);
  const [userLink, setUserLink] = useState<string>("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch(BASE_URL + "/api/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserLink(
            `https://cungur.vercel.app/dashboard/${data.data.username}`
          );
          setIsLoadingLink(false);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUsername();

    const getData = async () => {
      try {
        const data = await fetch(BASE_URL + "/api/messages", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const messages = await data.json();
        setMessages(messages.data);
        console.log(messages);
        setIsLoadingMessages(false);
      } catch (error) {
        setError(error as unknown as string);
      }
    };
    getData();
  }, [BASE_URL]);

  const handleCopy = () => {
    navigator.clipboard.writeText(userLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: id }),
      });
      console.log(id);
      if (res.ok) {
        setMessages(messages.filter((msg) => msg._id !== id));
      }
    } catch (error) {
      setError(error as unknown as string);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {error ? (
        <div className="text-red-500 text-center mb-4 text-2xl">{error}</div>
      ) : null}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Your Inbox</CardTitle>
          <Button size="lg" onClick={handleLogout}>
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="font-medium mb-2">Step 1. Copy this link:</div>
            <div className="flex items-center gap-2 mb-2">
              {isLoadingLink ? (
                <div className="text-gray-500">Generating link...</div>
              ) : (
                <Input value={userLink} readOnly className="flex-1" />
              )}
              <Button size="sm" variant="outline" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="font-medium mb-2">
              Step 2. Share it with your friends to start receiving messages!
            </div>
          </div>
          <div>
            <div className="font-medium mb-2">Received Messages:</div>
            <div className="space-y-3">
              {isLoadingMessage ? (
                <div className="text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-gray-500">No messages yet.</div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index}>
                    <div className="bg-gray-100 rounded p-3 text-gray-800 relative group cursor-default">
                      {msg.message}
                      <img
                        className="w-4 absolute top-4 right-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        src="./delete-svgrepo-com.svg"
                        alt="Delete Message"
                        onClick={() => handleDelete(msg._id)}
                      />
                    </div>
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
