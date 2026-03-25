import { ShoppingBag } from "lucide-react";
import { InProgressPage } from "@/components/InProgress";

export default function ShopPage() {
  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#0a1220" }}>
      <div className="h-12 shrink-0 flex items-center px-4 gap-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#0a1220" }}>
        <ShoppingBag className="w-5 h-5 text-[#949ba4]" />
        <span className="text-[#f2f3f5] font-semibold text-[16px]">Shop</span>
      </div>
      <InProgressPage title="Shop" subtitle="The Discord Shop is currently being built. Check back soon for avatar decorations, profile effects, and more." />
    </div>
  );
}
