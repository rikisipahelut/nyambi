export type WorkerStatus = "available" | "busy";

export interface Category {
  id: string;
  icon: string;
  title: string;
  workerCount: string;
}

export interface Worker {
  id: string;
  categoryId: string;
  name: string;
  specialty: string;
  imageUrl: string;
  imageAlt: string;
  rating: number;
  tags: string[];
  status: WorkerStatus;
  location: string;
  bio: string;
  completedJobs: number;
  experienceYears: number;
  responseTime: string;
  services: string[];
}
