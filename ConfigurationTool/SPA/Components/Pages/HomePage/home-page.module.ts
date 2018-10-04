// Angular and 3rd party stuff
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Project modules
import { CoreModule } from 'SPA/Core/core.module';

// Components
import { HomePageComponent } from './home-page.component';


@NgModule({
    bootstrap: [HomePageComponent],
    declarations: [
        // HomePage
        HomePageComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        BrowserModule,
        CoreModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(
            [{ path: '', component: HomePageComponent },
            { path: 'HomePage', component: HomePageComponent }]
        ),

    ],
    providers: [

    ]
})
export class HomePageModule {
}

