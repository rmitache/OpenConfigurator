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
    private showSMTDynamic = true;
    private SMTDynamicText: string;

    // Constructor
    public constructor(private componentFactoryResolver: ComponentFactoryResolver, private mainPageDataStore: AppDataStore) { }

    // Public methods
    public LoadConfigurationInstance(configInstanceCLO: ConfigurationInstanceCLO) {

        // Load the given configurationInstance
        this.configurationInstancePlaceHolder.clear(); // clear any existing controls from a previously loaded configurationInstance
        this.configInstanceCLO = configInstanceCLO;
        this.SMTDynamicText = '';

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
        this.mainPageDataStore.ToggleFeatureSelection(featureSelectionCLO.FeatureIdentifier).then((returnModel) => {
            this.SMTDynamicText = returnModel.SMTDynamicText;

            // Update selectionStates of FeatureSelections
            for (var featureIdentifier in returnModel.ChangesDictionary) {
                let targetFeatureSelection: FeatureSelectionCLO = this.configInstanceCLO.FeatureSelections[featureIdentifier];

                // Update properties
                targetFeatureSelection.SelectionState = returnModel.ChangesDictionary[featureIdentifier].SelectionState;
                targetFeatureSelection.Disabled = returnModel.ChangesDictionary[featureIdentifier].Disabled;
                targetFeatureSelection.ToggledByUser = returnModel.ChangesDictionary[featureIdentifier].ToggledByUser;

                // Update attribute values
                let attrValChanges: Object[] = returnModel.ChangesDictionary[featureIdentifier].AttributeValueChanges;
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