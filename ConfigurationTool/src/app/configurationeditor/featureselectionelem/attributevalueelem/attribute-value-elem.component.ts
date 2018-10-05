import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { AttributeValueCLO, AttributeTypes } from 'core/clofactory/clos';


@Component({
    selector: 'attribute-value-elem',
    templateUrl: "attribute-value-elem.component.html" ,
    styleUrls: ['attribute-value-elem.component.css' ]
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

        this.Changed.emit(newValue);
    }
}