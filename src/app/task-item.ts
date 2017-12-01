export class TaskItem {
  id: number;
  title: string;
  description: string;

  startDate: Date;
  endDate: Date;
  completedDate: Date;
  estimatedTime: number;
  parentTask: TaskItem;

  order: number;

  createdDate: Date;
  changedDate: Date;

  status: string;
  completed: boolean;
  priority: number;

  owner: number;
  tags: any;
  projects: any;
}
