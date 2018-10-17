import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FeatureSelectionCLO, FeatureSelectionStates } from 'core/clofactory/clos';


@Component({
    selector: 'feature-selection-elem',
    templateUrl: "feature-selection-elem.component.html",
    styleUrls: ['feature-selection-elem.component.css']
})
export class FeatureSelectionElem implements OnInit {
    // Fields
    public IsRoot: boolean = false;
    @Input() public FeatureSelectionCLO: FeatureSelectionCLO;
    @Input() public OnClickHandler: (clickedFeatureSel: FeatureSelectionCLO) => void;

    // Private methods
    private getSelectionState() {
        return FeatureSelectionStates[this.FeatureSelectionCLO.SelectionState];
    }
    private getDisabled() {
        return this.FeatureSelectionCLO.Disabled === true;
    }
    private getToggledByUser() {
        return this.FeatureSelectionCLO.ToggledByUser === true;
    }


    // Constructor
    constructor() {

    }

    // Init
    ngOnInit() {

    }

    // Event handlers
    private onClicked() {
        if (this.FeatureSelectionCLO.Disabled !== true) {
            this.OnClickHandler(this.FeatureSelectionCLO);
        }
    }

}