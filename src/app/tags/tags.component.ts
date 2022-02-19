import { Component, OnInit } from '@angular/core';
import {Tag} from '../tag';
import {TagService} from '../tag.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  tags: Tag[] = [];
  selectedTag: Tag | null = null;

  constructor(
    private tagService: TagService,
  ) { }

  ngOnInit(): void {
    this.getTags();
  }

  getTags(): void {
    this.tagService.getTags()
      .subscribe(tags => this.tags = tags)
  }

  onSelect(tag: Tag): void {
    this.selectedTag = tag;
  }

}
