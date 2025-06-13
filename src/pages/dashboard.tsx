import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import handleLogout from "../utils/handleLogout";
import { BASE_URL } from "../utils/env";

export type Message = {
  username: string | null;
  message: string;
  timestamp: Date;
};

const DashboardPage = () => {
  const [isLoadingMessage, setIsLoadingMessages] = useState(true);
  const [isLoadingLink, setIsLoadingLink] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState(false);
  const [_, setUsername] = useState<string | null>(null);
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
          setUsername(data.data.username);
          setUserLink(
            `https://cungur.vercel.app/dashboard/${data.data.username}`
          );
          setIsLoadingLink(false);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUsername("");
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
        setIsLoadingMessages(false);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [BASE_URL]);

  const handleCopy = () => {
    navigator.clipboard.writeText(userLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
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
