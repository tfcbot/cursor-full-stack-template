'use client';

import { useState } from 'react';
import { initiateCheckout } from '../services/creditService';
import { useAuth } from './useAuth';


export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAuthToken } = useAuth();

  const startCheckout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }
      const { url } = await initiateCheckout(token);
      
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