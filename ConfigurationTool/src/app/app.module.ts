import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CoreModule } from 'core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
      BrowserModule,
      HttpClientModule,
      CoreModule
  ],
  providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
