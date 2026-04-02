import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[] =[];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

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

  getPost(postId: string) {
    const post = this.posts.find(post => post.id === postId);
    // return post ? { ...post } : undefined;
    return this.http.get('http://localhost:3000/api/posts/'+postId);
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
        this.router.navigate(["/"]);
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

  updatePost(newPost:Post) {
    const updatingPost:Post = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content
    }
    
    this.http.put('http://localhost:3000/api/post/'+updatingPost.id , updatingPost)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === updatingPost.id);
        updatedPosts[oldPostIndex] = updatingPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
}
