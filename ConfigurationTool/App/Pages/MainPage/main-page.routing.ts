import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';
import { EmptyComponent }  from './empty/empty.component';

const mainPageRoutes: Routes = [
    { path: '', component: EmptyComponent }
];

export const mainPageRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(mainPageRoutes);