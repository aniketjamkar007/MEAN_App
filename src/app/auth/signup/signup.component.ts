import { CommonModule, NgFor } from '@angular/common';
import { Component , OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, CommonModule,
            MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription|undefined;

  constructor( private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
