import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];
  constructor() { }

  add(message: string) {
    this.messages.push(message)
  }

  clear() {
    this.messages = [];
  }

  drop (index: number): void {
    this.messages.splice(index, 1);
  }
}
