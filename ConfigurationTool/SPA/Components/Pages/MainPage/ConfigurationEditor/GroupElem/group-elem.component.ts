import { Component, Input, Output, EventEmitter} from '@angular/core';
import { GroupCLO, FeatureSelectionCLO } from '../../../../../Core/CLOFactory/clos';


@Component({
    selector: 'group-elem',
    templateUrl: "group-elem.component.html" ,
    styleUrls: ['group-elem.component.css' ]
})
export class GroupElem {
    @Input() public GroupCLO: GroupCLO;
    @Input() public NestingLevel: number; 
    @Output() public InnerFeatureSelectionClicked = new EventEmitter();

    // Event handlers
    private onFeatureSelectionElemClicked(featureSelectionCLO: FeatureSelectionCLO) {

        this.InnerFeatureSelectionClicked.emit(featureSelectionCLO);
    }
}