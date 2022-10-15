define("Main/FileExplorer/FileExplorer",
    [
        "text!Main/FileExplorer/FileExplorer.html" // html markup
    ],
    function (HTMLmarkup) {

        var FileExplorer = function (container, DataStore) {

            // Fields
            var _container = container, _DataStore = DataStore;
            var _innerHtmlElem;
            var _innerElems = {
                openModelButton: null
            };
            var _this = this;
            var _vm = {
                ModelFilesCollection: new ObservableCollection(),
                CurrentlySelectedModelFile: new ObservableField(null),
                SelectModelFile: function (modelFileCLO) {
                    if (_vm.CurrentlySelectedModelFile() === modelFileCLO) {
                        _vm.OpenModelFile();
                    } else {
                        _vm.CurrentlySelectedModelFile(modelFileCLO);
                    }
                },
                OpenModelFile: function () {
                    _this.FileOpenTriggered.RaiseEvent(_vm.CurrentlySelectedModelFile());
                }
            };

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to html elems
                _innerElems.openModelButton = $(_innerHtmlElem).find("#openModelButton");

                // Apply bindings
                ko.applyBindings(_vm, _innerHtmlElem[0]);
            }

            // Public methods
            this.LoadModelFiles = function () {

                // Clear current collection 
                _vm.ModelFilesCollection.RemoveAll();
                _vm.CurrentlySelectedModelFile(null);

                // Load list of existing model files
                var modelFiles = _DataStore.GetAllModelFiles();
                for (var i = 0; i < modelFiles.length; i++) {
                    _vm.ModelFilesCollection.Add(modelFiles[i]);
                }
            }

            // Events
            this.FileOpenTriggered = new Event();
        }
        return FileExplorer;
    });