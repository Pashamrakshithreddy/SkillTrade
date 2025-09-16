import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userProfile");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!isAuth || !userData) {
      navigate("/create-profile");
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <MessagingInterface
        isOpen={true}
        onClose={() => navigate("/feed")}
        currentUserId="currentUser"
      />
    </div>
  );
};

export default Messages;
