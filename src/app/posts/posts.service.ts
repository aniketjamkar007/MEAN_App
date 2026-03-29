import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[] =[];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((res) =>{
      this.posts=res.posts;
      this.postsUpdated.next([...this.posts]);
    })
    // return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(newPost:Post) {
    const post:Post = {
      id: null,
      title: newPost.title,
      content: newPost.content
    }
    this.http.post<{message: string}>('http://localhost:3000/api/post', post)
      .subscribe((resData) => {
        console.log(resData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      })
  }
}
