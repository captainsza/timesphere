import { Prisma } from "@prisma/client";

export type User = {
  id: string;
  username: string;
  password: string;
  email: string;
  schedules: Schedule[];
  points: number;
  badges: Badge[];
  level: number;
  rewards: Reward[];
  aiRecommendations: AIRecommendation[];
  companionState?: CompanionState | null;
  companionStateId?: string | null;
  leaderboards: Leaderboard[];
  uploads: Upload[]; // New field for user-generated content
  createdAt: Date;
  updatedAt: Date;
};

export type CompanionState = {
  id: string;
  state: string; // JSON or String to store state details
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

export type Schedule = {
  hour: number;
  id: string;
  title: string;
  description?: string | null;
  time: Date;
  icon: string;
  tasks: Task[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  title: string;
  startTime: Date;
  emoji: string;
  endTime: Date;
  completed: boolean;
  scheduleId: string;
  schedule: Schedule;
  uploads: Upload[]; // New field for uploads linked to tasks
  createdAt: Date;
  updatedAt: Date;
};

export type Upload = {
  id?: string;
  url?: string;
  type?: string;
  taskId?: string;
  task?: Task;
  userId?: string;
  user?: User;
  createdAt?: Date;
};

export type Reward = {
  id: string;
  type: string;
  points: number;
  userId: string;
  user: User;
  createdAt: Date;
};

export type Badge = {
  id: string;
  name: string;
  description?: string | null;
  icon: string;
  userId: string;
  user: User;
  createdAt: Date;
};

export type AIRecommendation = {
  id: string;
  message: string;
  userId: string;
  user: User;
  createdAt: Date;
};

export type Leaderboard = {
  id: string;
  points: number;
  email: string;
  rank: number;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

// Extend Prisma namespace for auto-completion and type safety
declare module "@prisma/client" {
  interface PrismaClient {
    user: Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    companionState: Prisma.CompanionStateDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    schedule: Prisma.ScheduleDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    task: Prisma.TaskDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    upload: Prisma.UploadDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    reward: Prisma.RewardDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    badge: Prisma.BadgeDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    aiRecommendation: Prisma.AIRecommendationDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    leaderboard: Prisma.LeaderboardDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
  }
}
