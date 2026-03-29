import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {

  constructor(public postService: PostsService){}

  onAddPost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const post:Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    }

    this.postService.addPost(post);
    form.resetForm();
  }
}
