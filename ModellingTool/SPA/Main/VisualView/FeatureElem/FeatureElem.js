define("Main/VisualView/FeatureElem/FeatureElem",
    [
    ], 
    function () {

        var FeatureElem = function (featureCLO, parentCanvasInstance) {

            // Fields
            var _featureCLO = featureCLO, _canvasInstance = parentCanvasInstance;
            var _currentState = Enums.UIElementStates.Unselected;
            var _outerElement = null, _glow = null;
            var _dontTriggerClickOnMouseUp = false; // special variable to avoid click being triggered on mouseup after a selected feature has been dragged (which would result in all the other selected ones being deselected)
            var _innerElements = {
                box: null,
                text: null
            };
            var _this = this;

            // Properties
            this.GetType = function () {
                return Enums.VisualView.ElemTypes.FeatureElem;
            }
            this.GetCLO = function () {
                return _featureCLO;
            }
            this.IsSelected = function () {
                return _currentState === Enums.UIElementStates.Selected;
            }
            this.GetBox = function () {
                return _outerElement;
            };

            // Private methods
            function makeSelectable() {

                // Hover effect to show it is selectable
                _outerElement.mouseover(function (e) {
                    if (_glow === null) {
                        _glow = _innerElements.box.glow(UIStyles.Common.Glow.attr);
                    }
                }).mouseout(function (e) {
                    if (_glow != null) {
                        _glow.remove();
                        _glow = null;
                    }
                });

                // Make it clickable 
                _outerElement.click(function (e) {
                    if (_dontTriggerClickOnMouseUp === false) {
                        // Raise events
                        _this.Clicked.RaiseEvent(e.ctrlKey);
                    }
                    else {
                        _dontTriggerClickOnMouseUp = false;
                    }
                });

                // Bind to CLO
                _featureCLO.Selected.Changed.AddHandler(new EventHandler(function (val) {
                    _this.SetSelectedState(val === true ? Enums.UIElementStates.Selected : Enums.UIElementStates.Unselected);
                }));
            }
            function makeDraggable() {

                // Drag and droppable
                var start = function () {
                    _this.DragStarted.RaiseEvent();
                };
                move = function (dx, dy) {
                    if (_glow !== null) {
                        _glow.remove();
                        _glow = null;
                    }

                    if (dx !== 0 && _this.IsSelected()) {
                        _dontTriggerClickOnMouseUp = true;
                    }

                    _this.Dragging.RaiseEvent(dx, dy);
                };
                up = function () {

                };
                _outerElement.drag(move, start, up);
            }
            function getCalculatedPosAndDimensions() {
                var parameters = {
                    screenPos: {
                        x: featureCLO.XPos() * Settings.ScaleModifier, y: featureCLO.YPos() * Settings.ScaleModifier
                    },
                    boxDimensions: {
                        width: UIStyles.Feature.General.Box.Dimensions.width * Settings.ScaleModifier,
                        height: UIStyles.Feature.General.Box.Dimensions.height * Settings.ScaleModifier
                    },
                    fontSize: parseFloat(UIStyles.Feature.General.Text["font-size"]) * Settings.ScaleModifier
                }

                return parameters;
            }

            // Init
            this.Initialize = function () {

                // Size and pos calculations
                var parameters = getCalculatedPosAndDimensions();

                // Create elements            
                _innerElements.box = _canvasInstance.rect(parameters.screenPos.x, parameters.screenPos.y, parameters.boxDimensions.width, parameters.boxDimensions.height, 0);
                _innerElements.box.attr(UIStyles.Feature.States[_currentState].Box.attr);
                _innerElements.text = _canvasInstance.text(parameters.boxDimensions.width / 2 + parameters.screenPos.x, parameters.boxDimensions.height / 2 + parameters.screenPos.y,
                    _featureCLO.Name()).attr(UIStyles.Feature.States[_currentState].Text.attr);
                _innerElements.text.attr({ "font-size": parameters.fontSize });
                _outerElement = _canvasInstance.rect(parameters.screenPos.x, parameters.screenPos.y, parameters.boxDimensions.width, parameters.boxDimensions.height).attr(UIStyles.Common.OuterElement.attr);

                // Setup special handlers for interactions
                makeSelectable();
                makeDraggable();

                // Bind to the featureCLO
                _featureCLO.Name.Changed.AddHandler(new EventHandler(function (newName) {
                    _innerElements.text.attr({ text: newName });

                }));
            }

            // Public methods
            this.IsWithinBounds = function (targetBbox) {

                // Check whether the points are within the targetBbox
                var ownBbox = _outerElement.getBBox();
                if (Raphael.isPointInsideBBox(targetBbox, ownBbox.x, ownBbox.y) && Raphael.isPointInsideBBox(targetBbox, ownBbox.x2, ownBbox.y2)) {
                    return true;
                } else {
                    return false;
                }
            }
            this.RemoveSelf = function () {

                // Remove elements
                _outerElement.remove();
                _innerElements.box.remove();
                _innerElements.text.remove();
                if (_glow !== null)
                    _glow.remove();
            }
            this.SetSelectedState = function (state) {
                _currentState = state;
                _innerElements.box.attr(UIStyles.Feature.States[state].Box.attr);
            }
            this.StartMove = function () {

                // Store original coordinates for self and inner elements
                _outerElement.originalx = _outerElement.attr("x");
                _outerElement.originaly = _outerElement.attr("y");
                for (var innerElemKey in _innerElements) {
                    var innerElem = _innerElements[innerElemKey];
                    innerElem.originalx = innerElem.attr("x");
                    innerElem.originaly = innerElem.attr("y");
                }
            }
            this.MoveXYBy = function (dx, dy) {

                // Update pos of outerElement and all innerElems
                _outerElement.attr({ x: _outerElement.originalx + dx, y: _outerElement.originaly + dy });
                for (var innerElemKey in _innerElements) {
                    var innerElem = _innerElements[innerElemKey];
                    innerElem.attr({ x: innerElem.originalx + dx, y: innerElem.originaly + dy });
                }

                // Update CLO
                _featureCLO.XPos((_outerElement.originalx + dx) / Settings.ScaleModifier);
                _featureCLO.YPos((_outerElement.originaly + dy) / Settings.ScaleModifier);

                // Raise events
                _this.Moving.RaiseEvent(dx, dy);
            }
            this.ReverseCoordinates = function () {

                // Reverse absolute position
                var x = _featureCLO.XPos();
                var y = _featureCLO.YPos();
                _featureCLO.XPos(y);
                _featureCLO.YPos(x);

            }
            this.RefreshGraphicalRepresentation = function () {

                // Size and pos REcalculations
                var parameters = getCalculatedPosAndDimensions();

                // Re set parameters
                _innerElements.box.attr({
                    x: parameters.screenPos.x,
                    y: parameters.screenPos.y,
                    width: parameters.boxDimensions.width,
                    height: parameters.boxDimensions.height
                });
                _outerElement.attr({
                    x: parameters.screenPos.x,
                    y: parameters.screenPos.y,
                    width: parameters.boxDimensions.width,
                    height: parameters.boxDimensions.height
                });
                _innerElements.text.attr({
                    x: parameters.boxDimensions.width / 2 + parameters.screenPos.x,
                    y: parameters.boxDimensions.height / 2 + parameters.screenPos.y,
                    "font-size": parameters.fontSize
                });
            }

            // Events
            this.Clicked = new Event();
            this.DragStarted = new Event();
            this.Dragging = new Event();
            this.Moving = new Event();
        }
        return FeatureElem;
    });