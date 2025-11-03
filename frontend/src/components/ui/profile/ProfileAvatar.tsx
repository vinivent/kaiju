interface ProfileAvatarProps {
    name: string;
    avatar?: string;
    size?: 'sm' | 'md' | 'lg';
  }
  
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  };
  
  export function ProfileAvatar({ name, avatar, size = 'lg' }: ProfileAvatarProps) {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border-4 border-card shadow-xl ring-2 ring-primary/20`}
        />
      );
    }
  
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-4 border-card shadow-xl ring-2 ring-primary/20`}
        style={{ background: 'var(--gradient-primary)' }}
      >
        <span className="font-bold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
  