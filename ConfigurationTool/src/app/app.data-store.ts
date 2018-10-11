import { Injectable, Inject } from '@angular/core';
import { Http, Response, Request, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import { CLOFactoryService } from 'core/clofactory/clo-factory.service';
import { ConfigurationInstanceCLO } from 'core/clofactory/clos';
import { debug } from 'util';
import { HttpRequest, HttpClient, HttpResponse, HttpEvent } from '@angular/common/http';


@Injectable()
export class AppDataStore {

    // Fields
    private globalAPIurl: string = "/GlobalAPI"
    private headers = new Headers({ 'Content-Type': 'application/json' });

    // Constructor
    constructor(private http: Http,
        private httpClient: HttpClient,
        @Inject(CLOFactoryService) private cloFactory: CLOFactoryService) { }

    // Public methods (unused at the moment)
    public SaveConfigurationInstance(): Promise<any> {
        let options = new RequestOptions({ 'headers': this.headers });

        let ajaxCall = this.http.post(this.globalAPIurl + "/SaveConfigurationInstance", null, options)
            .toPromise();
        return ajaxCall;

    }
    public GetConfigurationInstance(): Promise<any> {

        let params = new URLSearchParams();
        params.set("modelName", "ABTesting"); // OBS - hardcoded atm. Change this value to point to another file manually

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

    // Public methods (in use)
    public ToggleFeatureSelection(featureID: string): Promise<any> {

        let options = new RequestOptions({ 'headers': this.headers });

        var model = {
            FeatureID: featureID,
        };

        let ajaxCall = this.http.post(this.globalAPIurl + "/ToggleFeatureSelection", model, options)
            .toPromise()
            .then((response) => {
                return response.json();
            });

        return ajaxCall;
    }
    public UploadModelFile(file: any): Promise<any> {
        const formData = new FormData();
        formData.append(file.name, file);

        // Send the request
        const uploadReq = new HttpRequest('POST', this.globalAPIurl + '/UploadModelFile', formData);
        var promise = this.httpClient.request<any>(uploadReq)
            .toPromise()
            .then((event) => {

                if (event instanceof HttpResponse) {
                    return event.body;
                }
            })
            .then((blo) => {
                // Convert the blo to a corresponding clo 
                let clo: ConfigurationInstanceCLO = this.cloFactory.Convert_ToCLO(ConfigurationInstanceCLO.name, blo) as ConfigurationInstanceCLO;
                return clo;
            });

        return promise;
    }

}