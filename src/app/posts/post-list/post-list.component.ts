import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, CommonModule, MatButtonModule,
            RouterLink, MatProgressSpinner, MatPaginatorModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy{
  posts:Post[] = [];
  private postSub!: Subscription;
  isLoading= false;
  totalPosts=10;
  postsPerPage=2;
  currentPage=1;
  pageSizeOptions=[1, 2, 5, 10];
  
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], maxPosts: number }) => {
        this.isLoading=false;
        this.posts = postData.posts;
        this.totalPosts = postData.maxPosts;
      });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: any) {
    this.isLoading=true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

}
