import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CoreModule } from "app/core/core.module";

import { routing, mainPageRoutingProviders } from './main-page.routing';

// App component
import { MainPageComponent } from './main-page.component';
import { EmptyComponent } from './empty/empty.component';

// MenuBar
import { MenuBarComponent } from './menubar/menubar.component';
import { Menubar, MenuItem, MenubarSub } from 'primeng/primeng';

// ConfigurationEditor
import { ConfigurationEditorComponent } from './configurationeditor/configuration-editor.component';
import { FeatureSelectionElem } from './configurationeditor/featureselectionelem/feature-selection-elem.component';
import { AttributeValueElem } from './configurationeditor/featureselectionelem/attributevalueelem/attribute-value-elem.component';
import { GroupElem } from './configurationeditor/groupelem/group-elem.component';

@NgModule({
    imports: [ 
        BrowserModule,
        HttpModule,
        CoreModule,
        routing
    ],
    declarations: [
        MainPageComponent,
        EmptyComponent,
        
        ConfigurationEditorComponent,
        FeatureSelectionElem,
        AttributeValueElem,
        GroupElem,

        MenuBarComponent,
        Menubar,
        MenubarSub
    ],
    providers: [mainPageRoutingProviders],
    bootstrap: [MainPageComponent],
    entryComponents: [FeatureSelectionElem, GroupElem]
})
export class MainPageModule {

}


