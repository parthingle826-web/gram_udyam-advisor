export interface EntrepreneurProfile {
  name?: string;
  age?: number;

  village?: string;
  block?: string;
  district?: string;
  state?: string;

  education?: string;
  experience?: string;

  availableCapital?: number;
  preferredBusiness?: string;

  phone?: string;
  email?: string;
}

export interface EntrepreneurEligibility {
  eligible: boolean;
  reasons: string[];
  recommendations: string[];
}