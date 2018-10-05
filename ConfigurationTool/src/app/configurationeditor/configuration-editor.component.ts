import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FeatureSelectionElem } from './featureselectionelem/feature-selection-elem.component';
import { GroupElem } from './groupelem/group-elem.component';
import { ConfigurationInstanceCLO, FeatureSelectionCLO, AttributeValueCLO, FeatureSelectionStates, GroupCLO, iCLO } from 'core/clofactory/clos';
import { AppDataStore } from '../app.data-store';

@Component({
    selector: 'configuration-editor',
    templateUrl: "configuration-editor.component.html" ,
    styleUrls: ['configuration-editor.component.css']
})
export class ConfigurationEditorComponent {

    // Fields 
    @ViewChild('configurationInstancePlaceHolder', { read: ViewContainerRef }) private configurationInstancePlaceHolder: ViewContainerRef;
    private configInstanceCLO: ConfigurationInstanceCLO;

    // Private methods
    private createFeatureSelectionElem_recursive(targetFeatureSelectionCLO: FeatureSelectionCLO, nestingLevel: number) {

        // Create a FeatureSelectionElem 
        let factory = this.componentFactoryResolver.resolveComponentFactory(FeatureSelectionElem);
        let comp = this.configurationInstancePlaceHolder.createComponent(factory);
        comp.instance.FeatureSelectionCLO = targetFeatureSelectionCLO;
        comp.instance.NestingLevel = nestingLevel;
        comp.instance.Clicked
            .subscribe((featureSelectionCLO: FeatureSelectionCLO) => {
                this.onFeatureSelectionElemClicked(featureSelectionCLO);
            });

        // Create children FeatureSelection elems
        let childrenNestingLevel = nestingLevel + 1;
        for (let childFeatureSelectionCLO of targetFeatureSelectionCLO.ChildFeatureSelections) {
            this.createFeatureSelectionElem_recursive(childFeatureSelectionCLO, childrenNestingLevel);
        }

        // Create children Group elems
        for (let childGroupCLO of targetFeatureSelectionCLO.ChildGroups) {
            this.createGroupElem_recursive(childGroupCLO, childrenNestingLevel);
        }
    }
    private createGroupElem_recursive(targetGroupCLO: GroupCLO, nestingLevel: number) {

        // Create a GroupElem 
        let factory = this.componentFactoryResolver.resolveComponentFactory(GroupElem);
        let comp = this.configurationInstancePlaceHolder.createComponent(factory);
        comp.instance.GroupCLO = targetGroupCLO;
        comp.instance.NestingLevel = nestingLevel;
        comp.instance.InnerFeatureSelectionClicked
            .subscribe((featureSelectionCLO: FeatureSelectionCLO) => {
                this.onFeatureSelectionElemClicked(featureSelectionCLO);
            });

        // Create children FeatureSelection elems for each innerFeatureSelection 
        let childrenNestingLevel = nestingLevel + 1;
        for (let innerFeatureSelectionCLO of targetGroupCLO.InnerFeatureSelections) {
            for (let childFeatureSelectionCLO of innerFeatureSelectionCLO.ChildFeatureSelections) {
                this.createFeatureSelectionElem_recursive(childFeatureSelectionCLO, childrenNestingLevel);
            }
        }
    }

    // Constructor
    public constructor(private componentFactoryResolver: ComponentFactoryResolver, private mainPageDataStore:AppDataStore) { }

    // Public methods
    public LoadConfigurationInstance(configInstanceCLO: ConfigurationInstanceCLO) {
        this.configInstanceCLO = configInstanceCLO;

        this.createFeatureSelectionElem_recursive(this.configInstanceCLO.RootFeatureSelection, 0);





        // Idea: logic for recursively creating FeatureSelectionElems and GroupElems here 
        //  -> responsibility to create the nested tree structure will be with ConfigurationEditorComponent, and not with each Elem 
        //  -> responsibility will be here, and not with each EL
        // Create_FeatureSelectionElem_Or_GroupElem_Recursive() {
        // - Create new Elem and pass it the respective CLO. Recurse for each of its children 
        //

        // Each FeatureSelectionElem 
        // Each GroupElem contains a ref to a single GroupElem (no children)

        // Issues:
        // 1. If a FeatureSelectionElem/GroupElem knows nothing about the Children of its CLO, how will we hide those ? -> they need to be hidden if their
        // immediate parent is UNSELECTED or DESELECTED
    }

    // Event handlers
    private onFeatureSelectionElemClicked(featureSelectionCLO: FeatureSelectionCLO) {
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