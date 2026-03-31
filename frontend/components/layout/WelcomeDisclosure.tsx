'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/authService';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { useState, useEffect } from 'react';

export default function WelcomeDisclosure() {
  const [showModal, setShowModal] = useState(false);

  const { data: user, isSuccess } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: AuthService.getMe,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });

  useEffect(() => {
    if (isSuccess && user && user.hasSeenWelcome === false) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isSuccess, user]);

  return (
    <WelcomeModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
    />
  );
}
