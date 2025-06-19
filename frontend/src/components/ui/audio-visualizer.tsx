
const AudioVisualizer = ({ barCount = 5 }) => {
  const bars = Array.from({ length: barCount });

  return (
    <div className="flex items-end gap-0.5 h-3.5 w-7">
      {bars.map((_, i) => (
        <div
          key={i}
          className="animate-bounceBar bg-green-400"
          style={{
            width: "2px",
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.8 + (i % 3) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
