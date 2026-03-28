import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Post } from '../post.model';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  @Input() posts:Post[] = [];
  // posts = [
  //   {title: "First post", content: "This first post content"},
  //   {title: "Second post", content: "This seconsd post content"},
  //   {title: "Third post", content: "This third post content"},
  // ]
  

}
