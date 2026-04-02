import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, MatInputModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit{
  post!: Post;
  private mode = 'create';
  private postId: any;
  rotateSpinner= false;

  constructor(public postService: PostsService,
    public activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.rotateSpinner= true;
        this.postService.getPost(this.postId!).subscribe((postData:any) => {
          this.rotateSpinner= false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          }
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.rotateSpinner=true;
    const post:Post = {
      title: form.value.title,
      content: form.value.content
    }
    if(this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      post.id = this.postId;
      this.postService.updatePost(post);
    }
    
    form.resetForm();
  }
}
