
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Survey {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  question_flow: any[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  target_audience: any;
  distribution_channels: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  expires_at?: string;
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

  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: async (): Promise<Survey[]> => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        question_flow: Array.isArray(item.question_flow) ? item.question_flow : [],
        target_audience: item.target_audience || {},
        distribution_channels: Array.isArray(item.distribution_channels) ? item.distribution_channels : [],
        status: item.status as 'draft' | 'active' | 'paused' | 'completed'
      }));
    }
  });

  const createSurvey = useMutation({
    mutationFn: async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('surveys')
        .insert({ ...surveyData, user_id: user.id })
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
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update survey: ${error.message}`);
    }
  });

  const publishSurvey = useMutation({
    mutationFn: async (surveyId: string) => {
      const { data, error } = await supabase
        .from('surveys')
        .update({ 
          status: 'active', 
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
    },
    onError: (error: any) => {
      toast.error(`Failed to publish survey: ${error.message}`);
    }
  });

  return {
    surveys,
    isLoading,
    createSurvey: createSurvey.mutateAsync,
    updateSurvey: updateSurvey.mutateAsync,
    publishSurvey: publishSurvey.mutateAsync,
    isCreating: createSurvey.isPending,
    isUpdating: updateSurvey.isPending,
    isPublishing: publishSurvey.isPending
  };
};

export const useSurveyResponses = (surveyId?: string) => {
  const { data: responses = [], isLoading } = useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: async (): Promise<SurveyResponse[]> => {
      if (!surveyId) return [];
      
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!surveyId
  });

  return { responses, isLoading };
};
