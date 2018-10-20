export interface iCLO {
}

// CLOs
export class ConfigurationInstanceCLO implements iCLO {
    public ModelName: string;
    public FeatureSelections: { [key: string]: FeatureSelectionCLO };
    public RootFeatureSelection: FeatureSelectionCLO;
    public SMTText: string;
}
export class FeatureSelectionCLO implements iCLO {
    public FeatureIdentifier: string;
    public FeatureName: string;
    public SelectionState: FeatureSelectionStates;
    public Disabled: boolean;
    public ToggledByUser: boolean;

    public AttributeValues: AttributeValueCLO[];
    public ChildFeatureSelections: FeatureSelectionCLO[];
    public ChildGroups: GroupCLO[];
}
export class AttributeValueCLO implements iCLO {
    public AttributeIdentifier: string;
    public AttributeName: string;
    public Value: string;
    public DefaultValue: string;
    public AttributeType: AttributeTypes;
    public AttributeDataType: AttributeDataTypes;
}
export class GroupCLO implements iCLO {
    public InnerFeatureSelections: FeatureSelectionCLO[];
    public GroupRelationType: GroupRelationTypes;

}

// Enums
export enum FeatureSelectionStates {
    Unselected = 0,
    Selected = 1,
    Deselected = 2
}
export enum GroupRelationTypes {
    OR = 0,
    XOR = 1,
    Cardinal = 2
}
export enum AttributeTypes {
    Constant = 0,
    Dynamic = 1,
    UserInput = 2
}
export enum AttributeDataTypes {
    Integer = 0,
    Boolean = 1,
    String = 2
}
