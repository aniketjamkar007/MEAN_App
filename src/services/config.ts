import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Config {
  private config: any;

  async load(): Promise<void> {
    const response = await fetch('/assets/config.json');
    this.config = await response.json();
  }

  get apiUrl(): string {
    return this.config?.apiUrl;
  }
}
