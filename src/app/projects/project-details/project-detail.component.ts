import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../tasks/task.service';
import {TagService} from '../../tags/tag.service';
import {ProjectService} from '../project.service';
import {Project} from '../project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService

  ) { }

  ngOnInit(): void {
    this.getProject();
  }

  getProject(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.projectService.getProject(id)
      .subscribe(project => this.project = project);
  }



}
