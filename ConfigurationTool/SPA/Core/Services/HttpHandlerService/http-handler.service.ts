import { Http, RequestMethod, Response, RequestOptions, URLSearchParams, Request, Headers, HttpModule  } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class HttpHandlerService {
    // Fields
    private headers = new Headers({
        'accept': 'application/json',
        'content-type': 'application/json',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'expires': '-1'
    });

    // Private methods
    private extractData(res: Response) {
        return res.text() ? res.json() : null;
    }
    private handleError(error: any) {
        const errMsg: string = error.message ? error.message
            : 'unspecified error';

        return Observable.throw(new Error(errMsg));
    }
    private objToSearchParams(obj: any): URLSearchParams {
        // TODO - only supports objects of single level depth (eg: if one of the fields on 'obj' is an object, only its direct children will be serialized)
        let params: URLSearchParams = new URLSearchParams();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {

                if (obj[key] instanceof Date) {
                    // Special fix for Dates when being passed as parameters to GET methods
                    params.set(key, (obj[key] as Date).toISOString());
                }
                else if (typeof obj[key] === 'object') {
                    // Handling for properties which are nested objects
                    throw new Error('Objects with nested objects as querystring parameters are currently not supported. Try to pass them as strings and deserialize manually on the BE');
                }
                else {
                    params.set(key, obj[key]);
                }
            }
        }
        return params;
    }

    // Constructor
    constructor( @Inject(Http) private http: Http) { }

    // Public methods
    public Get(serviceUrl: string, data?: any): Observable<any> {
        if (data && typeof data !== 'object') {
            throw new Error('data parameter is not an Object!');
        }

        // Convert data to URL parameters
        let options = new RequestOptions({ headers: this.headers });
        if (data !== null) {
            options.search = this.objToSearchParams(data);
        }

        // Call the WebAPI using GET
        return this.http.get(serviceUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public Post(serviceUrl: string, data?: any): Observable<any> {
        
        var stringifiedData = null;
        if (data) {
            stringifiedData = JSON.stringify(data);
        }

        return this.http
            .request(new CustomRequest({
                method: RequestMethod.Post,
                url: serviceUrl,
                headers: this.headers
            }, stringifiedData))
            .map(this.extractData)
            .catch(this.handleError);
    }

}


class CustomRequest extends Request {
    // Fields
    private readonly data: Uint8Array;

    // Constructor
    public constructor(requestOptions: any, data: any) {
        super(requestOptions);
        this.data = data;
    }

    // Public Methods
    public getBody() {
        return this.data;
    }
}