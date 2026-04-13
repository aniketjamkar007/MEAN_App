import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: PostListComponent,
    },
    {
        path:'create',
        component: PostCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'edit/:id',
        component: PostCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path:'signup',
        loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)
    }
];
