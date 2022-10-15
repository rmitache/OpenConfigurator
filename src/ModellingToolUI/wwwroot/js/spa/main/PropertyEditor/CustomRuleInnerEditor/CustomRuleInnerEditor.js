define("Main/PropertyEditor/CustomRuleInnerEditor/CustomRuleInnerEditor",
    [
        "text!Main/PropertyEditor/CustomRuleInnerEditor/CustomRuleInnerEditor.html" // html markup
    ],
    function (HTMLmarkup) {

        var CustomRuleInnerEditor = function (container, customRuleCLO) {

            // Fields
            var _container = container, _customRuleCLO = customRuleCLO;
            var _innerHtmlElem;
            var _innerElems = {
                attributesContainer: null,
                focusElem: null
            };
            var _this = this;
            var _vm = {
                Name: _customRuleCLO.Name.extend({
                    required: true
                }),
                Identifier: _customRuleCLO.Identifier.extend({
                    required: true
                }),
                Expression: _customRuleCLO.Expression
            }
            _vm.Name.OriginalValue = _customRuleCLO.Name();
            _vm.Identifier.OriginalValue = _customRuleCLO.Identifier();

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to html elems
                _innerElems.focusElem = $(_innerHtmlElem).find("#NameTextbox");

                // Apply bindings
                ko.applyBindings(_vm, _innerHtmlElem[0]);

                // Select default elem
                setTimeout(function () {
                    _innerElems.focusElem.select();
                }, 0);
            }

            // Public methods
            this.RemoveSelf = function () {
                // Revert if invalid
                if (!_customRuleCLO.Name.isValid() || !_customRuleCLO.Identifier.isValid()) {
                    _customRuleCLO.Name(_vm.Name.OriginalValue);
                    _customRuleCLO.Identifier(_vm.Identifier.OriginalValue);
                }

                // Clean up CLO from validation
                _customRuleCLO.Name.extend({ validatable: false });
                _customRuleCLO.Identifier.extend({ validatable: false });

                // Clean up bindings
                ko.cleanNode(_innerHtmlElem[0]);
                _innerHtmlElem.remove();
            }
        }
        return CustomRuleInnerEditor;
    });
