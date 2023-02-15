import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../project.service';
import {UntypedFormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Project} from '../project';
import {TagService} from '../../tags/tag.service';
import {Observable, throwError} from 'rxjs';
import {Tag} from '../../tags/tag';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm = this.formBuilder.group({
      id: [null],
      slug: [null],
      title: ['', [Validators.required]],
      description: [''],
      start_date: [null],
      end_date: [null],
      _tags: ['']
    }
  )

  project: Project | null = null;
  showErrors: boolean = false;

  constructor(
    private projectService: ProjectService,
    private formBuilder: UntypedFormBuilder,
    public tagService: TagService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getProject(projectId).subscribe(project => {
        this.project = project
        if (this.project) {
          //  using patch value here because Project has additional fields that the form
          //  complains about otherwise (.tags, in this case)
          this.projectForm.patchValue(this.project);

          const azi = new Date();
          this.projectForm.get("start_date")?.setValue({"year": azi.getFullYear(), "month": azi.getMonth(), "day": azi.getDay()});
        }
      })
    } else {
      this.projectService.clearProject();
    }
  }

  updateSlug(): void {
    let value = this.projectForm.get("title")?.value;
    if (value) {
      this.projectForm.get("slug")?.setValue(value.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')
      )
    } else {
      this.projectForm.get("slug")?.setValue("")
    }
  }

  applyErrorsOnForm(form: UntypedFormGroup, errors: {error: any}): void {
    Object.keys(errors.error).forEach(field => {
      const formControl = form.get(field);
      if (formControl) {
        formControl.setErrors({
          serverError: errors.error[field]
        });
        console.log(formControl.errors);
      }
    });

    form.setErrors({
      serverError: errors.error['non_field_errors']
    })
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.showErrors = true;
      console.log(this.projectForm.get("start_date")?.errors)
      return;
    }

    this.projectService
      .createProject(<Project>this.projectForm.value)
      .pipe(catchError(errors => {
        this.applyErrorsOnForm(this.projectForm, errors);
        this.showErrors = true;
        return throwError(errors);
      }))
      .subscribe(newProject => {
        this.project = newProject;
        this.showErrors = false;
        this.router.navigate(['projects', this.project.id]);
      }, error => {
        this.showErrors = true;
      });
  }

  public searchTags(): (text: string) => Observable<Tag[]> {
    return (text: string) => {
      return this.tagService.searchTags(text)
    };
  }

  public onDateSelect(date: NgbDate): void {
    console.log(date);
  }

}
