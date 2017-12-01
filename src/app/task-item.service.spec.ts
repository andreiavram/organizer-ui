import { TestBed, inject } from '@angular/core/testing';

import { TaskItemService } from './task-item.service';

describe('TaskItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskItemService]
    });
  });

  it('should be created', inject([TaskItemService], (service: TaskItemService) => {
    expect(service).toBeTruthy();
  }));
});
