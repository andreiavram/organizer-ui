import {Tag} from './tag';
import {query} from '@angular/animations';

export class TaskFilters {
  [k: string]: any;

  completed: boolean | null;
  contains: string | null;
  completed_date: Date | null;
  tags: Tag[] | null;

  constructor(completed: boolean | null = null,
              contains: string | null = null,
              completed_date: Date | null = null,
              tags: Tag[] | null = null) {
    this.completed = completed;
    this.contains = contains;
    this.completed_date = completed_date;
    this.tags = tags;
  }

  getQueryString(): string {
    let queryItems: string[] = [];
    let filterList: string[] = ["completed", "contains", "completed_date"]

    filterList.forEach((item => {
      if (this[item] !== null) {
        queryItems.push(`${item}=${this[item]}`)
      }
    }))

    if (!!this.tags) {
      this.tags.forEach((tag: Tag) => {
        queryItems.push(`tags=${tag.slug}`);
      })
    }

    return queryItems.join("&")
  }

  getFilteredURL(url: string): string {
    let queryString = this.getQueryString()
    return queryString ? `${url}?${queryString}` : url
  }
}


