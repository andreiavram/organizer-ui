import { Component, OnInit, Input } from '@angular/core';
import {Task} from '../task';
import {TaskService} from '../task.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {TagService} from '../tag.service';
import {Observable, of} from 'rxjs';
import {Tag} from '../tag';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task?: Task;
  editMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private tagService: TagService,
    private location: Location)  { }

  ngOnInit(): void {
    this.getTask()
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.task) {
      this.taskService.updateTask(this.task).subscribe((t: Task) => { this.task = t});
    }
  }

  public searchTags(text: string): Observable<Tag[]> {
    console.log("task detail search tags");
    console.log(this);
    return this.tagService.searchTags(text);
  }

  getTask(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.taskService.getTask(id)
      .subscribe(task => this.task = task);
  }

}
