
import { useServiceActivationRequests } from './useServiceActivationRequests';
import { useUserServiceActivations } from './useUserServiceActivations';
import { useMyActivatedServices } from './useMyActivatedServices';
import { useServiceActivationMutations } from './useServiceActivationMutations';

export function useServiceActivation() {
  const { data: activationRequests = [], isLoading: requestsLoading } = useServiceActivationRequests();
  const { data: userActivations = [], isLoading: activationsLoading } = useUserServiceActivations();
  const { data: myActivatedServices = [], isLoading: myServicesLoading } = useMyActivatedServices();
  
  const {
    requestServiceActivation,
    approveServiceRequest,
    rejectServiceRequest,
    deactivateUserService
  } = useServiceActivationMutations();

  return {
    activationRequests,
    userActivations,
    myActivatedServices,
    isLoading: requestsLoading || activationsLoading || myServicesLoading,
    requestServiceActivation: requestServiceActivation.mutateAsync,
    approveServiceRequest: approveServiceRequest.mutateAsync,
    rejectServiceRequest: rejectServiceRequest.mutateAsync,
    deactivateUserService: deactivateUserService.mutateAsync,
    isRequesting: requestServiceActivation.isPending,
    isApproving: approveServiceRequest.isPending,
    isRejecting: rejectServiceRequest.isPending,
    isDeactivating: deactivateUserService.isPending
  };
}
