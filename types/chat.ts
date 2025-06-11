import type { Job } from "./job";
import type { User } from "./user";

export type Chat = {
  id: number;
  createdAt: string;
  updatedAt: string;
  jobId: number;
  participants: [
    {
      id: number;
      chatId: number;
      userId: number;
      joinedAt: string;
      lastReadAt: null | string;
      user: User;
    },
    {
      id: number;
      chatId: number;
      userId: number;
      joinedAt: string;
      lastReadAt: null | string;
      user: User;
    }
  ];
  job: Job;
  messages: ChatMessage[];
};

export type ChatMessage = {
  id: number;
  content: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  chatId: number;
  senderId: number;
  sender: Pick<User, "name">;
};
