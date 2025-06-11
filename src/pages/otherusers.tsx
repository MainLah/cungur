import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Message } from "./dashboard";

const OtherUsersPage = () => {
  const data = useLoaderData();

  const [currentMessages, setCurrentMessages] = useState<Message[]>(
    data.data.map((e: any) => e)
  );
  const [newMessage, setNewMessage] = useState("");

  //   const handleSend = async () => {
  //     if (newMessage.trim()) {
  //       setCurrentMessages([
  //         { username: username, message: newMessage, timestamp: new Date() },
  //         ...messages,
  //       ]);
  //       try {
  //         await fetch("http://localhost:3000/api/create", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             username: username,
  //             message: newMessage,
  //           }),
  //           credentials: "include",
  //         });
  //       } catch (error) {
  //         console.error("Failed to send message:", error);
  //       }
  //       setNewMessage("");
  //     }
  //   };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
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
              {/* <Button onClick={handleSend}>Send</Button> */}
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
