import {Tag} from './tag';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  completedDate?: Date;
  estimatedTime?: number;
  parentTask?: number;
  order?: number;
  createdDate?: Date;
  changedDate?: Date;
  status?: string;
  completed?: boolean;
  priority?: number;
  owner?: number; // todo: Update to User
  _tags?: Tag[];
  tags?: number[]; // for writing references
  project?: number // todo: Update to Project
}
