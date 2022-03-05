import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from '../message.service';
import {TagService} from '../tags/tag.service';
import {Observable} from 'rxjs';
import {Project} from './project';
import {catchError, tap} from 'rxjs/operators';
import {ServiceBase} from '../service-base';
import {Tag} from '../tags/tag';
import {Task} from '../tasks/task';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends ServiceBase {
  private projectsURL = 'http://127.0.0.1:8000/api/project/'

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private http: HttpClient,
    protected messageService: MessageService,
    private tagService: TagService) {
    super(messageService);
  }

  processTagsToServer(project: Project): void {
    project.tags = [];
    if (project._tags) {
      project.tags = project._tags.map(tag => tag.id)
    }
  }

  processTagsFromServer(project: Project): void {
    if (project.tags.length) {
      let tagSolver = this.tagService.getTagsByID(project.tags)
      tagSolver.subscribe((tags: Tag[]) => {
        project._tags = tags;
      })
      // prject.tagSolver$ = tagSolver;
    } else {
      project._tags = []
    }
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsURL)
      .pipe(
        tap((projects: Project[]) => projects.map((project: Project) => {
          this.processTagsFromServer(project);
          return project;
        })),
        tap(_ => this.log(`fetched ${_.length} projects`)),
        catchError(this.handleError<Project[]>('getProjects', []))
      )
  }

  getDetailURL(project_id: number | string): string {
    return `${this.projectsURL}${project_id}/`;
  }

  getProject(project_id: number | string): Observable<Project> {
    const url = this.getDetailURL(project_id);
    return this.http.get<Project>(url)
      .pipe(
        tap((project: Project) => {
          this.processTagsFromServer(project);
        }),
        tap(_ => this.log(`fetched project ${_.id}`)),
        catchError(this.handleError<Project>('getProject'))
    )
  }

  createProject(project: Project): Observable<Project> {
    const url = this.projectsURL;

    this.processTagsToServer(project);
    return this.http.post<Project>(url, project, this.httpOptions)
      .pipe(
        tap((newProject: Project) => {
          this.processTagsFromServer(newProject);
        }),
        tap((newproject: Project) => this.log(`added project id=${newproject.id}`)),
        catchError(this.handleError<Project>('create Project'))
      )
  }

  updateProject(project: Project): Observable<Project> {
    const url = this.getDetailURL(project.id || 0);

    this.processTagsToServer(project);
    return this.http.put<Project>(url, project, this.httpOptions)
      .pipe(
        tap((updatedProject: Project) => {
          this.processTagsFromServer(updatedProject);
        }),
        tap((updatedProject: Project) => this.log(`updated project id=${updatedProject.id}`)),
        catchError(this.handleError<Project>('update Project'))
      )
  }

  deleteProject(project: Project): Observable<Project> {
    const url = this.getDetailURL(project.id || 0);
    return this.http.delete<Project>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted project ${_.id}`)),
        catchError(this.handleError<Project>('deleteProject'))
      )
  }
}
