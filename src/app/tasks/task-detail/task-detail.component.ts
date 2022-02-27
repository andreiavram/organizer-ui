import { Component, OnInit, Input } from '@angular/core';
import {Task} from '../task';
import {TaskService} from '../task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {TagService} from '../../tags/tag.service';
import {Observable, of} from 'rxjs';
import {Tag} from '../../tags/tag';
import {Modal} from 'bootstrap';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task?: Task;
  editMode: boolean = false;
  deleteModal?: Modal;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    public tagService: TagService,
    private location: Location)  {

  }

  ngOnInit(): void {
    const deleteModalElement = document.getElementById('deleteModal') as HTMLElement;
    this.deleteModal = new Modal(deleteModalElement);

    this.getTask();
  }

  toggleEditMode(): void {
    if (this.editMode && this.task) {
      this.taskService.updateTask(this.task).subscribe((t: Task) => { this.task = t});
    }
    this.editMode = !this.editMode;
  }

  toggleCompleted(): void {
    if (this.task) {
      this.task.completed = !this.task.completed;
      this.taskService.updateTask(this.task).subscribe((t: Task) => { this.task = t });
    }
  }

  //  TODO: avoid this as it requires public access to TagService from the template
  public searchTags(tagService: TagService): (text: string) => Observable<Tag[]> {
    return (text: string) => { return tagService.searchTags(text) };
  }

  getTask(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.taskService.getTask(id)
      .subscribe(task => this.task = task);
  }

  deleteTask(): void {
    if (this.task && this.task.id) {
      this.taskService.deleteTask(this.task.id).subscribe(_ => {
        this.router.navigate(['tasks']);
      });
    }
  }
}
