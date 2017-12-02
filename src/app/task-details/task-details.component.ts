import {Component, Input, OnInit} from '@angular/core';
import {TaskItemService} from '../task-item.service';
import {TagService} from '../tag.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TaskItem} from '../task-item';
import {plainToClass} from 'class-transformer';
import 'rxjs/add/operator/switchMap';
import {Location} from '@angular/common';
import {forEach} from '@angular/router/src/utils/collection';
import {Tag} from '../tag';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: TaskItem;

  constructor(
    private taskService: TaskItemService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.taskService.getTaskItem(+params.get('id')))
      .subscribe(task => {
        this.task = plainToClass(TaskItem, task);
        let tags: Tag[] = []
        for(let tag_id of task.tags) {
          this.tagService.getTag(tag_id).then(tag => tags.push(tag));
        }
        this.task.tags = tags;
      });
  }

}
