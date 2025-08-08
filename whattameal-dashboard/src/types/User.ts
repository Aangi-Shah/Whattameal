export type User = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  createdBy?: string;
  createdByName?: string;
  updatedBy?: string;
  updatedByName?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UserAuth = {
  userName: string;
  password: string;
};

export type UserValidation = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
};
