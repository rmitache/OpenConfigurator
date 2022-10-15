define("Main/PropertyEditor/CompositionRuleInnerEditor/CompositionRuleInnerEditor",
    [
        "text!Main/PropertyEditor/CompositionRuleInnerEditor/CompositionRuleInnerEditor.html" // html markup
    ],
    function (HTMLmarkup) {
        var CompositionRuleInnerEditor = function (container, compositionRuleCLO) {

            // Fields
            var _container = container, _compositionRuleCLO = compositionRuleCLO;
            var _innerHtmlElem;
            var _this = this;
            var _koCompositionRuleTypes = createKOObservableArrayFromEnum(Enums.CompositionRuleTypes);
            var _vm = {
                CompositionRuleType: _compositionRuleCLO.CompositionRuleType,
                CompositionRuleTypes: _koCompositionRuleTypes,
                Name: _compositionRuleCLO.Name.extend({
                    required: true
                }),
                Identifier: _compositionRuleCLO.Identifier.extend({
                    required: true
                })
            };
            _vm.Name.OriginalValue = _compositionRuleCLO.Name();
            _vm.Identifier.OriginalValue = _compositionRuleCLO.Identifier();

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
                if (!_compositionRuleCLO.Name.isValid() || !_compositionRuleCLO.Identifier.isValid()) {
                    _compositionRuleCLO.Name(_vm.Name.OriginalValue);
                    _compositionRuleCLO.Identifier(_vm.Identifier.OriginalValue);
                }

                // Clean up CLO from validation
                _compositionRuleCLO.Name.extend({ validatable: false });
                _compositionRuleCLO.Identifier.extend({ validatable: false });

                // Clean up bindings and html
                ko.cleanNode(_innerHtmlElem[0]);
                _innerHtmlElem.remove();
            }
        }
        return CompositionRuleInnerEditor;
    });