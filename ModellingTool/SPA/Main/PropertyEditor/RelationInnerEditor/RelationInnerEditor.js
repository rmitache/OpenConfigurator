define("Main/PropertyEditor/RelationInnerEditor/RelationInnerEditor",
    [
        "text!Main/PropertyEditor/RelationInnerEditor/RelationInnerEditor.html" // html markup
    ],
    function (HTMLmarkup) {
        var RelationInnerEditor = function (container, relationCLO) {

            // Fields
            var _container = container, _relationCLO = relationCLO;
            var _innerHtmlElem;
            var _this = this;
            var _vm = {
                RelationType: _relationCLO.RelationType,
                RelationTypes: createKOObservableArrayFromEnum(Enums.RelationTypes),
                Identifier: _relationCLO.Identifier,
                LowerBoundEnabled: ko.computed(function () {
                    return _relationCLO.FixedLowerBound() === null;
                }, _vm),
                UpperBoundEnabled: ko.computed(function () {
                    return _relationCLO.FixedUpperBound() === null;
                }, _vm),
                LowerBound: _relationCLO.LowerBound.extend({
                    number: true,
                    required: true,
                    min: 0,
                    maxObs: _relationCLO.UpperBound
                }),
                UpperBound: _relationCLO.UpperBound.extend({
                    number: true,
                    required: true,
                    min: 1,
                    minObs: _relationCLO.LowerBound
                })
            };
            _vm.LowerBound.OriginalValue = _relationCLO.LowerBound();
            _vm.UpperBound.OriginalValue = _relationCLO.UpperBound();

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Apply bindings
                ko.applyBindings(_vm, _innerHtmlElem[0]);
            }

            // Public methods
            this.RemoveSelf = function () {

                // Revert if invalid
                if (!_relationCLO.LowerBound.isValid() || !_relationCLO.UpperBound.isValid()) {
                    _relationCLO.LowerBound(_vm.LowerBound.OriginalValue);
                    _relationCLO.UpperBound(_vm.UpperBound.OriginalValue);
                }

                // Clean up CLO from validation
                _relationCLO.LowerBound.extend({ validatable: false });
                _relationCLO.UpperBound.extend({ validatable: false });

                // Clean up bindings and html
                ko.cleanNode(_innerHtmlElem[0]);
                _innerHtmlElem.remove();
            }
        }
        return RelationInnerEditor;
    });