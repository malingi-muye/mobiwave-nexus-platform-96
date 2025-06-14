
export interface ServiceActivationRequest {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  service: {
    service_name: string;
    service_type: string;
    description: string;
  };
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface UserServiceActivation {
  id: string;
  user_id: string;
  service_id: string;
  is_active: boolean;
  activated_at: string;
  service: {
    service_name: string;
    service_type: string;
  };
}
