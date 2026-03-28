import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[] =[];
  private postsUpdated = new Subject<Post[]>();

  constructor() { }

  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(newPost:Post) {
    const post:Post = {
      title: newPost.title,
      content: newPost.content
    }
    this.posts.push(post);
    this.postsUpdated.next([...this.posts])
  }
}
