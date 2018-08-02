import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { CLOFactoryService } from 'app/core/clofactory/clo-factory.service';
import { DialogManagerService } from 'app/core/dialogmanager/dialog-manager.service';

import { DialogComponent } from 'app/core/dialogmanager/dialog/dialog.component';
import { Dialog, Header, Footer } from 'primeng/primeng';



@NgModule({
    imports: [
        BrowserModule, HttpModule
    ],
    declarations: [DialogComponent, Dialog, Header, Footer],
    exports: [
        DialogComponent
    ],
    providers: [CLOFactoryService, DialogManagerService],
    bootstrap: [],
    entryComponents: [DialogComponent]
})
export class CoreModule { }
