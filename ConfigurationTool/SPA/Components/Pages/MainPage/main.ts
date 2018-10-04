import 'reflect-metadata';
import 'zone.js';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MainPageModule } from './main-page.module';


var modulePromise;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        // Before restarting the app, we create a new root element and dispose the old one
        const oldRootElem = document.querySelector('main-page');
        const newRootElem = document.createElement('main-page');
        oldRootElem!.parentNode!.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(appModule => {
            appModule.destroy();
            if (oldRootElem.parentNode)
                oldRootElem.parentNode.removeChild(oldRootElem);

        });
    });
} else {
    enableProdMode();
}


modulePromise = platformBrowserDynamic().bootstrapModule(MainPageModule);
