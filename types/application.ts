import type { Job } from "./job";
import type { Resume } from "./resume";

export type JobApplication = {
  id: number;
  jobId: number;
  applicant: { name: string };
  applicantId: number;
  resumeId: number;
  resume: Resume;
  coverLetter: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  job: Job;
};
