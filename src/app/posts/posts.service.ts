import { inject, Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../../services/config';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private configService = inject(Config);

  private get BACKEND_URL(): string {
    return this.configService.apiUrl+'/posts/';
  }

  private posts:Post[] =[];
  private postsUpdated = new Subject<{ posts: Post[], maxPosts: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{message: string, posts: any, maxPosts: number}>(this.BACKEND_URL+queryParams)
      .pipe(
        map((res) => {
          return { posts: res.posts.map((post: { title: any; content: any; _id: any; imagePath: any, creator: any }) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              image: post.imagePath,
              creator: post.creator
            }
          }), maxPosts: res.maxPosts };
        })
      )
      .subscribe((transformedPostsData) =>{
        console.log(transformedPostsData);
        this.posts=transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          maxPosts: transformedPostsData.maxPosts
        });
      })
  }

  getPost(postId: string) {
    const post = this.posts.find(post => post.id === postId);
    // return post ? { ...post } : undefined;
    return this.http.get<{message: string, post: any}>(this.BACKEND_URL+postId);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(newPost:Post) {
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    if (newPost.image instanceof File) {
      postData.append('image', newPost.image, newPost.title);
    } else if (typeof newPost.image === 'string') {
      postData.append('image', newPost.image);
    }
    
    this.http
    .post<{message: string, post: Post}>(
      this.BACKEND_URL, postData)
      .subscribe((resData) => {
        // const post: Post = {
        //   id: resData.post.id,
        //   title: newPost.title,
        //   content: newPost.content,
        //   image: newPost.image
        // };
        // this.posts.push(newPost);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  deletePost(postId: string) {
    return this.http.delete(this.BACKEND_URL+postId);
      // .subscribe(() => {
      //   const updatedPosts = this.posts.filter(post => post.id !== postId);
      //   this.posts = updatedPosts;
      //   this.postsUpdated.next([...this.posts]);
      // })
  }

  updatePost(newPost:Post) {
    let postData: FormData | Post;
    if(newPost.image instanceof File) {
      postData = new FormData();
      postData.append('id', newPost.id!);
      postData.append('title', newPost.title);
      postData.append('content', newPost.content);
      postData.append('image', newPost.image, newPost.title);
    } else {
      postData = {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        image: newPost.image
      };
    }
    
    this.http.put(this.BACKEND_URL+newPost.id , postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === newPost.id);
        // const updatedPost: Post = {
        //   id: newPost.id,
        //   title: newPost.title,
        //   content: newPost.content,
        //   image: ""
        // };
        // updatedPosts[oldPostIndex] = updatedPost;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
}
