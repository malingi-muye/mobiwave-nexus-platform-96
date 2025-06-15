
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: any;
  user_count: number;
  created_at: string;
  created_by: string;
  is_active: boolean;
}

interface CreateSegmentData {
  name: string;
  description: string;
  criteria: any;
}

export const useUserSegmentation = () => {
  const queryClient = useQueryClient();

  // Fetch user segments using direct table access
  const { data: segments = [], isLoading } = useQuery({
    queryKey: ['user-segments'],
    queryFn: async (): Promise<UserSegment[]> => {
      const { data, error } = await supabase
        .from('user_segments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createSegment = useMutation({
    mutationFn: async (segmentData: CreateSegmentData): Promise<UserSegment> => {
      const { data, error } = await supabase
        .from('user_segments')
        .insert({
          name: segmentData.name,
          description: segmentData.description,
          criteria: segmentData.criteria,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-segments'] });
      toast.success('User segment created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create segment: ${error.message}`);
    }
  });

  const deleteSegment = useMutation({
    mutationFn: async (segmentId: string) => {
      const { error } = await supabase
        .from('user_segments')
        .delete()
        .eq('id', segmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-segments'] });
      toast.success('Segment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete segment: ${error.message}`);
    }
  });

  const getSegmentUsers = async (segmentId: string) => {
    const { data, error } = await supabase
      .from('user_segment_members')
      .select(`
        *,
        profiles!inner(*)
      `)
      .eq('segment_id', segmentId);

    if (error) throw error;
    return data;
  };

  return {
    segments,
    isLoading,
    createSegment: createSegment.mutateAsync,
    deleteSegment: deleteSegment.mutateAsync,
    getSegmentUsers,
    isCreating: createSegment.isPending,
    isDeleting: deleteSegment.isPending
  };
};
