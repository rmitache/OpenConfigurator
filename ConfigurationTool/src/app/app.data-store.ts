import { Injectable, Inject } from '@angular/core';
import { Http, Response, Request, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import { CLOFactoryService } from 'core/CLOFactory/clo-factory.service';
import { ConfigurationInstanceCLO } from 'core/CLOFactory/clos';


@Injectable()
export class AppDataStore {

    // Fields
    private globalAPIurl: string = "/GlobalAPI"
    private headers = new Headers({ 'Content-Type': 'application/json' });

    // Constructor
    constructor(private http: Http, @Inject(CLOFactoryService) private cloFactory: CLOFactoryService) { }

    // Public methods
    public SaveConfigurationInstance(): Promise<any> {
        let options = new RequestOptions({ 'headers': this.headers });

        let ajaxCall = this.http.post(this.globalAPIurl + "/SaveConfigurationInstance", null, options)
            .toPromise();
        return ajaxCall;

    }
    public GetConfigurationInstance(): Promise<any> {

        let params = new URLSearchParams();
        params.set("modelName", "ABTesting");

        let ajaxCall = this.http.get(this.globalAPIurl + "/GetConfigurationInstance", { search: params })
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .then((blo) => {

                // Convert the blo to a corresponding clo 
                let clo: ConfigurationInstanceCLO = this.cloFactory.Convert_ToCLO(ConfigurationInstanceCLO.name, blo) as ConfigurationInstanceCLO;
                return clo;
            });
        return ajaxCall;

    }
    public ToggleFeatureSelection(featureID: string): Promise<any> {

        let body = JSON.stringify(featureID);
        let options = new RequestOptions({ 'headers': this.headers });

        let ajaxCall = this.http.post(this.globalAPIurl + "/ToggleFeatureSelection", body, options)
            .toPromise()
            .then((response) => {
                return response.json();
            });

        return ajaxCall;
    }
}