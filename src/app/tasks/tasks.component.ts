import { Component, OnInit } from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {TagService} from '../tag.service';
import {Tag} from '../tag';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  tags: Tag[] = []
  selectedTask?: Task;
  task_input: string = "";

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
      .subscribe(tasks => {this.tasks = tasks});
  }

  getTags(): void {
    this.tagService.getTags()
      .subscribe(tags => this.tags = tags);
  }

  onSelect(task: Task): void {
    this.selectedTask = task;
  }

  addTask(taskDescription: string): void {
    let tag_re = /^(?<title>.+?)(@tags\((?<tags>[\w ,-]+)\))?$/ui;
    let matches = taskDescription.match(tag_re);

    let tags: string | undefined = matches?.groups?.tags;
    let title: string | undefined = matches?.groups?.title;

    if (!title) {
      return;
    }

    let task: Task = {
      title: title,
      tags: [],
      _tags: []
    }

    if (tags === undefined) {
      this.taskService.addTask(task as Task).subscribe((task: Task) => this.tasks.push(task));
      return;
    }

    let parsed_tags: string[] = tags.split(/\s*(?:,|$)\s*/);
    let tags$: Observable<Tag[]>[] = [];

    // have to resolve tags to IDs
    parsed_tags.forEach((tag: string) => tags$.push(this.tagService.getTagBySlug(tag)))
    forkJoin(tags$).subscribe( (res_tags: Tag[][]) => {
      res_tags.forEach((tags: Tag[]) => {
        if (tags.length) {
          task.tags.push(tags[0].id);
          task._tags.push(tags[0]);
        }
      });
      this.taskService.addTask(task as Task).subscribe((task: Task) => this.tasks.unshift(task));
    });

    this.task_input = "";
  }

  deleteTask(task: Task): void {
    if (task.id != null) {
      this.taskService.deleteTask(task.id).subscribe();
    }

    const taskIndex = this.tasks.findIndex(t => t.id === task.id)
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
    }

  }

  toggleTaskDone (task: Task) {
    if (task) {
      task.completed = !task.completed;
      this.taskService.updateTask(task).subscribe((t: Task) => { task = t })
    }
  }

}
