import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {TagService} from '../../tags/tag.service';
import {Tag} from '../../tags/tag';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {forkJoin, Observable, of} from 'rxjs';
import {TaskFilters} from '../task-filters';
import {map, mergeMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  tags: Tag[] = []
  selectedTask?: Task;
  taskInput: string = "";
  filters: {[k: string]: boolean} = {};
  activeTaskCount = 0;

  @Input() filters_tags: Tag[] | null = null;
  @Input() for_tag: Tag | null = null;

  constructor(
    private taskService: TaskService,
    private tagService: TagService
  ) { }

  ngOnInit(): void {
    this.getTags();

    this.filters = {
      "today": false,
      "completed": false,
      "todo": true,
    }
    this.getTasks();
  }

  toggleFilters(filter: string): void {
    if (!(filter in this.filters)) return;
    this.filters[filter] = !this.filters[filter];
    this.getTasks();
  }

  processFilters(useCompletedDate:boolean = false): TaskFilters {
    let completed: boolean | null = null;
    if (this.filters['completed'] != this.filters['todo']) {
      completed = this.filters['completed']
    }

    let forToday: boolean | null = this.filters['today'] ? true : null;

    let tags: Tag[] | null = this.filters_tags || null;

    let completed_date: Date | null = null;
    if (useCompletedDate) {
      completed_date = new Date()
      //  completed date task-list have forToday disabled
      forToday = null;
    }

    return new TaskFilters(completed, null, completed_date, tags, forToday);

  }

  getTasks(): void {
    let tasks$: Observable<Task[]>;
    if (this.filters['today'] && this.filters['completed']) {
      //  have to do 2 calls to the API
      let filtersNoDate = this.processFilters(false);
      let filtersDate = this.processFilters(true);
      tasks$ = forkJoin([this.taskService.getTasks(filtersNoDate),
        this.taskService.getTasks(filtersDate)]).pipe(
          map((taskResponses: [Task[], Task[]]) => [...taskResponses[0], ...taskResponses[1]])
      )
    } else {
      let filters = this.processFilters();
      tasks$ = this.taskService.getTasks(filters);
    }

    tasks$
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
      for_today: this.filters["today"],
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

    // have to resolve tags-list to IDs
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

  toggleTaskDone (task: Task): void {
    if (!task) return;
    this.activeTaskCount += task.completed ? 1 : -1
    task.completed = !task.completed;
    if (task.completed && task.for_today) task.for_today = false;
    this.taskService.updateTask(task).subscribe((t: Task) => { task = t })

    if ((!this.filters['completed'] && this.filters['todo']) ||
      (!this.filters['todo'] && this.filters['completed']))  {
      this.tasks = this.tasks.filter((task: Task) => this.filters['todo'] ? !task.completed : task.completed)
    }
  }

  toggleTaskToday(task: Task): void {
    if (!task || task.completed) return;
    task.for_today = !task.for_today;
    this.taskService.updateTask(task).subscribe((t: Task) => { task = t })
    if (this.filters["today"]) {
      this.tasks = this.tasks.filter((task: Task) => task.for_today)
    }
  }

}
