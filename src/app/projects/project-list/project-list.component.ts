import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../project.service';
import {Project} from '../project';
import {ReverseLuminanceColorPipe} from '../../reverse-luminance-color.pipe';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] | null = null;

  private luminancePipe: ReverseLuminanceColorPipe = new ReverseLuminanceColorPipe()

  constructor(
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.getAllProjects();
  }

  reverseLuminance(color: string) {
    return this.luminancePipe.transform(color)
  }

  getAllProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects: Project[]) => {
        this.projects = projects;
      }
    )
  }

  onSelect(project: Project): void {
    return;
  }

}
