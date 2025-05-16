
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const Chats = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen p-4">
        {/**/}
        <div className="flex items-center justify-end mb-6 p-3 glassmorphism rounded-lg">
          <div className="flex items-center mr-4">
            <Avatar className="mr-2">
              <AvatarFallback className="bg-metall-purpleDark text-white">
                {user.email?.[0].toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-medium mr-4">{user.email}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut} 
            className="border-metall-purple text-metall-purple hover:bg-metall-purple/10"
          >
            <LogOut size={16} className="mr-1" /> {t("logout")}
          </Button>
        </div>
        
        {/* */}
        <div className="h-[80vh] glassmorphism rounded-xl overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Chats;
