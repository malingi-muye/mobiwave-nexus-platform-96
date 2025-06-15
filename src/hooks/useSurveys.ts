
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: string;
  question_flow: any[];
  created_at: string;
  updated_at: string;
  user_id: string;
  expires_at?: string;
  published_at?: string;
  target_audience?: any;
  distribution_channels?: any[];
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  respondent_phone: string;
  responses: any;
  completed: boolean;
  started_at: string;
  completed_at?: string;
}

export const useSurveys = () => {
  const queryClient = useQueryClient();

  const { data: surveys, isLoading, error } = useQuery({
    queryKey: ['surveys'],
    queryFn: async (): Promise<Survey[]> => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createSurvey = useMutation({
    mutationFn: async (surveyData: Partial<Survey>) => {
      const { data, error } = await supabase
        .from('surveys')
        .insert([surveyData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create survey: ${error.message}`);
    }
  });

  const updateSurvey = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Survey> & { id: string }) => {
      const { data, error } = await supabase
        .from('surveys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey updated successfully');
    }
  });

  const publishSurvey = useMutation({
    mutationFn: async (surveyId: string) => {
      const { data, error } = await supabase
        .from('surveys')
        .update({ 
          status: 'active', 
          published_at: new Date().toISOString() 
        })
        .eq('id', surveyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey published successfully');
    }
  });

  return {
    surveys,
    isLoading,
    error,
    createSurvey,
    updateSurvey,
    publishSurvey,
    isCreating: createSurvey.isPending,
    isUpdating: updateSurvey.isPending
  };
};

export const useSurveyResponses = (surveyId?: string) => {
  return useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: async (): Promise<SurveyResponse[]> => {
      let query = supabase
        .from('survey_responses')
        .select('*')
        .order('started_at', { ascending: false });

      if (surveyId) {
        query = query.eq('survey_id', surveyId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!surveyId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
