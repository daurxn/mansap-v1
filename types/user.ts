import type { Role } from "./role";

export type User = {
  id: number;
  role: Role;
  name: string;
  email: string;
};
