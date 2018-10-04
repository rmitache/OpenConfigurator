import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpHandlerService } from 'SPA/Core/Services/HttpHandlerService/http-handler.service';
import { ButtonModule } from 'primeng/primeng';
import { CLOFactoryService } from './CLOFactory/clo-factory.service';
import { DialogManagerService } from './DialogManager/dialog-manager.service';

@NgModule({
    imports: [
		BrowserModule,
		ButtonModule

	],
	exports: [],
    declarations: [
    ],
    providers: [
        // Services
        HttpHandlerService,
        CLOFactoryService,
        DialogManagerService
    ],
    entryComponents: [
    ]
})
export class CoreModule { }