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
        ],
    },
];
