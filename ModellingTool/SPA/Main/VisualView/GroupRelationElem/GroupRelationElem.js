define("Main/VisualView/GroupRelationElem/GroupRelationElem",
    [
        "Main/VisualView/CardinalityLabel/CardinalityLabel",
        "Main/VisualView/ConnectionElem/ConnectionElem"
    ],
    function (CardinalityLabel, ConnectionElem) {
        var GroupRelationElem = function (groupRelationCLO, parentFeatureElem, childFeatureElems, parentCanvasInstance) {

            // Fields
            var _groupRelationCLO = groupRelationCLO, _canvasInstance = parentCanvasInstance;
            var _currentState = Enums.UIElementStates.Unselected;
            var _innerElements = {
                cardinalityElement: null,
                connections: [],
                rootArc: null
            };
            var _this = this;

            // Properties
            this.GetType = function () {
                return Enums.VisualView.ElemTypes.GroupRelationElem;
            }
            this.GetCLO = function () {
                return _groupRelationCLO;
            }
            this.IsSelected = function () {
                return _currentState === Enums.UIElementStates.Selected;
            }

            // Private methods
            function makeSelectable() {
                //
                var handlers = {
                    onClick: function (e) {
                        _this.Clicked.RaiseEvent(e.ctrlKey);

                        // Prevent dom propagation - so VisualView canvas click bind doesnt get triggered
                        e.stopPropagation();
                    },
                    onMouseOver: function (e) {
                        for (var i = 0; i < _innerElements.connections.length; i++) {
                            _innerElements.connections[i].ShowGlow();
                        }
                    },
                    onMouseOut: function (e) {
                        for (var i = 0; i < _innerElements.connections.length; i++) {
                            _innerElements.connections[i].HideGlow();
                        }
                    }
                }
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    _innerElements.connections[i].MakeSelectable(handlers);
                }

                // Bind to CLO
                _groupRelationCLO.Selected.Changed.AddHandler(new EventHandler(function (val) {
                    _this.SetSelectedState(val === true ? Enums.UIElementStates.Selected : Enums.UIElementStates.Unselected);
                }));
            }
            function refresh() {
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    _innerElements.connections[i].RefreshGraphicalRepresentation();
                }

                if (_innerElements.cardinalityElement != null)
                    _innerElements.cardinalityElement.RefreshGraphicalRepresentation();
            }
            function getArcPath(firstConnection, lastConnection) {

                //
                var currentOrientationName = getEnumEntryNameByID(Enums.UIOrientationTypes, Settings.UIOrientation);

                // Get points
                var rootPoint = firstConnection.InnerElements.line.getPointAtLength(0);
                var pointA = firstConnection.InnerElements.line.getPointAtLength(UIStyles.GroupRelation.General.RootArc.Dimensions.Length * Settings.ScaleModifier);
                var pointB = lastConnection.InnerElements.line.getPointAtLength(UIStyles.GroupRelation.General.RootArc.Dimensions.Length * Settings.ScaleModifier);

                // Get arc modifiers
                var rx = SystemDefaults.Orientations[currentOrientationName].ArcModifiers.rx;
                var ry = SystemDefaults.Orientations[currentOrientationName].ArcModifiers.ry;
                var arcSweep = null;

                for (var key in SystemDefaults.Orientations[currentOrientationName].ArcDirection) {
                    var arcDirection = SystemDefaults.Orientations[currentOrientationName].ArcDirection[key];
                    if (arcDirection.Check(rootPoint, pointA) === true) {
                        arcSweep = arcDirection.ArcSweep;
                        break;
                    }
                }
                // Create the path
                var path = ["M", rootPoint.x.toFixed(3), rootPoint.y.toFixed(3),
                        "L", pointA.x.toFixed(3), pointA.y.toFixed(3),
                //"L", pointB.x.toFixed(3), pointB.y.toFixed(3), - straight lines
                        "A", rx, ry, 0, 0, arcSweep, pointB.x.toFixed(3), pointB.y.toFixed(3),
                        "L", rootPoint.x.toFixed(3), rootPoint.y.toFixed(3)].join(",");
                return path;
            }
            function refreshArc() {

                //Get the new path
                var newPath = getArcPath(_innerElements.connections[0], _innerElements.connections[_innerElements.connections.length - 1]);
                _innerElements.rootArc.attr({ path: newPath });
            }
            function getCardinalityElemPosition() {
                //
                var currentOrientationName = getEnumEntryNameByID(Enums.UIOrientationTypes, Settings.UIOrientation);

                var cardinalityDistance = SystemDefaults.Orientations[currentOrientationName].CardinalityDistances.GroupRelation;
                var line = _innerElements.connections[0].InnerElements.line;
                var labelPoint = line.getPointAtLength(cardinalityDistance);
                return labelPoint;
            }
            function toggleCardinalityElement() {

                //
                switch (Settings.DisplayCardinalities) {
                    // Full
                    case "Full": // show for everything
                        if (_innerElements.cardinalityElement === null) {
                            _innerElements.cardinalityElement = new CardinalityLabel(_groupRelationCLO.LowerBound(),
                                _groupRelationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                            _innerElements.cardinalityElement.Initialize();
                        }
                        _innerElements.cardinalityElement.Update(_groupRelationCLO.LowerBound(), _groupRelationCLO.UpperBound());
                        break;

                        // Partial
                    case "Partial": // only show for cardinal groups
                        if (_groupRelationCLO.GroupRelationType() === Enums.GroupRelationTypes.Cardinal) {
                            if (_innerElements.cardinalityElement == null) {
                                _innerElements.cardinalityElement = new CardinalityLabel(_groupRelationCLO.LowerBound(),
                                 _groupRelationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                                _innerElements.cardinalityElement.Initialize();
                            }
                            _innerElements.cardinalityElement.Update(_groupRelationCLO.LowerBound(), _groupRelationCLO.UpperBound());
                        } else {
                            if (_innerElements.cardinalityElement !== null) {
                                _innerElements.cardinalityElement.Delete();
                                _innerElements.cardinalityElement = null;
                            }
                        }
                        break;

                        // None
                    case "None": // hide all
                        if (_innerElements.cardinalityElement != null) {
                            _innerElements.cardinalityElement.Delete();
                            _innerElements.cardinalityElement = null;
                        }
                        break;
                }
            }

            // Init
            this.Initialize = function () {

                // Create UIConnections for each child Feature
                var groupRelationType = getEnumEntryNameByID(Enums.GroupRelationTypes, _groupRelationCLO.GroupRelationType());
                for (var i = 0; i < childFeatureElems.length; i++) {
                    var newConnection = new ConnectionElem( parentFeatureElem.GetBox(), childFeatureElems[i].GetBox(),
                        _groupRelationCLO.GetType(), groupRelationType, _canvasInstance);
                    newConnection.Initialize();
                    _innerElements.connections.push(newConnection);
                }

                // Create Arc
                var arcPath = getArcPath(_innerElements.connections[0], _innerElements.connections[_innerElements.connections.length - 1]);
                _innerElements.rootArc = _canvasInstance.path(arcPath).attr(UIStyles.GroupRelation.General.RootArc.attr);
                _innerElements.rootArc.attr(UIStyles.GroupRelation.SubTypes[groupRelationType].RootArc.attr);

                // Add handlers when parent/child feature elems are moving
                parentFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving"));
                for (var i = 0; i < childFeatureElems.length; i++) {
                    childFeatureElems[i].Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving"));
                }

                // Setup other characteristics and elements
                toggleCardinalityElement();
                makeSelectable();

                // Bind to the clo
                _groupRelationCLO.GroupRelationType.Changed.AddHandler(new EventHandler(onCLOGroupRelationTypeChanged));
                _groupRelationCLO.UpperBound.Changed.AddHandler(new EventHandler(function (newValue) {
                    toggleCardinalityElement();
                }));
                _groupRelationCLO.LowerBound.Changed.AddHandler(new EventHandler(function (newValue) {
                    toggleCardinalityElement();
                }));
            }

            // Public methods
            this.RefreshGraphicalRepresentation = function () {
                refresh();
                refreshArc();
            }
            this.SetSelectedState = function (state) {
                _currentState = state;
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    _innerElements.connections[i].SetSelectedState(state);
                }

            }
            this.IsWithinBounds = function (targetBbox) {
                var allConnectionsAreInBounds = true;
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    if (!_innerElements.connections[i].IsWithinBounds(targetBbox)) {
                        allConnectionsAreInBounds = false;
                        break;
                    }
                }

                return allConnectionsAreInBounds;
            }
            this.RemoveSelf = function () {

                // Remove elements
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    _innerElements.connections[i].RemoveSelf();
                }
                if (_innerElements.cardinalityElement !== null) {
                    _innerElements.cardinalityElement.RemoveSelf();
                    _innerElements.cardinalityElement = null
                }

                // Remove handlers when parent/child feature elems are moving
                parentFeatureElem.Moving.RemoveHandler("GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving");
                for (var i = 0; i < childFeatureElems.length; i++) {
                    childFeatureElems[i].Moving.RemoveHandler("GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving");
                }

                // Remove Arc
                _innerElements.rootArc.remove();
                _innerElements.rootArc = null;

            }

            // Events
            this.Clicked = new Event();

            // Event handlers
            var onRelatedFeatureMoving = function () {
                refresh();
                refreshArc();
            }
            var onCLOGroupRelationTypeChanged = function (newValue) {
                var newGroupRelationType = getEnumEntryNameByID(Enums.GroupRelationTypes, _groupRelationCLO.GroupRelationType());

                // Update
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    _innerElements.connections[i].Update(newGroupRelationType); //endConnector
                }
                _innerElements.rootArc.attr(UIStyles.GroupRelation.SubTypes[newGroupRelationType].RootArc.attr);
            }

        }
        return GroupRelationElem;
    });