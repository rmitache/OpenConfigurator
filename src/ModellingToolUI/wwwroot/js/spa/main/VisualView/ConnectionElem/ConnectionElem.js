define("Main/VisualView/ConnectionElem/ConnectionElem",
    [
        "Main/VisualView/ConnectorElem/ConnectorElem"
    ],
    function (ConnectorElem) {
        var ConnectionElem = function (parentBox, childBox, parentElemType, parentElemSubType, parentCanvasInstance, invertOrientation) {

            // Fields
            var _canvasInstance = parentCanvasInstance;
            var _innerElements = {
                line: null,
                connectors: {
                    startConnector: null,
                    endConnector: null
                }
            };
            var _currentPath = null, _handlers = null;
            var _outerElement = null, _glow = null;
            var _parentElemType = parentElemType, _parentElemSubType = parentElemSubType;
            var _invertOrientation = (invertOrientation !== undefined) ? invertOrientation : null; //parameter used to force the path to draw in the opposite orientation
            var _currentState = Enums.UIElementStates.Unselected;
            var _this = this;

            // Properties
            this.GetCurrentPath = function () {
                return _currentPath;
            }
            this.InnerElements = _innerElements;

            // Private methods
            function getPath(objA, objB) {

                // Variables
                var bb1 = objA.getBBox();
                var bb2 = objB.getBBox();
                var objAcenter = {
                    x: bb1.x + bb1.width / 2,
                    y: bb1.y + bb1.height / 2
                };
                var objBcenter = {
                    x: bb2.x + bb2.width / 2,
                    y: bb2.y + bb2.height / 2
                };
                var connectionPoints = {
                    firstObject: {
                        top: { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
                        bottom: { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
                        left: { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
                        right: { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 }
                    },
                    secondObject: {
                        top: { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
                        bottom: { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
                        left: { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
                        right: { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
                    }
                };

                // Determine the orientation
                var currentOrientation = null;
                if (Settings.UIOrientation !== false) {
                    currentOrientation = getEnumEntryNameByID(Enums.UIOrientationTypes, Settings.UIOrientation); //use default fixed orientation without calculating angle
                }
                else {
                    var centerdx = objBcenter.x - objAcenter.x, centerdy = objBcenter.y - objAcenter.y;
                    var angle = Math.atan2(-centerdy, centerdx) * 180 / Math.PI;
                    angle = parseInt(angle.toFixed());
                    if (angle < 0)
                        angle += 360;
                    for (var key in SystemDefaults.Orientations) {
                        var orientation = SystemDefaults.Orientations[key];
                        for (var i = 0; i < orientation.angleIntervals.length; i++) {
                            if (angle >= orientation.angleIntervals[i].min && angle <= orientation.angleIntervals[i].max) {
                                currentOrientation = orientation.name;
                                break;
                            }
                        }
                    }
                }

                // Invert orientation if necessary
                if (invertOrientation)
                    currentOrientation = SystemDefaults.Orientations[currentOrientation].Opposite;

                // Determine which connection points in the current orientation make the shortest path
                var distances = [], points = {};
                for (var i = 0; i < SystemDefaults.Orientations[currentOrientation].Connections.length; i++) {
                    var con = SystemDefaults.Orientations[currentOrientation].Connections[i];
                    var x1 = connectionPoints.firstObject[con[0]].x, y1 = connectionPoints.firstObject[con[0]].y;
                    var x2 = connectionPoints.secondObject[con[1]].x, y2 = connectionPoints.secondObject[con[1]].y;

                    var dx = Math.abs(x1 - x2);
                    var dy = Math.abs(y1 - y2);
                    var distance = dx + dy;

                    distances[i] = distance;
                    points[distance] = {
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2,
                        curveModifier: SystemDefaults.Orientations[currentOrientation].CurveModifiers[i]
                    };
                }
                var closestConnection = points[Math.min.apply(Math, distances)];

                // Create path
                var path = null;
                if (Settings.DrawCurves === true) {
                    path = [["M", closestConnection.x1.toFixed(1), closestConnection.y1.toFixed(1)],
                    ["C",
                    closestConnection.x1 + closestConnection.curveModifier.x * Settings.ScaleModifier,
                    closestConnection.y1 + closestConnection.curveModifier.y * Settings.ScaleModifier,
                    closestConnection.x2 - closestConnection.curveModifier.x * Settings.ScaleModifier,
                    closestConnection.y2 - closestConnection.curveModifier.y * Settings.ScaleModifier,
                    closestConnection.x2.toFixed(1), closestConnection.y2.toFixed(1)]];
                } else {
                    path = ["M", closestConnection.x1.toFixed(3), closestConnection.y1.toFixed(3), "L", closestConnection.x2.toFixed(3), closestConnection.y2.toFixed(3)].join(","); //line
                }


                var returnObj = {
                    path: path,
                    startObj: objA,
                    endObj: objB,
                    StartPoint: {
                        x: closestConnection.x1,
                        y: closestConnection.y1
                    },
                    EndPoint: {
                        x: closestConnection.x2,
                        y: closestConnection.y2
                    }
                };
                return returnObj;

            }
            function makeSelectable() {
                if (_handlers != null) {
                    // Selectable
                    _outerElement.click(function (e) {
                        _handlers.onClick(e);
                    });

                    // Hoverable
                    _outerElement.mouseover(function (e) {
                        _handlers.onMouseOver(e);
                    }).mouseout(function (e) {
                        _handlers.onMouseOut(e);
                    });
                }
            }
            function refresh() {

                // Calculate a new path
                _currentPath = getPath(parentBox, childBox);

                // Refresh line 
                _outerElement.attr({ path: _currentPath.path });
                _innerElements.line.attr({ path: _currentPath.path });

                // Refresh position of connectors
                if (_innerElements.connectors.startConnector !== null) {
                    _innerElements.connectors.startConnector.RefreshGraphicalRepresentation();
                }
                if (_innerElements.connectors.endConnector !== null) {
                    _innerElements.connectors.endConnector.RefreshGraphicalRepresentation();
                }
            }
            function getCurrentStyle() {
                var commonStyle = UIStyles.Common.Connection.States[_currentState];
                var generalStyle = UIStyles[_parentElemType].General.Connection;
                var subTypeStyle = UIStyles[_parentElemType].SubTypes[_parentElemSubType].Connection;
                var currentStyle = $.extend(true, {}, commonStyle, generalStyle, subTypeStyle);

                return currentStyle;
            }

            // Initialize
            this.Initialize = function () {

                // Create line
                _currentPath = getPath(parentBox, childBox);
                _innerElements.line = _canvasInstance.path(_currentPath.path);
                var currentStyle = getCurrentStyle();
                _innerElements.line.attr(currentStyle.Line.attr);

                // Create connectors
                if (currentStyle.Connectors !== undefined) {
                    if (currentStyle.Connectors.StartConnector !== undefined) {
                        _innerElements.connectors.startConnector = new ConnectorElem(_this,
                            currentStyle.Connectors.StartConnector, currentStyle.Connectors.StartConnector.attr, Enums.ConnectorPositionTypes.StartPoint, _canvasInstance);
                        _innerElements.connectors.startConnector.Initialize();
                    }
                    if (currentStyle.Connectors.EndConnector !== undefined) {
                        _innerElements.connectors.endConnector = new ConnectorElem(_this, currentStyle.Connectors.EndConnector,
                            currentStyle.Connectors.EndConnector.attr, Enums.ConnectorPositionTypes.EndPoint, _canvasInstance);
                        _innerElements.connectors.endConnector.Initialize();
                    }
                }

                // Create the main outer element
                _outerElement = _canvasInstance.path(_currentPath.path).attr(UIStyles.Common.OuterElement.attr);
            }

            // Public functions
            this.RefreshGraphicalRepresentation = function () {
                refresh();
            }
            this.IsWithinBounds = function (targetBbox) {

                // Check whether the points are within the targetBbox
                if (Raphael.isPointInsideBBox(targetBbox, _currentPath.StartPoint.x, _currentPath.StartPoint.y) && Raphael.isPointInsideBBox(targetBbox, _currentPath.EndPoint.x, _currentPath.EndPoint.y)) {
                    return true;
                } else {
                    return false;
                }
            }
            this.SetSelectedState = function (state) {

                //
                _currentState = state;
                _innerElements.line.attr(UIStyles.Common.Connection.States[_currentState].Line.attr);
                _this.Update(_parentElemSubType); //hack-fix for state style overriding line style in CompositionRule
            }
            this.ShowGlow = function () {
                if (_glow === null) {
                    _glow = _innerElements.line.glow(UIStyles.Common.Glow.attr);
                }
            }
            this.HideGlow = function () {
                if (_glow !== null) {
                    _glow.remove();
                    _glow = null;
                }
            }
            this.MakeSelectable = function (handlers) {
                _handlers = handlers;
                makeSelectable();
            }
            this.RemoveSelf = function () {

                //Remove Raphael objects
                _innerElements.line.remove();
                if (_innerElements.connectors.endConnector != null) {
                    _innerElements.connectors.endConnector.RemoveSelf();
                    _innerElements.connectors.endConnector = null;
                }
                if (_innerElements.connectors.startConnector != null) {
                    _innerElements.connectors.startConnector.RemoveSelf();
                    _innerElements.connectors.startConnector = null;
                }
                _outerElement.remove();
                _outerElement = null;
                if (_glow != null) {
                    _glow.remove();
                    _glow = null;
                }
            }
            this.Update = function (newParentElementSubType) {
                _parentElemSubType = newParentElementSubType;

                // Get the current style
                var currentStyle = getCurrentStyle();

                // Update line
                _innerElements.line.attr(currentStyle.Line.attr);

                // Update Connectors
                if (_innerElements.connectors.startConnector != null) {
                    _innerElements.connectors.startConnector.Update(currentStyle.Connectors.StartConnector.attr);
                }
                if (_innerElements.connectors.endConnector != null) {
                    _innerElements.connectors.endConnector.Update(currentStyle.Connectors.EndConnector.attr);

                }
            }
        }
        return ConnectionElem;
    });