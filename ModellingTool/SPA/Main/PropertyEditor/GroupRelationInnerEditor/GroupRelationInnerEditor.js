define("Main/PropertyEditor/GroupRelationInnerEditor/GroupRelationInnerEditor",
    [
        "text!Main/PropertyEditor/GroupRelationInnerEditor/GroupRelationInnerEditor.html" // html markup
    ],
    function (HTMLmarkup) {
        var GroupRelationInnerEditor = function (container, groupRelationCLO) {

            // Fields
            var _container = container, _groupRelationCLO = groupRelationCLO;
            var _innerHtmlElem;
            var _this = this;
            var _vm = {
                GroupRelationType: _groupRelationCLO.GroupRelationType,
                GroupRelationTypes: createKOObservableArrayFromEnum(Enums.GroupRelationTypes),
                Identifier: _groupRelationCLO.Identifier.extend({
                    required: true,
                }),
                LowerBoundEnabled: ko.computed(function () {
                    return _groupRelationCLO.FixedLowerBound() === null;
                }, _vm),
                UpperBoundEnabled: ko.computed(function () {
                    return _groupRelationCLO.FixedUpperBound() === null;
                }, _vm),
                LowerBound: _groupRelationCLO.LowerBound.extend({
                    number: true,
                    required: true,
                    min: 0,
                    maxObs: _groupRelationCLO.UpperBound
                }),
                UpperBound: _groupRelationCLO.UpperBound.extend({
                    number: true,
                    required: true,
                    max: _groupRelationCLO.ChildFeatures.GetLength(),
                    minObs: _groupRelationCLO.LowerBound
                })
            };
            _vm.Identifier.OriginalValue = _groupRelationCLO.Identifier();
            _vm.LowerBound.OriginalValue = _groupRelationCLO.LowerBound();
            _vm.UpperBound.OriginalValue = _groupRelationCLO.UpperBound();

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Apply bindings
                ko.applyBindings(_vm, _innerHtmlElem[0]);

                // Event handlers
                _groupRelationCLO.GroupRelationType.Changed.AddHandler(new EventHandler(function (newValue) {
                    _vm.LowerBound.OriginalValue = _groupRelationCLO.LowerBound();
                    _vm.UpperBound.OriginalValue = _groupRelationCLO.UpperBound();
                }));
            }

            // Public methods
            this.RemoveSelf = function () {

                // Revert if invalid
                if (!_groupRelationCLO.LowerBound.isValid() || !_groupRelationCLO.UpperBound.isValid() || !_groupRelationCLO.Identifier.isValid()) {
                    _groupRelationCLO.Identifier(_vm.Identifier.OriginalValue);
                    _groupRelationCLO.LowerBound(_vm.LowerBound.OriginalValue);
                    _groupRelationCLO.UpperBound(_vm.UpperBound.OriginalValue);
                }

                // Clean up CLO from validation
                _groupRelationCLO.Identifier.extend({ validatable: false });
                _groupRelationCLO.LowerBound.extend({ validatable: false });
                _groupRelationCLO.UpperBound.extend({ validatable: false });

                // Clean up bindings and html
                ko.cleanNode(_innerHtmlElem[0]);
                _innerHtmlElem.remove();
            }
        }
        return GroupRelationInnerEditor;
    });
