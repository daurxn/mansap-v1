export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface ProjectsResponse {
  data: Project[];
  message: string;
}
