
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Survey {
  id: string;
  title: string;
  status: string;
  question_flow: any[];
  created_at: string;
  updated_at: string;
}

export const useSurveys = () => {
  const { data: surveys, isLoading, error } = useQuery({
    queryKey: ['surveys'],
    queryFn: async (): Promise<Survey[]> => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  return {
    surveys,
    isLoading,
    error
  };
};
