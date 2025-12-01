import Image from 'next/image';

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
        <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-4 border-card shadow-xl ring-2 ring-primary/20`}>
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 64px, (max-width: 1200px) 96px, 128px"
          />
        </div>
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
  