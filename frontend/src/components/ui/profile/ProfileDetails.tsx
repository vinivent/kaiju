import { UserResponse } from "@/features/user/model";

interface ProfileDetailsProps {
  user: UserResponse;
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="px-6 pb-6 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <p className="text-foreground">{user.email}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Membro desde
          </label>
          <p className="text-foreground">
            {new Date(user.createdAt).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
