export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
