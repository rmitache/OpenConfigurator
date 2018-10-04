import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ConfigurationEditorComponent } from './configurationeditor/configuration-editor.component';

import { MainPageDataStore } from './main-page.data-store';
import { CLOFactoryService } from '../../../Core/CLOFactory/clo-factory.service';

// Project modules
import '../../../Content/styles.css';

@Component({
    selector: 'main-page',
    templateUrl: "main-page.component.html",
    providers: [MainPageDataStore, CLOFactoryService]
})
export class MainPageComponent  {
    @ViewChild(ConfigurationEditorComponent) private configurationEditorInstance: ConfigurationEditorComponent;

    // Constructor
    constructor(private mainPageService: MainPageDataStore) { }

    // Initialize
    ngOnInit() {
       
        this.mainPageService.GetConfigurationInstance()
            .then((configInstanceCLO) => {
                this.configurationEditorInstance.LoadConfigurationInstance(configInstanceCLO);
            });
    }
}
