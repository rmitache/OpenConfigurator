define("Main/Controller",
    [
        "Main/DataStore",
        "Main/VisualView/VisualView",
        "Main/ModelExplorer/ModelExplorer",
        "Main/CommandToolbar/CommandToolbar",
        "Main/PropertyEditor/PropertyEditor",
        "Main/MenuBar/MenuBar",
        "Main/FileExplorer/FileExplorer",
        "Shared/Dialog/Dialog"

    ],
    function (DataStore, VisualView, ModelExplorer, CommandToolbar, PropertyEditor, MenuBar, FileExplorer, Dialog) {
        var Controller = function () {

            // Fields
            var _dataStore = null;
            var _menuBar = null;
            var _visualView = null, _commandToolbar = null, _modelExplorer = null;
            var _propertyEditor = null, _cloSelectionManager = null;
            var _fileExplorer = null, _fileExplorerDialog = null;
            var _currentControlFocus = null; // variable to keep track of where the user executed the last action (clicking)
            var _this = this;

            // Init
            this.Initialize = function () {
                // Init UIComponents
                _dataStore = new DataStore();
                _dataStore.Initialize();
                _cloSelectionManager = new Controller.CLOSelectionManager();
                _cloSelectionManager.Initialize();
                _visualView = new VisualView($("#visualViewContainer"), _dataStore, _cloSelectionManager);
                _visualView.Initialize();
                _modelExplorer = new ModelExplorer($("#modelExplorerContainer"), _dataStore, _cloSelectionManager);
                _modelExplorer.Initialize();
                _commandToolbar = new CommandToolbar($("#toolBarContainer"), _dataStore, _this);
                _commandToolbar.Initialize();
                _propertyEditor = new PropertyEditor($("#propertyEditorContainer"), _dataStore, _cloSelectionManager);
                _propertyEditor.Initialize();
                _menuBar = new MenuBar($("#topMenuContainer"), _dataStore, _this);
                _menuBar.Initialize();

                //// Setup events and handlers
                //_dataStore.ModelLoaded.AddHandler(new EventHandler(_visualView.OnModelLoaded));
                //_dataStore.ModelLoaded.AddHandler(new EventHandler(_modelExplorer.OnModelLoaded));
                //_dataStore.ModelLoaded.AddHandler(new EventHandler(_commandToolbar.OnModelLoaded));
                //_dataStore.ModelUnloaded.AddHandler(new EventHandler(_visualView.OnModelUnloaded));
                //_dataStore.ModelUnloaded.AddHandler(new EventHandler(_modelExplorer.OnModelUnloaded));
                //_dataStore.ModelUnloaded.AddHandler(new EventHandler(_commandToolbar.OnModelUnloaded));
                //_visualView.StateChanged.AddHandler(new EventHandler(_commandToolbar.OnVisualViewStateChanged));
                //_dataStore.CLODeleted.AddHandler(new EventHandler(_cloSelectionManager.OnCLODeleted));
                //_cloSelectionManager.CLOSelectionChanged.AddHandler(new EventHandler(onCLOSelectionChanged));

                //// Global key handlers
                //$(document).keydown(function (e) {
                //    if (e.which == 46 || e.which == 8) { //del key or backspace

                //        // Check if a textbox is focused, in which case don't delete the Feature on keypress
                //        var currentFocusedElement = $(":focus")[0];
                //        if (!$(currentFocusedElement).is('input')) {
                //            _this.Delete();
                //        }
                //    }
                //});

                //// Other handlers
                //_visualView.Focus.AddHandler(new EventHandler(function () {
                //    onViewFocused(_visualView);
                //}));
                //_modelExplorer.Focus.AddHandler(new EventHandler(function () {
                //    onViewFocused(_modelExplorer);
                //}));
            }

            // Public methods
            this.NewModel = function () {
                _cloSelectionManager.DeselectAllCLOs();
                _dataStore.CreateAndLoadNewModel();
            }
            this.AddNewFeature = function () {
                _visualView.StartCreateFeature();
            }
            this.AddNewRelation = function () {
                _visualView.StartCreateRelation();
            }
            this.AddNewGroupRelation = function () {
                _visualView.StartCreateGroupRelation();
            }
            this.AddNewCompositionRule = function () {
                _visualView.StartCreateCompositionRule();
            }
            this.AddNewCustomRule = function () {
                var newCustomRuleCLO = _dataStore.CreateNewCLO(CLOTypes.CustomRule);
                _dataStore.GetCurrentModelCLO().CustomRules.Add(newCustomRuleCLO);
            }
            this.Delete = function () {

                var selectedCLOs = _cloSelectionManager.GetAllSelectedCLOs();
                for (var i = 0; i < selectedCLOs.length; i++) {
                    _dataStore.DeleteByClientID(selectedCLOs[i].GetClientID());
                }
            }
            this.ZoomIn = function () {
                _visualView.ZoomIn();
            }
            this.ZoomOut = function () {
                _visualView.ZoomOut();
            }
            this.ToggleOrientation = function () {
                _visualView.ToggleOrientation();
            }
            this.SaveChanges = function () {
                _dataStore.SaveChanges();
            }
            this.OpenFile = function () {

                // Setup fileExplorer and dialog in which it is shown
                if (_fileExplorer === null && _fileExplorerDialog === null) {

                    // Create fileExplorer instance
                    var fileExplorerContainer = $("<div class='contentWrapper'></div>");
                    _fileExplorer = new FileExplorer(fileExplorerContainer, _dataStore);
                    _fileExplorer.Initialize();
                    _fileExplorer.FileOpenTriggered.AddHandler(new EventHandler(onFileSelectedForOpen));

                    // Create dialog instance
                    _fileExplorerDialog = new Dialog("Open existing model", fileExplorerContainer, { modal: true });
                    _fileExplorerDialog.Initialize();
                }

                _fileExplorer.LoadModelFiles();
                _fileExplorerDialog.Show();
            }

            // Event handlers
            var onViewFocused = function (viewInFocus) {
                if (_currentControlFocus !== viewInFocus) {
                    _currentControlFocus = viewInFocus;
                }
            }
            var onCLOSelectionChanged = function () {

                // Open/hide PropertyEditor if VisualView is in default mode
                if (_visualView.GetCurrentState() === Enums.VisualView.StateNames.Default) {
                    var selectedCLOArray = _cloSelectionManager.GetAllSelectedCLOs();

                    // Nothing selected
                    if (selectedCLOArray.length === 0) {
                        _propertyEditor.Close();
                    }
                    // Single selected
                    else if (selectedCLOArray.length === 1) {
                        _propertyEditor.OpenAndEdit(selectedCLOArray);
                    }
                    // Multiple selected 
                    else if (selectedCLOArray.length > 1) {
                        //var allCLOsAreSameType = true; // assumption
                        //for (var i = 1; i < selectedCLOArray.length; i++) {
                        //    if (selectedCLOArray[i].GetType() !== selectedCLOArray[0].GetType()) {
                        //        allCLOsAreSameType = false;
                        //        break;
                        //    }
                        //}

                        ////
                        //if (allCLOsAreSameType)
                        //    _propertyEditor.OpenAndEdit(selectedCLOArray);
                        //else
                        _propertyEditor.Close();
                    }
                }
            }
            var onFileSelectedForOpen = function (modelFileName) {
                _cloSelectionManager.DeselectAllCLOs();
                _dataStore.LoadExistingModel(modelFileName);
                _fileExplorerDialog.Close();
            }
        }

        // Selection manager
        Controller.CLOSelectionManager = function () {

            // Fields
            var _selectedCLOs = {}; // lookup dictionary for all selected CLOs (for efficient retreival)
            var _this = this;

            // Private methods
            function selectCLO(clo) {
                _selectedCLOs[clo.GetClientID()] = clo;
                clo.Selected(true);
            }
            function deselectCLO(clo) {
                delete _selectedCLOs[clo.GetClientID()];
                clo.Selected(false);
            }
            function clearSelection() {
                for (var clientID in _selectedCLOs) {
                    deselectCLO(_selectedCLOs[clientID]);
                }
            }

            // Init
            this.Initialize = function () {
            }

            // Public methods
            this.GetAllSelectedCLOs = function (cloType) {
                var selectedCLOArray = [];
                for (var clientID in _selectedCLOs) {
                    if (cloType !== undefined && cloType !== null) {
                        if (_selectedCLOs[clientID].GetType() === cloType)
                            selectedCLOArray.push(_selectedCLOs[clientID]);
                    } else {
                        selectedCLOArray.push(_selectedCLOs[clientID]);
                    }
                }
                return selectedCLOArray;
            }
            this.ToggleSingleCLO = function (clo, ctrlKey) {
                var raiseEvent = false;

                if (ctrlKey === true) {
                    // Control key down
                    if (clo.Selected()) {
                        deselectCLO(clo); // deselect
                        raiseEvent = true;
                    }
                    else {
                        selectCLO(clo); // add to selection
                        raiseEvent = true;
                    }
                }
                else {
                    // No control key
                    if (!clo.Selected() || Object.size(_selectedCLOs) > 1) {
                        clearSelection();
                        selectCLO(clo); // add to selection

                        // blur any textboxes which might be in focus
                        var currentFocusedElement = $(":focus")[0];
                        if (currentFocusedElement) {
                            $(currentFocusedElement).blur();
                        }

                        raiseEvent = true;
                    }
                }
                if (raiseEvent)
                    _this.CLOSelectionChanged.RaiseEvent();
            }
            this.DeselectAllCLOs = function () {
                clearSelection();

                _this.CLOSelectionChanged.RaiseEvent();
            }
            this.ForceSelectSingleCLO = function (clo) {
                if (!clo.Selected()) {
                    selectCLO(clo);
                    _this.CLOSelectionChanged.RaiseEvent();
                }
            }
            this.ForceSelectMultipleCLOs = function (cloArray) {
                for (var i = 0; i < cloArray.length; i++) {
                    selectCLO(cloArray[i]);
                }

                _this.CLOSelectionChanged.RaiseEvent();
            }

            // Events 
            this.CLOSelectionChanged = new Event();

            // Event handlers
            this.OnCLODeleted = function (clo) {
                if (_selectedCLOs[clo.GetClientID()] !== undefined) {
                    deselectCLO(clo);
                    _this.CLOSelectionChanged.RaiseEvent();
                }
            }
        }

        // Special global class (currently used by certain CLOs when adding new objects to them)
        window.IdentifierProvider = (function () { // "static" class

            // Methods
            function getNewCLOIdentifier(cloType, collection) {

                // Variables
                var identifier = cloType + "_" + collection.GetAbsoluteItemCounter();
                if (collection.ContainsItemWith("Identifier", identifier)) {
                    var i = collection.GetAbsoluteItemCounter();
                    do {
                        i = i + 1;
                        identifier = cloType + "_" + i;
                    } while (collection.ContainsItemWith("Identifier", identifier));
                }
                return identifier;
            }
            function setupIdentifier(clo, parentCLO) { // parentCLO can be the Model or the Feature (if an attribute is passed as the clo)

                // If the clo to be added doesnt have an identifier, provide it with one
                if (clo.Identifier !== undefined && clo.Identifier() === null) {

                    var collection = parentCLO[clo.GetType() + "s"]; // get the collection corresponding to the type of the given CLO 
                    var autoGeneratedIdentifier = getNewCLOIdentifier(clo.GetType(), collection);

                    clo.Identifier(autoGeneratedIdentifier);
                    if (clo.Name !== undefined)
                        clo.Name(autoGeneratedIdentifier);

                }
            }

            // Public methods
            return {
                SetupIdentifier: setupIdentifier
            };
        })();


        return Controller;
    });

