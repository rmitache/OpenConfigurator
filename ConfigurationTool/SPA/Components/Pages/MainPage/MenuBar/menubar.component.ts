import {Component, OnInit} from '@angular/core';
import {Menubar, MenuItem, MenubarSub, TabPanel} from 'primeng/primeng';

@Component({
    selector: 'menubar',
    templateUrl: "menubar.component.html" 
})
export class MenuBarComponent implements OnInit {
    public items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'File',
                items: [{
                    label: 'Open model',
                    command: function () {
                        
                    }

                }]
            }
        ];
    }
}