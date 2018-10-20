import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FeatureSelectionElem } from './featureselectionelem/feature-selection-elem.component';
import { GroupElem } from './groupelem/group-elem.component';
import { ConfigurationInstanceCLO, FeatureSelectionCLO, AttributeValueCLO, FeatureSelectionStates, GroupCLO, iCLO } from 'core/clofactory/clos';
import { AppDataStore } from '../app.data-store';

@Component({
    selector: 'configuration-editor',
    templateUrl: "configuration-editor.component.html",
    styleUrls: ['configuration-editor.component.css']
})
export class ConfigurationEditorComponent {

    // Fields 
    @ViewChild('configurationInstancePlaceHolder', { read: ViewContainerRef }) private configurationInstancePlaceHolder: ViewContainerRef;
    private configInstanceCLO: ConfigurationInstanceCLO;
    private showSMTText = false;

    // Constructor
    public constructor(private componentFactoryResolver: ComponentFactoryResolver, private mainPageDataStore: AppDataStore) { }

    // Public methods
    public LoadConfigurationInstance(configInstanceCLO: ConfigurationInstanceCLO) {

        // Load the given configurationInstance
        this.configurationInstancePlaceHolder.clear(); // clear any existing controls from a previously loaded configurationInstance
        this.configInstanceCLO = configInstanceCLO;
        //this.createFeatureSelectionElem_recursive(this.configInstanceCLO.RootFeatureSelection, 0);


        // Create a FeatureSelectionElem for the root 
        let rootFeatureSel = this.configInstanceCLO.RootFeatureSelection;
        let factory = this.componentFactoryResolver.resolveComponentFactory(FeatureSelectionElem);
        let comp = this.configurationInstancePlaceHolder.createComponent(factory);
        comp.instance.FeatureSelectionCLO = rootFeatureSel;
        comp.instance.IsRoot = true;
        comp.instance.OnClickHandler = this.onFeatureSelectionElemClicked;
    }

    // Event handlers
    private onFeatureSelectionElemClicked = (featureSelectionCLO: FeatureSelectionCLO) =>  {
        this.mainPageDataStore.ToggleFeatureSelection(featureSelectionCLO.FeatureIdentifier).then((changesDictionary) => {

            // Update selectionStates of FeatureSelections
            for (var featureIdentifier in changesDictionary) {
                let targetFeatureSelection: FeatureSelectionCLO = this.configInstanceCLO.FeatureSelections[featureIdentifier];

                // Update properties
                targetFeatureSelection.SelectionState = changesDictionary[featureIdentifier].SelectionState;
                targetFeatureSelection.Disabled = changesDictionary[featureIdentifier].Disabled;
                targetFeatureSelection.ToggledByUser = changesDictionary[featureIdentifier].ToggledByUser;

                // Update attribute values
                let attrValChanges: Object[] = changesDictionary[featureIdentifier].AttributeValueChanges;
                attrValChanges.forEach(attrValChange => {

                    let targetAttributeValue: AttributeValueCLO = targetFeatureSelection.AttributeValues.find((clo) => {
                        return clo.AttributeIdentifier === attrValChange["AttributeIdentifier"];
                    });
                    targetAttributeValue.Value = attrValChange["Value"];
                });

            }
        });
    }
    private onSaveButtonClicked() {

        this.mainPageDataStore.SaveConfigurationInstance();
    }
}