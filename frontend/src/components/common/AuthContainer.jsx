export default function AuthContainer({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center pt-[110px] sm:pt-[130px] pb-16 sm:pb-24 px-4">
      {/* Background Cinematic Poster with dark blur overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px]" />
      </div>

      {/* Centered Glassmorphic Form Card */}
      <div className="relative z-10 w-full max-w-[460px] rounded-3xl bg-[#141414]/80 border border-white/10 shadow-2xl backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-center">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-[#B3B3B3] text-sm font-medium leading-relaxed">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}
