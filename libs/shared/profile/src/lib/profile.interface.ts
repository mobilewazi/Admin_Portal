export interface IProfileUser {
  id: number;
  email: string;
  phoneNumber: string | null;
  name: string;
  avatar: string | null;
  userAlt: string;
  isRegisteredWith: string;
  isEmailConfirmed: boolean;
  isPhoneNumberConfirmed: boolean;
  canViewReport: boolean;
  createdAt: string; // Assuming this is a date string
  updatedAt: string; // Assuming this is a date string
}
