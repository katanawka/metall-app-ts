
import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10">
          <Logo size="lg" className="purple-glow mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать в MetallApp</h1>
          <p className="text-gray-300 mb-8">Выберите способ входа в систему</p>
        </div>
        
        <div className="glassmorphism p-8 rounded-xl w-full max-w-md">
          <div className="flex flex-col space-y-4">
            <Button 
              className="bg-metall-purple hover:bg-metall-purpleDark text-white font-medium h-12 text-lg"
              onClick={() => navigate('/auth?tab=register')}
            >
              Регистрация
            </Button>
            
            <Button 
              variant="outline"
              className="border-metall-purple text-metall-purple hover:bg-metall-purple/10 hover:text-white font-medium h-12 text-lg"
              onClick={() => navigate('/auth?tab=login')}
            >
              Войти
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MetallApp. Все права защищены.
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Index;
