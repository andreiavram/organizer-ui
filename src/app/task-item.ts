import {Tag} from './tag';

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
  tags: Tag[];
  projects: any;

  _tags: number[];

  priority_icon(): string {
    return {
        1: 'fa-arrow-circle-down yellow',
        4: 'fa-arrow-circle-up red', 2: ''
    }[this.priority];
  }
}
