import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/agent.service';


export function retrieveDeepResearchHook() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['deepResearch'],
    queryFn: async () => {
      const response = await apiService.getDeepResearch();
      return response.agents;
    }
  });

  return {
    data,
    loading,
    error
  };
} 

