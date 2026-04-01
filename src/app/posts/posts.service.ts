import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[] =[];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http
      .get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(
        map((res) => {
          return res.posts.map((post: { title: any; content: any; _id: any; }) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            }
          })
        })
      )
      .subscribe((transformedPosts) =>{
        this.posts=transformedPosts;
        this.postsUpdated.next([...this.posts]);
      })
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
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/post', post)
      .subscribe((resData) => {
        const id = resData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      })
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/post/'+postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }
}
