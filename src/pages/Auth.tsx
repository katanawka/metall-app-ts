
import React, { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<"login" | "register">(
    tabParam === "register" ? "register" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();

  useEffect(() => {
    // Обновлять активную вкладку при изменении параметров URL
    if (tabParam === "register") {
      setActiveTab("register");
    } else if (tabParam === "login") {
      setActiveTab("login");
    }
  }, [tabParam]);

  // Form data for login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Form data for registration
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // If user is already logged in, redirect to chats page
  if (user) {
    return <Navigate to="/chats" replace />;
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginData.email, loginData.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      alert("Паролі не співпадають");
      setLoading(false);
      return;
    }

    try {
      await signUp(registerData.email, registerData.password, registerData.username);
      // After successful registration, switch to login tab
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10">
          <Logo size="lg" className="purple-glow mb-4" />
        </div>
        
        <div className="glassmorphism p-8 rounded-xl w-full max-w-md">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("login")}</TabsTrigger>
              <TabsTrigger value="register">{t("register")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    {t("email")}
                  </Label>
                  <div className="relative">
                    <Mail 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("enterEmail")}
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("enterPassword")}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-metall-purple hover:bg-metall-purpleDark text-white font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-metall-purple focus:ring-offset-metall-dark h-10"
                >
                  {loading ? t("loggingIn") : t("loginButton")}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                    {t("username")}
                  </Label>
                  <div className="relative">
                    <User 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="username"
                      name="username"
                      placeholder={t("enterUsername")}
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      required
                      className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    {t("email")}
                  </Label>
                  <div className="relative">
                    <Mail 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("enterEmail")}
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                      className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("enterPassword")}
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    {t("confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("confirmYourPassword")}
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-metall-purple hover:bg-metall-purpleDark text-white font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-metall-purple focus:ring-offset-metall-dark h-10"
                >
                  {loading ? t("registering") : t("registerButton")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MetallApp. {t("copyright")}.
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Auth;
