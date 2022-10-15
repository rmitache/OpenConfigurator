define("Main/VisualView/RelationElem/RelationElem",
    [
        "Main/VisualView/CardinalityLabel/CardinalityLabel",
        "Main/VisualView/ConnectionElem/ConnectionElem"

    ],
    function (CardinalityLabel, ConnectionElem) {

        var RelationElem = function (relationCLO, parentFeatureElem, childFeatureElem, parentCanvasInstance) {

            // Fields
            var _relationCLO = relationCLO, _canvasInstance = parentCanvasInstance;
            var _currentState = Enums.UIElementStates.Unselected;
            var _innerElements = {
                cardinalityElement: null,
                connection: null
            };
            var _this = this;

            // Properties
            this.GetType = function () {
                return Enums.VisualView.ElemTypes.RelationElem;
            }
            this.GetCLO = function () {
                return _relationCLO;
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
                        _innerElements.connection.ShowGlow();
                    },
                    onMouseOut: function (e) {
                        _innerElements.connection.HideGlow();
                    }
                }
                _innerElements.connection.MakeSelectable(handlers);

                // Bind to CLO
                _relationCLO.Selected.Changed.AddHandler(new EventHandler(function (val) {
                    _this.SetSelectedState(val === true ? Enums.UIElementStates.Selected : Enums.UIElementStates.Unselected);
                }));
            }
            function refresh() {
                _innerElements.connection.RefreshGraphicalRepresentation();
                if (_innerElements.cardinalityElement != null)
                    _innerElements.cardinalityElement.RefreshGraphicalRepresentation();
            }
            function getCardinalityElemPosition() {
                var currentOrientationName = getEnumEntryNameByID(Enums.UIOrientationTypes, Settings.UIOrientation);
                var cardinalityDistance = SystemDefaults.Orientations[currentOrientationName].CardinalityDistances.Relation;
                var line = _innerElements.connection.InnerElements.line;
                var labelPoint = line.getPointAtLength(line.getTotalLength() - cardinalityDistance);
                return labelPoint;
            }
            function toggleCardinalityElement() {
                switch (Settings.DisplayCardinalities) {
                    // Full
                    case "Full": // show for everything
                        if (_innerElements.cardinalityElement === null) {
                            _innerElements.cardinalityElement = new CardinalityLabel(_relationCLO.LowerBound(), _relationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                            _innerElements.cardinalityElement.Initialize();
                        }
                        _innerElements.cardinalityElement.Update(_relationCLO.LowerBound(), _relationCLO.UpperBound());
                        break;

                        // Partial
                    case "Partial": // only show for cloneable Relations
                        if (_relationCLO.RelationType() === Enums.RelationTypes.Cloneable) {
                            if (_innerElements.cardinalityElement == null) {
                                _innerElements.cardinalityElement = new CardinalityLabel(_relationCLO.LowerBound(), _relationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                                _innerElements.cardinalityElement.Initialize();
                            }
                            _innerElements.cardinalityElement.Update(_relationCLO.LowerBound(), _relationCLO.UpperBound());
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

                // Create a new UIConnection
                var relationType = getEnumEntryNameByID(Enums.RelationTypes, _relationCLO.RelationType());
                _innerElements.connection = new ConnectionElem(parentFeatureElem.GetBox(), childFeatureElem.GetBox(), _relationCLO.GetType(), relationType, _canvasInstance);
                _innerElements.connection.Initialize();

                // Add handlers when parent/child feature elems are moving
                parentFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "Relation_" + _relationCLO.GetClientID() + "_OnMoving"));
                childFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "Relation_" + _relationCLO.GetClientID() + "_OnMoving"));

                // Setup other characteristics and elements
                toggleCardinalityElement();
                makeSelectable();

                // Bind to the clo
                _relationCLO.RelationType.Changed.AddHandler(new EventHandler(onCLORelationTypeChanged));
                _relationCLO.UpperBound.Changed.AddHandler(new EventHandler(function (newValue) {
                    toggleCardinalityElement();
                }));
                _relationCLO.LowerBound.Changed.AddHandler(new EventHandler(function (newValue) {
                    toggleCardinalityElement();
                }));
            }

            // Public methods
            this.RefreshGraphicalRepresentation = function () {
                refresh();
            }
            this.SetSelectedState = function (state) {
                _currentState = state;
                _innerElements.connection.SetSelectedState(state);
            }
            this.IsWithinBounds = function (targetBbox) {
                return _innerElements.connection.IsWithinBounds(targetBbox);
            }
            this.RemoveSelf = function () {

                // Remove elements
                _innerElements.connection.RemoveSelf();
                if (_innerElements.cardinalityElement !== null)
                    _innerElements.cardinalityElement.RemoveSelf();

                // Remove references and bind to them
                parentFeatureElem.Moving.RemoveHandler("Relation_" + _relationCLO.GetClientID() + "_OnMoving");
                childFeatureElem.Moving.RemoveHandler("Relation_" + _relationCLO.GetClientID() + "_OnMoving");
            }

            // Events
            this.Clicked = new Event();

            // Event handlers
            var onRelatedFeatureMoving = function () {
                refresh();
            }
            var onCLORelationTypeChanged = function (newValue) {
                var newRelationType = getEnumEntryNameByID(Enums.RelationTypes, _relationCLO.RelationType());
                _innerElements.connection.Update(newRelationType);
            }
        }
        return RelationElem;
    });