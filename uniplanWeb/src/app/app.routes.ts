import { Routes } from '@angular/router';
import { LayoutComponent } from './layout-component/layout-component';
import { Settings } from './core/shared/settings/settings';

export const routes: Routes = [
    {path: "" , component: LayoutComponent},
    {path:"settings", component:Settings},
];
