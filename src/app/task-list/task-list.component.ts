import {Component, OnInit} from '@angular/core';
import {TaskItem} from '../task-item';
import {TaskItemService} from '../task-item.service';
import {Router} from '@angular/router';
import {Tag} from '../tag';
import {TagService} from '../tag.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[];

  constructor(
    private taskService: TaskItemService,
    private tagService: TagService,
    private router: Router) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTaskItems().then(tasks => {
      this.tasks = tasks;
      //  bring Tags as well
      for (let task of this.tasks) {
        let tags:Tag[] = [];
        for (let tag_id of task.tags) {
          this.tagService.getTag(tag_id).then(tag => tags.push(tag));
        }
        task.tags = tags;
      }
    });
  }

}
