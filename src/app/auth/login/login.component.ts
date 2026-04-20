import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, CommonModule,
            MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription|undefined;

  constructor(private authService: AuthService) {}

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

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.authService.login(form.value.email, form.value.password);
  }

}
