import {Component, OnInit, ViewChild} from '@angular/core';
import {Dialog, Header, Footer} from 'primeng/primeng';

@Component({
    moduleId: module.id,
    selector: 'dialog-elem',
    templateUrl: "dialog.component.html" + "?tmplv=" + Date.now()
})
export class DialogComponent implements OnInit {
    @ViewChild(Dialog) ngDialog: Dialog;
    private display: boolean = false;

    public ngOnInit() {
        this.ngDialog.resizable = false;
        this.ngDialog.draggable = false;
    }

    public ShowDialog() {
        this.display = true;
    }
}