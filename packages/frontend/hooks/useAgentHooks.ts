import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/agent.service';


export function retrieveContentHook() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const response = await apiService.getContent();
      return response.agents;
    }
  });

  return {
    data,
    loading,
    error
  };
} 

