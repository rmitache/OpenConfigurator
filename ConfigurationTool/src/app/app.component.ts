import { Component, ViewChild } from '@angular/core';
import { CLOFactoryService } from 'core/clofactory/clo-factory.service';
import { AppDataStore } from './app.data-store';
import { ConfigurationEditorComponent } from './ConfigurationEditor/configuration-editor.component';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';



@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ['./app.component.css'],
    providers: [AppDataStore, CLOFactoryService]
})
export class AppComponent {
    @ViewChild(ConfigurationEditorComponent) private configurationEditorInstance: ConfigurationEditorComponent;

    // Constructor
    constructor(private appDataStore: AppDataStore,
        private http: HttpClient) { }
    ngOnInit() {

        //// 
        //this.appDataStore.GetConfigurationInstance()
        //    .then((configInstanceCLO) => {
        //        this.configurationEditorInstance.LoadConfigurationInstance(configInstanceCLO);
        //    });
    }

    // Event handlers
    private upload(event) {
        if (event.target.files.length === 0)
            return;

        // Get the file and prepare to send
        let file = event.target.files[0];
        this.appDataStore.UploadModelFile(file)
            .then(
                // Success
                (configInstanceCLO) => {
                    this.configurationEditorInstance.LoadConfigurationInstance(configInstanceCLO);
                },

                // Error
                (errorText) => {
                    alert('An error occurred and the file could not be loaded. Please try again or with a different file.')
                });
    }

}
