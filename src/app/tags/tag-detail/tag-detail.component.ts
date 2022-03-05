import {Component, OnInit} from '@angular/core';
import {TagService} from '../tag.service';
import {Tag} from '../tag';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.css']
})
export class TagDetailComponent implements OnInit {
  tag: Tag | null = null;
  editMode: boolean = false
  color: string = "";

  constructor(
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    if (!!id) {
      this.getTag(id);
    } else {
      this.tag = <Tag> {
        name: "",
        color: "#FFFFFF",
        description: "",
        slug: "",
      }
      this.editMode = true;
    }

  }

  getTag(id: number): void {
    this.tagService.getTag(id)
      .subscribe(tag => this.tag = tag);
  }

  toggleEditMode(): void {
    if (this.editMode && this.tag) {
      if (this.tag.id) {
        this.tagService.updateTag(this.tag).subscribe((t: Tag) => {
          this.tag = t
        });
      } else {
        this.tagService.createTag(this.tag).subscribe((t: Tag) => {
          this.tag = t
        })
      }
    }
    this.editMode = !this.editMode;
  }

  updateTagSlug(): void {
    if (!this.tag)
      return

    this.tag.slug = this.tag?.name.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');
  }
}
