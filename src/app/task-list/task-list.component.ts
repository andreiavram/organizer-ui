import { Component, OnInit } from '@angular/core';
import {TaskItem} from "../task-item";
import {TaskItemService} from "../task-item.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[];

  constructor(
    private taskService: TaskItemService,
    private router: Router) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTaskItems().then(tasks => this.tasks = tasks);
  }

}
