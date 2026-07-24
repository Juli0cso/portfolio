export default function BackgroundGrid() {
  return (
    <div className="fixed inset-0 z-[-1] bg-grid pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
    </div>
  );
}
