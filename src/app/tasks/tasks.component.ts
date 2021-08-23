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
      tags: []
    }

    if (tags === undefined) {
      this.taskService.addTask(task as Task).subscribe((task: Task) => this.tasks.push(task));
      return;
    }

    let parsed_tags: string[] = tags.split(/\s*(?:,|$)\s*/);
    console.log(parsed_tags);
    let tags$: Observable<Tag[]>[] = [];

    // have to resolve tags to IDs
    parsed_tags.forEach((tag: string) => tags$.push(this.tagService.getTagBySlug(tag)))
    forkJoin(tags$).subscribe( (res_tags: Tag[][]) => {
      res_tags.forEach((tags: Tag[]) => {
        task.tags?.push(tags[0].id);
        console.log(tags);
      });
      this.taskService.addTask(task as Task).subscribe((task: Task) => this.tasks.push(task));
    });
  }

  // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
  getTagTextColor (bgColor: string, lightColor = '#FFFFFF', darkColor = '#000000') {
    const getLuminance = function (hexColor: string) {
      if(hexColor === "#FFFFFF") return 1.;
      if(hexColor === "#000000") return 0.;

      let color = (hexColor.charAt(0) === '#') ? hexColor.substring(1, 7) : hexColor
      let r = parseInt(color.substring(0, 2), 16) // hexToR
      let g = parseInt(color.substring(2, 4), 16) // hexToG
      let b = parseInt(color.substring(4, 6), 16) // hexToB
      let uicolors = [r / 255, g / 255, b / 255]
      let c = uicolors.map(col => col <= 0.03928 ? col / 12.92 : ((col + 0.055) / 1.055) ** 2.4)

      return (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    }

    let L = getLuminance(bgColor)
    let L1 = getLuminance(lightColor)
    let L2 = getLuminance(darkColor)

    return (L > Math.sqrt((L1 + 0.05) * (L2 + 0.05)) - 0.05) ? darkColor : lightColor;
  }

}
