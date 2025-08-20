import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-bold text-center select-none transition-all duration-300 transform-gpu will-change-transform",
  {
    variants: {
      variant: {
        simple: "rounded-full px-3 py-1 text-white shadow-lg",
        tab: "relative rounded-md px-3 py-1.5 text-white shadow-lg before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:opacity-20 before:transition-opacity hover:before:opacity-30",
        ribbon: "relative px-4 py-2 text-white shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-0 before:border-t-[8px] before:border-b-[8px] before:border-l-[8px] before:border-transparent after:content-[''] after:absolute after:top-0 after:right-0 after:w-0 after:h-0 after:border-t-[8px] after:border-b-[8px] after:border-r-[8px] after:border-transparent transform -rotate-3 hover:rotate-0",
        corner: "relative px-3 py-1.5 text-white transform rotate-45 origin-center w-12 h-12 flex items-center justify-center text-xs leading-none overflow-hidden",
        flag: "relative px-4 py-2 text-white before:content-[''] before:absolute before:top-0 before:right-0 before:w-0 before:h-0 before:border-t-[20px] before:border-b-[20px] before:border-r-[15px] before:border-r-transparent before:border-t-current before:border-b-current",
        folded: "relative px-4 py-2 text-white before:content-[''] before:absolute before:top-0 before:right-0 before:w-0 before:h-0 before:border-t-[8px] before:border-r-[8px] before:border-t-white before:border-r-transparent shadow-lg"
      },
      badgeColor: {
        primary: "bg-gradient-to-br from-[#7d3600] to-[#4A3526]",
        secondary: "bg-gradient-to-br from-gray-600 to-gray-700",
        accent: "bg-gradient-to-br from-blue-500 to-blue-600",
        sale: "bg-gradient-to-br from-red-500 to-red-600",
        hot: "bg-gradient-to-br from-orange-500 to-red-500",
        new: "bg-gradient-to-br from-green-500 to-green-600",
        limited: "bg-gradient-to-br from-purple-500 to-purple-600",
        subtle: "bg-gradient-to-br from-gray-400 to-gray-500"
      },
      size: {
        sm: "text-xs min-h-[20px] px-2 py-0.5",
        md: "text-sm min-h-[24px] px-3 py-1",
        lg: "text-base min-h-[32px] px-4 py-1.5"
      },
      intensity: {
        low: "shadow-sm",
        medium: "shadow-md",
        high: "shadow-lg animate-pulse hover:animate-bounce"
      },
      position: {
        "top-left": "absolute top-2 left-2 z-20",
        "top-right": "absolute top-2 right-2 z-20",
        "top-center": "absolute top-2 left-1/2 -translate-x-1/2 z-20",
        relative: "relative z-10"
      }
    },
    defaultVariants: {
      variant: "simple",
      badgeColor: "sale",
      size: "md",
      intensity: "medium",
      position: "relative"
    }
  }
);

const glowVariants = cva("", {
  variants: {
    badgeColor: {
      primary: "hover:shadow-[#7d3600]/30",
      secondary: "hover:shadow-gray-600/30",
      accent: "hover:shadow-blue-500/30",
      sale: "hover:shadow-red-500/30",
      hot: "hover:shadow-orange-500/30",
      new: "hover:shadow-green-500/30",
      limited: "hover:shadow-purple-500/30",
      subtle: "hover:shadow-gray-400/30"
    },
    intensity: {
      low: "hover:shadow-md",
      medium: "hover:shadow-lg",
      high: "hover:shadow-xl"
    }
  }
});

export interface DiscountBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  pulseOnHover?: boolean;
  glowEffect?: boolean;
}

const DiscountBadge = ({
  className,
  variant,
  badgeColor,
  size,
  intensity,
  position,
  children,
  pulseOnHover = false,
  glowEffect = true,
  ...props
}: DiscountBadgeProps) => {
  const shouldAnimate = intensity === "high" || pulseOnHover;
  
  return (
    <div
      className={cn(
        badgeVariants({ variant, badgeColor, size, intensity, position }),
        glowEffect && glowVariants({ badgeColor, intensity }),
        shouldAnimate && "hover:scale-105 active:scale-95",
        variant === "corner" && "absolute top-2 right-2 transform rotate-45",
        variant === "ribbon" && "transform -rotate-2 hover:rotate-0",
        className
      )}
      {...props}
    >
      <span className={cn(
        "relative z-10",
        variant === "corner" && "transform -rotate-45 text-xs font-extrabold"
      )}>
        {children}
      </span>
      
      {/* Shine effect for high intensity */}
      {intensity === "high" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />
      )}
      
      {/* Glow ring for special variants */}
      {(badgeColor === "hot" || badgeColor === "sale") && intensity === "high" && (
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-30 animate-pulse" />
      )}
    </div>
  );
};

export { DiscountBadge, badgeVariants };
