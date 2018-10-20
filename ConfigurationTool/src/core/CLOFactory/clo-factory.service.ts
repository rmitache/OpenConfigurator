import { Injectable } from '@angular/core';
import { NgModule } from '@angular/core';
import { ConfigurationInstanceCLO, FeatureSelectionCLO, AttributeValueCLO, FeatureSelectionStates, GroupCLO, iCLO } from './clos';

namespace SpecializedCLOFactories {
    export interface ISpecializedCLOFactory {
        Convert_ToCLO(blo: Object): iCLO;
    }

    export class ConfigurationInstanceCLOFactory implements ISpecializedCLOFactory {

        // Private methods
        private AddFeatureSelectionCLOToCollection_Recursive(featureSelectionCLO: FeatureSelectionCLO, collection: { [key: string]: FeatureSelectionCLO }) {
            collection[featureSelectionCLO.FeatureIdentifier] = featureSelectionCLO;

            // Child FeatureSelections
            for (var childFeatureSelection of featureSelectionCLO.ChildFeatureSelections) {
                this.AddFeatureSelectionCLOToCollection_Recursive(childFeatureSelection, collection);
            }

            // Child Groups
            for (var childGroup of featureSelectionCLO.ChildGroups) {
                for (var innerFeatureSelection of childGroup.InnerFeatureSelections) {
                    this.AddFeatureSelectionCLOToCollection_Recursive(innerFeatureSelection, collection);
                }
                
            }
        }

        // Constructor
        constructor(private cloConverter: IGenericCLOConverter) { }

        // Public methods
        public Convert_ToCLO(blo: Object): iCLO {
            let newCLO = new ConfigurationInstanceCLO();
            newCLO.ModelName = blo["ModelName"]; // primitive
            newCLO.RootFeatureSelection = this.cloConverter.Convert_ToCLO(FeatureSelectionCLO.name, blo["RootFeatureSelection"]) as FeatureSelectionCLO; // CLO
            newCLO.FeatureSelections = {};
            newCLO.SMTText = blo["SMTText"];
            this.AddFeatureSelectionCLOToCollection_Recursive(newCLO.RootFeatureSelection, newCLO.FeatureSelections);

            return newCLO;
        }

    }
    export class FeatureSelectionCLOFactory implements ISpecializedCLOFactory {

        // Constructor
        constructor(private cloConverter: IGenericCLOConverter) { }

        // Public methods
        public Convert_ToCLO(blo: Object): iCLO {
            
            let newCLO = new FeatureSelectionCLO();
            newCLO.FeatureName = blo["FeatureName"]; // primitive
            newCLO.FeatureIdentifier = blo["FeatureIdentifier"]; // primitive
            newCLO.SelectionState = blo["SelectionState"] as number; // primitive
            newCLO.Disabled = blo["Disabled"] as boolean; // primitive
            newCLO.ToggledByUser = blo["ToggledByUser"] as boolean; // primitive

            newCLO.AttributeValues = this.cloConverter.Convert_ToCLOArray(AttributeValueCLO.name, blo["AttributeValues"]) as AttributeValueCLO[]; // CLO array
            newCLO.ChildFeatureSelections = this.cloConverter.Convert_ToCLOArray(FeatureSelectionCLO.name, blo["ChildFeatureSelections"]) as FeatureSelectionCLO[]; // CLO array
            newCLO.ChildGroups = this.cloConverter.Convert_ToCLOArray(GroupCLO.name, blo["ChildGroups"]) as GroupCLO[]; // CLO array
            

            return newCLO;
        }

    }
    export class AttributeValueCLOFactory implements ISpecializedCLOFactory {

        // Constructor
        constructor(private cloConverter: IGenericCLOConverter) { }

        // Public methods
        public Convert_ToCLO(blo: Object): iCLO {
            let newCLO = new AttributeValueCLO();
            newCLO.AttributeIdentifier = blo["AttributeIdentifier"]; // primitive
            newCLO.AttributeName = blo["AttributeName"]; // primitive
            newCLO.Value = blo["Value"]; // primitive
            newCLO.DefaultValue = blo["DefaultValue"]; // primitive
            newCLO.AttributeType = blo["AttributeType"] as number; // primitive
            newCLO.AttributeDataType = blo["AttributeDataType"] as number; // primitive

            return newCLO;
        }

    }
    export class GroupCLOFactory implements ISpecializedCLOFactory {

        // Constructor
        constructor(private cloConverter: IGenericCLOConverter) { }

        // Public methods
        public Convert_ToCLO(blo: Object): iCLO {
            let newCLO = new GroupCLO();
            newCLO.GroupRelationType = blo["GroupRelationType"] as number; // primitive
            newCLO.InnerFeatureSelections = this.cloConverter.Convert_ToCLOArray(FeatureSelectionCLO.name, blo["InnerFeatureSelections"]) as FeatureSelectionCLO[]; // CLO array

            return newCLO;
        }

    }
}
interface IGenericCLOConverter {
    Convert_ToCLO(
        typeName: string,
        blo: Object
    ): iCLO;
    Convert_ToCLOArray(
        typeName: string,
        bloArray: Object[]
    ): iCLO[];

}


@Injectable()
export class CLOFactoryService implements IGenericCLOConverter {

    // Public methods
    public Convert_ToCLO(typeName: string, blo: any): iCLO {

        let specializedCLOFactory = new SpecializedCLOFactories[typeName + "Factory"](this);
        return specializedCLOFactory.Convert_ToCLO(blo);
    }
    public Convert_ToCLOArray(typeName: string, bloArray: Object[]): iCLO[] {

        let newArray: iCLO[] = new Array();
        for (var blo of bloArray) {
            let newCLO = this.Convert_ToCLO(typeName, blo);
            newArray.push(newCLO);
        }

        return newArray
    }
}



