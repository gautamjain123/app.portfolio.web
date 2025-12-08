import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './website/pages/home-layout/home-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeLayoutComponent,
        children: [
            {
                path: '',
                // component:IasHomepageComponent,
                loadComponent: () => import('./website/pages/home-layout/landing-page/landing-page.component').then(m => m.LandingPageComponent)
            },
            {
                path: 'contact-me',
                // component:IasHomepageComponent,
                loadComponent: () => import('./website/pages/contact-us/contact-us.component').then(m => m.ContactUsComponent)
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
