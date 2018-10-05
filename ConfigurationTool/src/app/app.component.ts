import { Component, ViewChild } from '@angular/core';
import { CLOFactoryService } from 'core/clofactory/clo-factory.service';
import { AppDataStore } from './app.data-store';
import { ConfigurationEditorComponent } from './ConfigurationEditor/configuration-editor.component';



@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ['./app.component.css'],
    providers: [AppDataStore, CLOFactoryService]
})
export class AppComponent {
    @ViewChild(ConfigurationEditorComponent) private configurationEditorInstance: ConfigurationEditorComponent;

    // Constructor
    constructor(private appDataStore: AppDataStore) { }

    // Initialize
    ngOnInit() {

        // 
        this.appDataStore.GetConfigurationInstance()
            .then((configInstanceCLO) => {
                this.configurationEditorInstance.LoadConfigurationInstance(configInstanceCLO);
            });
    }
}
