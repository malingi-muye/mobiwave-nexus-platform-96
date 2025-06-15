
import { useMyActivatedServices } from "@/hooks/useMyActivatedServices";

/**
 * Returns a set of service_types that the user has activated.
 */
export function useActivatedServiceTypes() {
  const { data: activated = [], isLoading } = useMyActivatedServices();
  // activated.service?.service_type may exist or fallback empty
  const types = new Set<string>();
  activated.forEach(act => {
    if (act.service && act.service.service_type) {
      types.add(act.service.service_type);
    }
  });
  return { activatedTypes: types, isLoading };
}
