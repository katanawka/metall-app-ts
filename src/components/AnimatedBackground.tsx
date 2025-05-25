
import { useEffect, useState, useRef } from "react";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

interface AnimatedCirclePosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

const AnimatedBackground = ({ children }: AnimatedBackgroundProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [circlePosition, setCirclePosition] = useState<AnimatedCirclePosition>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    setCirclePosition({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight
    });

    window.addEventListener("mousemove", handleMouseMove);
    
    startCircleAnimation();
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startCircleAnimation = () => {
    const animate = () => {
      setCirclePosition(prev => {
        const distanceX = Math.abs(prev.x - prev.targetX);
        const distanceY = Math.abs(prev.y - prev.targetY);
        
        if (distanceX < 5 && distanceY < 5) {
          return {
            ...prev,
            targetX: Math.random() * window.innerWidth,
            targetY: Math.random() * window.innerHeight
          };
        }
        
        return {
          ...prev,
          x: prev.x + (prev.targetX - prev.x) * 0.005,
          y: prev.y + (prev.targetY - prev.y) * 0.005
        };
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="relative min-h-screen overflow-hidden animated-background">
      {/*  */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 bg-metall-purple blur-[100px] animate-pulse-glow"
        style={{ 
          left: `${mousePosition.x / 3}px`,
          top: `${mousePosition.y / 3}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.3s ease, top 0.3s ease'
        }}
      />
      <div 
        className="absolute w-[300px] h-[300px] rounded-full opacity-10 bg-metall-purpleDark blur-[100px] animate-pulse-glow"
        style={{ 
          right: `${window.innerWidth - mousePosition.x / 2}px`,
          bottom: `${window.innerHeight - mousePosition.y / 2}px`,
          transform: 'translate(50%, 50%)',
          transition: 'right 0.5s ease, bottom 0.5s ease',
          animationDelay: '0.5s'
        }}
      />
      
      {/*  */}
      <div 
        className="absolute w-[350px] h-[350px] rounded-full opacity-15 bg-metall-accent blur-[120px]"
        style={{ 
          left: `${circlePosition.x}px`,
          top: `${circlePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'box-shadow 2s ease'
        }}
      />

      {/*  */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground;
