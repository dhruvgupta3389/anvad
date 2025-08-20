import { useState, useEffect } from "react";
import { Clock, Gift, ShoppingBag, Sparkles } from "lucide-react";

const AnnouncementBar = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [saleEnded, setSaleEnded] = useState(false);

  // Your sale end date
  const endDate = "2025-08-15T23:59:59Z";

  useEffect(() => {
    const deadline = new Date(endDate).getTime();
    let interval: NodeJS.Timeout;
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, deadline - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
      if (diff === 0) {
        setSaleEnded(true);
        clearInterval(interval);
      }
    };
    updateTimer();
    interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={`fixed top-0 w-full z-[60] bg-gradient-to-r from-[#7d3600] via-[#b84d00] to-[#7d3600] text-white py-3 px-4 text-center text-sm shadow-lg transition-transform duration-500 ease-in-out ${
      isScrolled ? '-translate-y-full' : 'translate-y-0'
    }`}>
      {/* Premium Border */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
      
      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Close Button */}
        {/* <button
          onClick={() => setVisible(false)}
          className="absolute left-2 sm:left-4 p-1 rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-white/90 hover:text-white"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button> */}

        {/* Message */}
        <div className="flex items-center gap-2 font-medium text-center sm:text-left pl-8 sm:pl-0">
          {saleEnded ? (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-300" />
              <span className="text-xl font-bold text-red-200 bg-red-900/30 px-4 py-2 rounded-lg shadow-inner border border-red-400/50">
                🛑 SALE IS ENDED
              </span>
            </div>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                <Gift className="w-4 h-4 text-yellow-300" />
              </div>
              <span className="text-white">
                <span className="font-bold text-yellow-200 bg-white/10 px-2 py-1 rounded-md shadow-inner">
                  🚚 FLAT 15% OFF
                </span>
                <span className="mx-2 text-white/80">•</span>
                <span className="text-white/95">
                  Use Code: <strong className="bg-yellow-300 text-[#7d3600] px-2 py-1 rounded font-bold shadow-sm">MONSOON15</strong>
                </span>
                <span className="mx-2 hidden sm:inline text-white/80">•</span>
                <span className="block sm:inline mt-1 sm:mt-0 text-white/95">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Sale ends in:
                </span>
              </span>
            </>
          )}
        </div>

        {/* Countdown */}
        {!saleEnded && (
          <div className="flex items-center gap-1 text-sm font-bold">
            {timeLeft.days > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <span className="px-2 py-1 bg-white text-[#7d3600] rounded-lg font-bold min-w-[32px] shadow-md border border-yellow-300">
                    {pad(timeLeft.days)}
                  </span>
                  <span className="text-xs mt-0.5 text-yellow-200 font-medium">days</span>
                </div>
                <span className="text-yellow-300 mx-1 font-bold">:</span>
              </>
            )}
            <div className="flex flex-col items-center">
              <span className="px-2 py-1 bg-white text-[#7d3600] rounded-lg font-bold min-w-[32px] shadow-md border border-yellow-300">
                {pad(timeLeft.hours)}
              </span>
              <span className="text-xs mt-0.5 text-yellow-200 font-medium">hrs</span>
            </div>
            <span className="text-yellow-300 mx-1 font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="px-2 py-1 bg-white text-[#7d3600] rounded-lg font-bold min-w-[32px] shadow-md border border-yellow-300">
                {pad(timeLeft.minutes)}
              </span>
              <span className="text-xs mt-0.5 text-yellow-200 font-medium">min</span>
            </div>
            <span className="text-yellow-300 mx-1 font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="px-2 py-1 bg-white text-[#7d3600] rounded-lg font-bold min-w-[32px] shadow-md animate-pulse border border-yellow-300">
                {pad(timeLeft.seconds)}
              </span>
              <span className="text-xs mt-0.5 text-yellow-200 font-medium">sec</span>
            </div>
          </div>
        )}

        {/* Shop Now Button */}
        {!saleEnded && (
          <a
            href="/shop"
            className="ml-0 sm:ml-4 bg-yellow-300 text-[#7d3600] px-6 py-2 rounded-full text-sm font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 whitespace-nowrap border border-yellow-400"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop Now!
          </a>
        )}
      </div>

      {/* Enhanced animated background pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent -skew-x-12 animate-shimmer"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1 left-10 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-2 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1 left-1/3 w-1 h-1 bg-yellow-200 rounded-full animate-ping delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
