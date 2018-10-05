import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CLOFactoryService } from './clofactory/clo-factory.service';



@NgModule({
    imports: [
        BrowserModule, HttpModule
    ],
    declarations: [],
    exports: [
        
    ],
    providers: [CLOFactoryService],
    bootstrap: [],
    entryComponents: []
})
export class CoreModule { }
