import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CoreModule } from 'core/core.module';
import { ConfigurationEditorComponent } from './ConfigurationEditor/configuration-editor.component';
import { GroupElem } from './ConfigurationEditor/groupelem/group-elem.component';
import { FeatureSelectionElem } from './ConfigurationEditor/featureselectionelem/feature-selection-elem.component';
import { AttributeValueElem } from './configurationeditor/featureselectionelem/attributevalueelem/attribute-value-elem.component';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    declarations: [
        AppComponent,
        ConfigurationEditorComponent,
        GroupElem,
        FeatureSelectionElem,
        AttributeValueElem,
        
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        CoreModule,
        FileUploadModule
    ],
    exports: [
        FileUploadModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        GroupElem, 
        FeatureSelectionElem,
        AttributeValueElem
    ]
})
export class AppModule { }
