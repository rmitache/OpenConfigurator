import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ConfigurationEditorComponent } from './configurationeditor/configuration-editor.component';

import { MainPageDataStore } from './main-page.data-store';
import { CLOFactoryService } from 'app/core/clofactory/clo-factory.service';


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: "main-page.component.html" + "?tmplv=" + Date.now(),
    providers: [MainPageDataStore, CLOFactoryService]
})
export class MainPageComponent implements OnInit {
    @ViewChild(ConfigurationEditorComponent) private configurationEditorInstance: ConfigurationEditorComponent;

    // Constructor
    constructor(private mainPageService: MainPageDataStore) { }

    // Initialize
    ngOnInit() {


        // 
        this.mainPageService.GetConfigurationInstance()
            .then((configInstanceCLO) => {
                this.configurationEditorInstance.LoadConfigurationInstance(configInstanceCLO);
            });
    }
}
