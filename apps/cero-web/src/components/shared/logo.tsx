import Image from "next/image";
import { cn } from "@/lib/utils";

const Logo = ({
  className,
  showText = true,
  showIcon = true,
  size = "default",
}: {
  className?: string;
  showText?: boolean;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
}) => {
  const sizes = {
    sm: { icon: 30, text: "text-xl" },
    default: { icon: 32, text: "text-2xl" },
    lg: { icon: 36, text: "text-3xl" },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex items-center", className)}>
      {showIcon && (
        <Image
          src="/1.png"
          alt="cerocode"
          width={currentSize.icon}
          height={currentSize.icon}
          className="object-contain"
        />
      )}
      {showText && (
        <span className={cn("font-bold tracking-tight uppercase", currentSize.text)}>
          <span className="text-foreground">cero</span>
          <span className="text-[#00ff41]">code</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
