import type { JobApplication } from "./application";

export type Job = {
  id: number;
  name: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  tags: { id: number; name: string }[];
  salary: number;
  unit: "HOUR" | "DAY" | "PROJECT";
  experienceLevel: "JUNIOR" | "MID" | "SENIOR";
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  location: { id: number; name: string };
  locationId: number;
  applicationDeadline?: string;
  isRemote?: boolean;
  companyInfo?: string;
  createdAt: string;
  filledById: number;
  postedById: number;
  applied: boolean;
  is_applicable: boolean;
  applications: JobApplication[];
  postedBy: { name: string; email: string; id: number };
  _count: {
    applications: number;
  };
};
