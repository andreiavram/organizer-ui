import { Component, OnInit } from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {TagService} from '../tag.service';
import {Tag} from '../tag';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {forkJoin, Observable} from 'rxjs';
import {TaskFilters} from '../task-filters';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  tags: Tag[] = []
  selectedTask?: Task;
  taskInput: string = "";
  filters: {[k: string]: boolean} = {};
  activeTaskCount = 0;

  constructor(
    private taskService: TaskService,
    private tagService: TagService
  ) { }

  ngOnInit(): void {
    this.getTags();

    this.filters = {
      "today": false,
      "completed": false,
      "todo": true
    }
    this.getTasks();
  }

  toggleFilters(filter: string): void {
    if (!(filter in this.filters)) return;
    this.filters[filter] = !this.filters[filter];
    this.getTasks();
  }

  processFilters(): TaskFilters {
    let completed: boolean | null = null;
    if (this.filters['completed'] && this.filters['todo']) {
      completed = null
    } else if (this.filters['todo']) {
      completed = false;
    } else if (this.filters['completed']) {
      completed = true;
    }

    if (this.filters['today']) {
      //  this should highlight tasks in the Today list, once that feature is available on the BE
    }

    let filters = new TaskFilters(completed);
    return filters;
  }

  getTasks(): void {
    let filters = this.processFilters();
    this.taskService.getTasks(filters)
      .subscribe(tasks => {
        this.tasks = tasks
        this.activeTaskCount = 0
        tasks.forEach((task: Task) => {
          this.activeTaskCount += task.completed ? 0 : 1
        })
      });
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
      this.taskInput = "";
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

    this.taskInput = "";
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
      this.activeTaskCount += task.completed ? 1 : -1
      task.completed = !task.completed;
      this.taskService.updateTask(task).subscribe((t: Task) => { task = t })
    }
  }

}
