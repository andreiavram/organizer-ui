import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../project.service';
import {FormBuilder} from '@angular/forms';
import {Project} from '../project';
import {TagService} from '../../tags/tag.service';
import {Observable} from 'rxjs';
import {Tag} from '../../tags/tag';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm = this.formBuilder.group({
      id: [null],
      slug: [null],
      title: [''],
      description: [''],
      start_date: [null],
      end_date: [null],
      _tags: ['']
    }
  )

  project: Project | null = null;

  constructor(
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    public tagService: TagService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getProject(projectId).subscribe(project => {
        this.project = project;
        this.projectForm.setValue(this.project);
      });
    }
  }

  onSubmit(): void {
    console.log(<Project>this.projectForm.value);
    this.projectService
      .createProject(<Project>this.projectForm.value)
      .subscribe((newProject => {
        this.project = newProject;
        this.router.navigate(['projects', this.project.id]);
      }));
  }

  public searchTags(): (text: string) => Observable<Tag[]> {
    return (text: string) => {
      return this.tagService.searchTags(text)
    };
  }

}
