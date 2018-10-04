import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

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
import { CoreModule } from '../../../Core/core.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    bootstrap: [MainPageComponent],
    imports: [ 
        CommonModule,
        HttpModule,
        FormsModule,
        BrowserModule,
        CoreModule,
        RouterModule.forRoot(
            [{ path: '', component: MainPageComponent },
            { path: 'MainPage', component: MainPageComponent }]
        )
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
    providers: [],
    entryComponents: [FeatureSelectionElem, GroupElem]
})
export class MainPageModule {

}


