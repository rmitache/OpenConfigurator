define("Main/VisualView/VisualView",
    [
        "text!Main/VisualView/VisualView.html", // html markup
        "Main/VisualView/FeatureElem/FeatureElem",
        "Main/VisualView/RelationElem/RelationElem",
        "Main/VisualView/GroupRelationElem/GroupRelationElem",
        "Main/VisualView/CompositionRuleElem/CompositionRuleElem"
    ],
    function (HTMLmarkup, FeatureElem, RelationElem, GroupRelationElem, CompositionRuleElem) {

        var VisualView = function (container, dataStore, cloSelectionManager) {

            // Fields
            var _container = container, _dataStore = dataStore, _cloSelectionManager = cloSelectionManager;
            var _canvasContainer = null, _canvas = null;
            var _innerHtmlElem;
            var _innerElems = {
                headerLabel: null,
                infoMsgOverlay: null
            };
            var _wireframes = {
                featureWireframe: null
            };
            var _innerStateManager = null;
            var _visualUIElems = {};
            var _this = this;

            // Private methods
            function addFeatureElem(featureCLO) {

                // Create a new feature
                var newFeatureElem = new FeatureElem(featureCLO, _canvas);
                newFeatureElem.Initialize();
                _visualUIElems[featureCLO.GetClientID()] = newFeatureElem;

                // Bind to it
                newFeatureElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
                    featureElemHandlers.onClicked(newFeatureElem, ctrlKey);
                }));
                newFeatureElem.DragStarted.AddHandler(new EventHandler(function () {
                    featureElemHandlers.onFeatureDragStarted(newFeatureElem);
                }));
                newFeatureElem.Dragging.AddHandler(new EventHandler(function (dx, dy) {
                    featureElemHandlers.onFeatureDragging(newFeatureElem, dx, dy);
                }));
            }
            function addRelationElem(relationCLO) {

                // Create a new relation
                var newRelationElem = new RelationElem(relationCLO, _visualUIElems[relationCLO.ParentFeature.GetClientID()], _visualUIElems[relationCLO.ChildFeature.GetClientID()], _canvas);
                newRelationElem.Initialize();
                _visualUIElems[relationCLO.GetClientID()] = newRelationElem;

                // Bind to it
                newRelationElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
                    onElemClicked(newRelationElem, ctrlKey);
                }));
            }
            function addGroupRelationElem(groupRelationCLO) {

                //
                var childFeatureElems = [];
                for (var i = 0; i < groupRelationCLO.ChildFeatures.GetLength() ; i++) {
                    childFeatureElems.push(_visualUIElems[groupRelationCLO.ChildFeatures.GetAt(i).GetClientID()]);
                }

                // Create a new group relation
                var newGroupRelationElem = new GroupRelationElem(groupRelationCLO, _visualUIElems[groupRelationCLO.ParentFeature.GetClientID()], childFeatureElems, _canvas);
                newGroupRelationElem.Initialize();
                _visualUIElems[groupRelationCLO.GetClientID()] = newGroupRelationElem;

                // Bind to it
                newGroupRelationElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
                    onElemClicked(newGroupRelationElem, ctrlKey);
                }));
            }
            function addCompositionRuleElem(compositionRuleCLO) {

                // Create a new composition rule
                var newCompositionRuleElem = new CompositionRuleElem(compositionRuleCLO, _visualUIElems[compositionRuleCLO.FirstFeature.GetClientID()],
                    _visualUIElems[compositionRuleCLO.SecondFeature.GetClientID()], _canvas);
                newCompositionRuleElem.Initialize();
                _visualUIElems[compositionRuleCLO.GetClientID()] = newCompositionRuleElem;

                // Bind to it
                newCompositionRuleElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
                    onElemClicked(newCompositionRuleElem, ctrlKey);
                }));
            }
            function selectElementsInArea(targetBbox) {

                // Loop through all selected UI elements and store them to be selected, if they are within the targetBox bounds
                var CLOsToBeSelected = [];
                for (var clientid in _visualUIElems) {
                    var elem = _visualUIElems[clientid];
                    if (elem.IsWithinBounds(targetBbox)) {
                        CLOsToBeSelected.push(elem.GetCLO());
                    }
                }

                // Call selection method
                _cloSelectionManager.ForceSelectMultipleCLOs(CLOsToBeSelected);
            }
            function refreshGraphicalReprOfAllUIElems() {
                for (var clientID in _visualUIElems) {
                    var elem = _visualUIElems[clientID];
                    if (elem !== undefined)
                        elem.RefreshGraphicalRepresentation();
                }
            }

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to dom elements
                _canvasContainer = $(_innerHtmlElem).find("#SVGCanvasWrapper");
                _innerElems.headerLabel = $(_innerHtmlElem).find(".headerLabel");
                _innerElems.infoMsgOverlay = $(_innerHtmlElem).find(".infoMsgOverlay");
                _canvas = Raphael($(_canvasContainer).children("#SVGCanvas")[0], "100%", "100%");
                _innerStateManager = new InnerStateManager(VisualView.InnerStates, VisualView.InnerStates.Default.Name, _this.StateChanged);
                _innerStateManager.Initialize(); // setup mode manager and enter initial mode

                // Handler for onFocus
                $(_innerHtmlElem).mousedown(function (e) {
                    _this.Focus.RaiseEvent();
                });

                // Handler for ESC key - should always revert to default State
                $(document).bind("keydown.escape", function (e) {
                    if (e.which === 27) { //esc key
                        _innerStateManager.SwitchToState(Enums.VisualView.StateNames.Default);
                    }
                });
            };

            // Public methods
            this.StartCreateFeature = function () {
                _innerStateManager.SwitchToState(VisualView.InnerStates.CreatingNewFeature.Name);
            }
            this.StartCreateRelation = function () {
                _innerStateManager.SwitchToState(VisualView.InnerStates.CreatingNewRelation.Name);
            }
            this.StartCreateGroupRelation = function () {
                _innerStateManager.SwitchToState(VisualView.InnerStates.CreatingNewGroupRelation.Name);
            }
            this.StartCreateCompositionRule = function () {
                _innerStateManager.SwitchToState(VisualView.InnerStates.CreatingNewCompositionRule.Name);
            }
            this.ZoomIn = function () {

                // Modify scale
                if (Settings.ScaleModifier < 2) {
                    Settings.ScaleModifier += 0.25;
                    _dataStore.GetCurrentModelCLO().ScaleModifier(Settings.ScaleModifier);
                }

                // Redraw all internal ui elems
                refreshGraphicalReprOfAllUIElems()
            }
            this.ZoomOut = function () {

                // Modify scale
                if (Settings.ScaleModifier >= 0.50) {
                    Settings.ScaleModifier -= 0.25;
                    _dataStore.GetCurrentModelCLO().ScaleModifier(Settings.ScaleModifier);
                }

                // Redraw all internal ui elems
                refreshGraphicalReprOfAllUIElems();
            }
            this.ToggleOrientation = function () {

                // Change orientation setting
                var newOrientation;
                if (Settings.UIOrientation === Enums.UIOrientationTypes.Vertical) {
                    newOrientation = Enums.UIOrientationTypes.Horizontal;
                } else {
                    newOrientation = Enums.UIOrientationTypes.Vertical;
                }
                Settings.UIOrientation = newOrientation;
                _dataStore.GetCurrentModelCLO().UIOrientation(newOrientation);


                // Reverse coordinates for all Features
                for (var clientID in _visualUIElems) {
                    var elem = _visualUIElems[clientID];
                    if (elem !== undefined) {

                        if (elem.GetType() === Enums.VisualView.ElemTypes.FeatureElem) {
                            elem.ReverseCoordinates();
                        }
                        elem.RefreshGraphicalRepresentation();
                    }
                }
            }
            this.GetCurrentState = function () {
                return _innerStateManager.GetCurrentStateName();
            }

            // Events
            this.Focus = new Event();
            this.StateChanged = new Event();

            // Event handlers
            this.OnModelLoaded = function (modelCLO) {

                // Load Orientation and scaleModifier from model
                Settings.UIOrientation = modelCLO.UIOrientation();
                Settings.ScaleModifier = modelCLO.ScaleModifier();

                // References to all relevant model child collections
                var bindableCollections = [
                    modelCLO.Features,
                    modelCLO.Relations,
                    modelCLO.GroupRelations,
                    modelCLO.CompositionRules
                ];

                // Go through each of the collections
                for (var i = 0; i < bindableCollections.length; i++) {
                    var collection = bindableCollections[i];

                    // Create elements for any existing CLOs that are already in the collection
                    for (var j = 0; j < collection.GetLength() ; j++) {
                        var clo = collection.GetAt(j);
                        modelHandlers.onCLOAdded(clo);
                    }

                    // Bind to it
                    collection.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
                    collection.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
                }
            }
            this.OnModelUnloaded = function (modelCLO) {
                for (var clientID in _visualUIElems) {
                    var UIElem = _visualUIElems[clientID];
                    UIElem.RemoveSelf();
                    delete _visualUIElems[clientID];
                }
            }
            var modelHandlers = {
                onCLOAdded: function (clo) {
                    switch (clo.GetType()) {
                        case CLOTypes.Feature:
                            addFeatureElem(clo);
                            break;
                        case CLOTypes.Relation:
                            addRelationElem(clo);
                            break;
                        case CLOTypes.GroupRelation:
                            addGroupRelationElem(clo);
                            break;
                        case CLOTypes.CompositionRule:
                            addCompositionRuleElem(clo);
                            break;
                    }
                },
                onCLORemoved: function (clo) {
                    var elem = _visualUIElems[clo.GetClientID()];
                    if (elem !== undefined) {
                        delete _visualUIElems[clo.GetClientID()];
                        elem.RemoveSelf();
                    }
                }
            }
            var featureElemHandlers = {
                onClicked: function (elem, ctrlKey) {
                    _cloSelectionManager.ToggleSingleCLO(elem.GetCLO(), ctrlKey);
                },
                onFeatureDragStarted: function (featureElem) {
                    if (featureElem.IsSelected() === true) {
                        // Start move for all the selected featureElems
                        var selectedFeatureCLOs = _cloSelectionManager.GetAllSelectedCLOs(CLOTypes.Feature);
                        for (var i = 0; i < selectedFeatureCLOs.length; i++) {
                            _visualUIElems[selectedFeatureCLOs[i].GetClientID()].StartMove();
                        }
                    }
                },
                onFeatureDragging: function (featureElem, dx, dy) {
                    if (featureElem.IsSelected() === true) {
                        // Move all the selected featureElems
                        var selectedFeatureCLOs = _cloSelectionManager.GetAllSelectedCLOs(CLOTypes.Feature);
                        for (var i = 0; i < selectedFeatureCLOs.length; i++) {
                            _visualUIElems[selectedFeatureCLOs[i].GetClientID()].MoveXYBy(dx, dy);
                        }
                    }
                }
            }
            var onElemClicked = function (elem, ctrlKey) {
                _cloSelectionManager.ToggleSingleCLO(elem.GetCLO(), ctrlKey);
            }

            // Inner modes
            VisualView.InnerStates = {};
            VisualView.InnerStates[Enums.VisualView.StateNames.Default] = {
                Name: "Default",
                EnterState: function () {
                    // Variables
                    var selectionRectangle = null, mouseDownPoint = null;

                    // Handlers for selection rectangle functionality
                    $(_canvasContainer).bind("mousedown.canvas", function (e) {

                        if (e.target.nodeName === "svg") {
                            e.preventDefault();
                            var initialX = e.pageX - $(_canvasContainer).offset().left + 0.5;
                            var initialY = e.pageY - $(_canvasContainer).offset().top + 0.5;
                            mouseDownPoint = { x: initialX, y: initialY };
                            selectionRectangle = _canvas.rect(mouseDownPoint.x, mouseDownPoint.y, 0, 0, 0).attr(UIStyles.Common.SelectionRectangle.Box.attr);
                        }
                    });
                    $(_canvasContainer).bind("mousemove.canvas", function (e) {
                        if (mouseDownPoint !== null) {
                            var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5);
                            var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5);
                            var dx = screenPosX - mouseDownPoint.x;
                            var dy = screenPosY - mouseDownPoint.y;

                            var xOffset = (dx < 0) ? dx : 0;
                            var yOffset = (dy < 0) ? dy : 0;
                            selectionRectangle.transform("T" + xOffset + "," + yOffset);
                            selectionRectangle.attr({ "width": Math.abs(dx), "height": Math.abs(dy) });
                        }
                    });
                    $(_canvasContainer).bind("mouseup.canvas", function (e) {
                        if (mouseDownPoint !== null) {

                            // Select elements lying within the selectionRectangle
                            if (e.ctrlKey !== true)
                                _cloSelectionManager.DeselectAllCLOs(); // clear selection ONLY if ctrl is not pressed
                            selectElementsInArea(selectionRectangle.getBBox());

                            // Clear variables and remove selection rectangle
                            mouseDownPoint = null;
                            selectionRectangle.remove();
                        }
                    });
                },
                LeaveState: function () {
                    $(_canvasContainer).unbind("click.canvas");
                    $(_canvasContainer).unbind("mousedown.canvas");
                    $(_canvasContainer).unbind("mouseup.canvas");
                    $(_canvasContainer).unbind("mousemove.canvas");
                    _cloSelectionManager.DeselectAllCLOs();
                }
            };
            VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewFeature] = {
                Name: "CreatingNewFeature",
                EnterState: function () {
                    _innerElems.infoMsgOverlay.html("Click to add a new Feature...").visible();

                    // Create a wireframe
                    var boxWidth = UIStyles.Feature.General.Box.Dimensions.width * Settings.ScaleModifier;
                    var boxHeight = UIStyles.Feature.General.Box.Dimensions.height * Settings.ScaleModifier;
                    _wireframes.featureWireframe = _canvas.rect(-100, -100, boxWidth, boxHeight, 0).attr(UIStyles.Feature.States.Wireframe.Box.attr);
                    // Attach a mouse move handler for the wireframe
                    $(_canvasContainer).bind("mousemove.moveWireframeFeature", function (e) {
                        var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2);
                        var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2);
                        _wireframes.featureWireframe.attr({ x: screenPosX, y: screenPosY });
                    });
                    // Attach click handler to create the actual Feature when clicked
                    $(_canvasContainer).bind("click.createFeature", function (e) {

                        // Get the position
                        var absolutePosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2) / Settings.ScaleModifier;
                        var absolutePosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2) / Settings.ScaleModifier;

                        // Create a new clientObject in the diagramDataStore
                        var newFeatureCLO = _dataStore.CreateNewCLO(CLOTypes.Feature);
                        newFeatureCLO.XPos(absolutePosX);
                        newFeatureCLO.YPos(absolutePosY);
                        _dataStore.GetCurrentModelCLO().Features.Add(newFeatureCLO);

                        // Go back to default state
                        _innerStateManager.SwitchToState(VisualView.InnerStates.Default.Name);
                    });

                },
                LeaveState: function () {
                    _innerElems.infoMsgOverlay.html("").hidden();

                    // Clear handlers
                    $(_canvasContainer).unbind("click.createFeature");
                    $(_canvasContainer).unbind("mousemove.moveWireframeFeature");
                    _wireframes.featureWireframe.remove();
                }
            };
            VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewRelation] = {
                Name: "CreatingNewRelation",
                EnterState: function () {
                    _innerElems.infoMsgOverlay.html("Select the parent feature for the Relation...").visible();

                    // Variables
                    var parentFeatureElem, childFeatureElem;

                    // First step handlers (let user select parent feature)
                    this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
                    featureElemHandlers.onClicked = firstStepClickHandler;
                    function firstStepClickHandler(featureElem) {
                        parentFeatureElem = featureElem;
                        _cloSelectionManager.ForceSelectSingleCLO(parentFeatureElem.GetCLO());

                        // Prepare for the second step
                        featureElemHandlers.onClicked = secondStepClickHandler;
                        _innerElems.infoMsgOverlay.html("Now select the child Feature for the Relation...").visible();
                    }

                    // Second step handlers (let user select child feature)
                    function secondStepClickHandler(featureElem) {
                        if (featureElem === parentFeatureElem) { // check whether the user is trying to select the same feature twice
                            _innerElems.infoMsgOverlay.html("Select a different child feature...");
                        } else {
                            childFeatureElem = featureElem;
                            _cloSelectionManager.ForceSelectSingleCLO(childFeatureElem.GetCLO());

                            // Create a new CLO
                            var newRelationCLO = _dataStore.CreateNewCLO(CLOTypes.Relation, [parentFeatureElem.GetCLO(), childFeatureElem.GetCLO()]);


                            // Add it to the Model and then switch to default state
                            _dataStore.GetCurrentModelCLO().Relations.Add(newRelationCLO);
                            _innerStateManager.SwitchToState(VisualView.InnerStates.Default.Name);
                        }
                    }
                },
                LeaveState: function () {
                    _innerElems.infoMsgOverlay.html("").hidden();

                    // Restore the old feature onclick handler
                    featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
                    delete this.normalFeatureElemOnclick;
                }
            }
            VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewGroupRelation] = {
                Name: "CreatingNewGroupRelation",
                EnterState: function () {
                    _innerElems.infoMsgOverlay.html("Select the parent feature for the Group Relation...").visible();

                    // Variables
                    var parentFeatureElem, childFeatureElems = [];

                    // First step handlers (let user select parent feature)
                    this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
                    featureElemHandlers.onClicked = firstStepClickHandler;
                    function firstStepClickHandler(featureElem) {
                        parentFeatureElem = featureElem;
                        _cloSelectionManager.ForceSelectSingleCLO(parentFeatureElem.GetCLO());

                        // Prepare for the second step
                        featureElemHandlers.onClicked = secondStepClickHandler;
                        _innerElems.infoMsgOverlay.html("Now select the child Features and double click the canvas to finish...").visible();
                    }

                    // Second step handlers (let user select child features)
                    function secondStepClickHandler(featureElem) {
                        if (featureElem === parentFeatureElem) { // check whether the user is trying to select the same feature twice
                            _innerElems.infoMsgOverlay.html("Select a different child feature...");
                        } else {

                            childFeatureElems.push(featureElem);
                            _cloSelectionManager.ForceSelectSingleCLO(featureElem.GetCLO());
                        }
                    }

                    // Handler when enter is pressed
                    $(_innerHtmlElem).bind("dblclick.groupRelation", function (e) {
                        if (parentFeatureElem && childFeatureElems.length > 1) { // there should be at least 2 child features

                            // Create a new CLO
                            var childFeatureCLOs = [];
                            for (var i = 0; i < childFeatureElems.length; i++) {
                                childFeatureCLOs.push(childFeatureElems[i].GetCLO());
                            }
                            var newGroupRelationCLO = _dataStore.CreateNewCLO(CLOTypes.GroupRelation, [parentFeatureElem.GetCLO(), childFeatureCLOs]);


                            // Add it to the Model and then switch to default state
                            _dataStore.GetCurrentModelCLO().GroupRelations.Add(newGroupRelationCLO);
                            _innerStateManager.SwitchToState(VisualView.InnerStates.Default.Name);

                            document.getSelection().removeAllRanges();
                        } else {
                            _innerElems.infoMsgOverlay.html("Select at least 1 parent Feature and 2 children Features...");
                            document.getSelection().removeAllRanges();
                        }

                    });
                },
                LeaveState: function () {
                    _innerElems.infoMsgOverlay.html("").hidden();

                    // Restore the old feature onclick handler
                    featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
                    delete this.normalFeatureElemOnclick;

                    // Remove other handlers
                    $(_innerHtmlElem).unbind("dblclick.groupRelation");
                }
            }
            VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewCompositionRule] = {
                Name: "CreatingNewCompositionRule",
                EnterState: function () {
                    _innerElems.infoMsgOverlay.html("Select the first feature for the Composition Rule...").visible();

                    // Variables
                    var firstFeatureElem, secondFeatureElem;

                    // First step handlers (let user select parent feature)
                    this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
                    featureElemHandlers.onClicked = firstStepClickHandler;
                    function firstStepClickHandler(featureElem) {
                        firstFeatureElem = featureElem;
                        _cloSelectionManager.ForceSelectSingleCLO(firstFeatureElem.GetCLO());

                        // Prepare for the second step
                        featureElemHandlers.onClicked = secondStepClickHandler;
                        _innerElems.infoMsgOverlay.html("Now select the second Feature...").visible();
                    }

                    // Second step handlers (let user select child feature)
                    function secondStepClickHandler(featureElem) {
                        if (featureElem === firstFeatureElem) { // check whether the user is trying to select the same feature twice
                            _innerElems.infoMsgOverlay.html("Select a different Feature...");
                        } else {
                            secondFeatureElem = featureElem;
                            _cloSelectionManager.ForceSelectSingleCLO(secondFeatureElem.GetCLO());

                            // Create a new CLO
                            var newCompositionRuleCLO = _dataStore.CreateNewCLO(CLOTypes.CompositionRule, [firstFeatureElem.GetCLO(), secondFeatureElem.GetCLO()]);

                            // Add it to the Model and then switch to default state
                            _dataStore.GetCurrentModelCLO().CompositionRules.Add(newCompositionRuleCLO);
                            _innerStateManager.SwitchToState(VisualView.InnerStates.Default.Name);
                        }
                    }
                },
                LeaveState: function () {
                    _innerElems.infoMsgOverlay.html("").hidden();

                    // Restore the old feature onclick handler
                    featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
                    delete this.normalFeatureElemOnclick;
                }
            }
        }
        return VisualView;
    });