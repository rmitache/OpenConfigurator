define("Main/VisualView/CompositionRuleElem/CompositionRuleElem",
    [
        "Main/VisualView/ConnectionElem/ConnectionElem"
    ],
    function (ConnectionElem) {
        var CompositionRuleElem = function (compositionRuleCLO, firstFeatureElem, secondFeatureElem, parentCanvasInstance) {

            // Fields
            var _compositionRuleCLO = compositionRuleCLO, _canvasInstance = parentCanvasInstance;
            var _currentState = Enums.UIElementStates.Unselected;
            var _innerElements = {
                connection: null
            };
            var _this = this;

            // Properties
            this.GetType = function () {
                return Enums.VisualView.ElemTypes.CompositionRuleElem;
            }
            this.GetCLO = function () {
                return _compositionRuleCLO;
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
                _compositionRuleCLO.Selected.Changed.AddHandler(new EventHandler(function (val) {
                    _this.SetSelectedState(val === true ? Enums.UIElementStates.Selected : Enums.UIElementStates.Unselected);
                }));
            }
            function refresh() {
                _innerElements.connection.RefreshGraphicalRepresentation();
            }

            // Init
            this.Initialize = function () {

                // Create a new UIConnection
                var compositionRuleType = getEnumEntryNameByID(Enums.CompositionRuleTypes, _compositionRuleCLO.CompositionRuleType());
                _innerElements.connection = new ConnectionElem(firstFeatureElem.GetBox(), secondFeatureElem.GetBox(),
                    _compositionRuleCLO.GetType(), compositionRuleType, _canvasInstance, true);
                _innerElements.connection.Initialize();

                // Add handlers when parent/child feature elems are moving
                firstFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving"));
                secondFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving"));

                // Setup other characteristics and elements
                makeSelectable();

                // Bind to the clo
                _compositionRuleCLO.CompositionRuleType.Changed.AddHandler(new EventHandler(onCLOCompositionRuleTypeChanged));
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

                // Remove references and bind to them
                firstFeatureElem.Moving.RemoveHandler("CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving");
                secondFeatureElem.Moving.RemoveHandler("CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving");
            }

            // Events
            this.Clicked = new Event();

            // Event handlers
            var onRelatedFeatureMoving = function () {
                refresh();
            }
            var onCLOCompositionRuleTypeChanged = function (newValue) {
                var newCompositionRuleType = getEnumEntryNameByID(Enums.CompositionRuleTypes, _compositionRuleCLO.CompositionRuleType());
                _innerElements.connection.Update(newCompositionRuleType);
            }
        }
        return CompositionRuleElem;
    });