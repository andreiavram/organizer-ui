import { Component, OnInit } from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {TagService} from '../tag.service';
import {Tag} from '../tag';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  tags: Tag[] = []
  selectedTask?: Task;

  constructor(
    private taskService: TaskService,
    private tagService: TagService
  ) { }

  ngOnInit(): void {
    this.getTags();
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks()
      .subscribe(tasks => this.tasks = tasks);
  }

  getTags(): void {
    this.tagService.getTags()
      .subscribe(tags => this.tags = tags);
  }

  onSelect(task: Task): void {
    this.selectedTask = task;
  }
}
