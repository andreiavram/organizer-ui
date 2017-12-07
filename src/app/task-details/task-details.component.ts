import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TaskItemService} from '../task-item.service';
import {TagService} from '../tag.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TaskItem} from '../task-item';
import {plainToClass} from 'class-transformer';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import {Location} from '@angular/common';
import {Tag} from '../tag';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: TaskItem = new TaskItem();

  public taskChanged = new Subject<string>();

  constructor(
    private taskService: TaskItemService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    const subscription = this.taskChanged
      .map(event => {
        const e = event as any;
        return e.target;
      })
      .debounceTime(750)
      .distinctUntilChanged()
      .flatMap(search => Observable.of(search).delay(500))
      .subscribe(this.save.bind(this));
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.taskService.getTaskItem(+params.get('id')))
      .subscribe(task => {
        this.task = plainToClass(TaskItem, task);
        const tags: Tag[] = []
        for (const tag_id of task.tags) {
          this.tagService.getTag(tag_id).then(tag => tags.push(tag));
        }
        this.task.tags = tags;
      });
  }

  save(): void {
    console.log(this.task);
  }

  requestAutocompleteTagItems(text: string): Observable<Tag[]> {
    return this.tagService.searchTagObservable(text);
  }

  processTag(tag: Tag): Observable<Tag> {
    return Observable.of(tag)
      .map(t => plainToClass(Tag, t as Tag));
  }

}
