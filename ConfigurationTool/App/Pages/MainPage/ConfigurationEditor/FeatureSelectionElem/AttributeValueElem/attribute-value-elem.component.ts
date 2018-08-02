import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { AttributeValueCLO, AttributeTypes } from 'app/core/clofactory/clos';


@Component({
    moduleId: module.id,
    selector: 'attribute-value-elem',
    templateUrl: "attribute-value-elem.component.html" + "?tmplv=" + Date.now(),
    styleUrls: ['attribute-value-elem.component.css' + "?tmplv=" + Date.now()]
})
export class AttributeValueElem implements OnInit {
    // Fields
    @Input() public AttributeValueCLO: AttributeValueCLO;
    @Output() public Changed = new EventEmitter();


    // Constructor
    constructor() {
    }

    // Init
    ngOnInit() {

    }

    // Event handlers
    private onChanged(newValue: string) {
        debugger;
        alert(newValue);
        this.Changed.emit(newValue);
    }
}