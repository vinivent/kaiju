'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProvider, useUser } from '@/contexts/UserContext';
import ProtectedNav from '@/components/ui/ProtectedNav';
import Loader from '@/components/ui/Loader';
function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <Loader />
        );
    }

    if (!user) {
        return null; // Vai redirecionar
    }

    return (
        <div>
            <ProtectedNav />
            <main>
                {children}
            </main>
        </div>
    );
}

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <ProtectedLayoutContent>
                {children}
            </ProtectedLayoutContent>
        </UserProvider>
    );
}