export function DashboardAvatar({ user, size = "md", className = "" }) {
  const name = user?.name?.trim() || "User";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
  };

  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={name}
        className={`rounded-full object-cover ring-2 ring-white/10 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-200 ring-2 ring-white/10 ${sizeClasses[size]} ${className}`}>
      {initials}
    </div>
  );
}
