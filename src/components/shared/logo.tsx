import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative aspect-square h-8 w-8 rounded-full rounded-full overflow-hidden",
        className
      )}
    >
      <Image src="/logo.png" alt="Logo" fill className="object-cover" />
    </div>
  );
};

export default Logo;
