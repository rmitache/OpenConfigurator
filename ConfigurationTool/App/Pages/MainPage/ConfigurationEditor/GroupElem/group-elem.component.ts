import { Component, Input, Output, EventEmitter} from '@angular/core';
import { GroupCLO, FeatureSelectionCLO } from 'app/core/clofactory/clos';


@Component({
    moduleId: module.id,
    selector: 'group-elem',
    templateUrl: "group-elem.component.html" + "?tmplv=" + Date.now(),
    styleUrls: ['group-elem.component.css' + "?tmplv=" + Date.now()]
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