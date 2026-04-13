import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,
    MatInputModule, MatCardModule,
    MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit{
  post!: Post;
  private mode = 'create';
  private postId: any;
  rotateSpinner= false;
  postForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(public postService: PostsService,
    public activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
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
            content: postData.content,
            image: postData.imagePath
          };
          this.postForm.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.image
          })
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost() {
    if(this.postForm.invalid) {
      return;
    }
    this.rotateSpinner=true;
    const post:Post = {
      title: this.postForm.value.title,
      content: this.postForm.value.content,
      image: this.postForm.value.image
    }
    if(this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      post.id = this.postId;
      this.postService.updatePost(post);
    }
    
    this.postForm.reset();
  }

  onImagePicked(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }
    this.postForm.patchValue({ image: file });
    this.postForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
