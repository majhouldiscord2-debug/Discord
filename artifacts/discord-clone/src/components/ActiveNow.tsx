export function ActiveNow() {
  return (
    <div className="w-[250px] lg:w-[360px] h-full bg-sidebar border-l border-white/5 hidden md:flex flex-col shrink-0 p-4">
      <h2 className="font-bold text-foreground text-xl mb-4 tracking-tight">Active Now</h2>
      
      <div className="flex flex-col items-center justify-center text-center mt-10 p-4">
        <h3 className="font-semibold text-foreground mb-1 text-base">It's quiet for now...</h3>
        <p className="text-sm text-muted">When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!</p>
      </div>
    </div>
  );
}
