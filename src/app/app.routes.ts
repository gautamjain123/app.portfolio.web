import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './website/pages/home-layout/home-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./website/pages/home-layout/landing-page/landing-page.component').then(m => m.LandingPageComponent)
            },
            {
                path: 'contact-me',
                loadComponent: () => import('./website/pages/contact-us/contact-us.component').then(m => m.ContactUsComponent)
            },
            {
                path: 'ai-lab',
                loadComponent: () => import('./website/pages/ai-lab/ai-lab.component').then(m => m.AiLabComponent)
            },
            {
                path: 'blog',
                children: [
                    { path: '',  loadComponent: () => import('./website/pages/blogs/blog-list/blog-list.component').then(m => m.BlogListComponent) },
                    { path: ':slug',  loadComponent: () => import('./website/pages/blogs/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent) }
                ]
            }

        ],
    },
];
