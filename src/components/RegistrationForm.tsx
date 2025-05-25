
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    navigate("/auth");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="glassmorphism p-8 rounded-xl w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-300">
            Имя пользователя
          </Label>
          <div className="relative">
            <User 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
            />
            <Input
              id="username"
              name="username"
              placeholder="Введите имя пользователя"
              value={formData.username}
              onChange={handleChange}
              required
              className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-300">
            Электронная почта
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
              placeholder="Введите email"
              value={formData.email}
              onChange={handleChange}
              required
              className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-300">
            Пароль
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
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
            Подтверждение пароля
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
              placeholder="Подтвердите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="pl-10 bg-black/30 border-metall-purpleDark/40 focus:border-metall-purple/80 text-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-metall-purple hover:bg-metall-purpleDark text-white font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-metall-purple focus:ring-offset-metall-dark h-10"
        >
          Войти
        </Button>

        <div className="text-center text-gray-400 text-sm">
          Уже есть аккаунт?{" "}
          <a href="/auth" className="text-metall-purple hover:text-white transition-colors">
            Войти
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
