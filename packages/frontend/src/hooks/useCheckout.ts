'use client';

import { useState } from 'react';
import { initiateCheckout } from '../services/creditService';
import { useRouter } from 'next/navigation';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startCheckout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { url } = await initiateCheckout();
      
      // Redirect to the checkout URL
      if (url) {
        window.location.href = url;
      } else {
        setError('Invalid checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startCheckout,
    isLoading,
    error
  };
} 