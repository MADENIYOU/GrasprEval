"use client";
import { useEffect, useState } from "react";

interface TypingAnimationProps {
  text: string;
  delay?: number;
  duration?: number;
}

const TypingAnimation = ({ text, delay = 0, duration = 0.1 }: TypingAnimationProps) => {
  const [visibleLetters, setVisibleLetters] = useState<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisibleLetters(text.length);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <div className="flex text-white">
      {text.split("").map((letter, index) => (
        <span
          key={index}
          style={{
            opacity: visibleLetters > index ? 1 : 0,
            transition: `opacity ${duration}s`,
            transitionDelay: `${delay + index * duration}s`,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </div>
  );
};

export default TypingAnimation;