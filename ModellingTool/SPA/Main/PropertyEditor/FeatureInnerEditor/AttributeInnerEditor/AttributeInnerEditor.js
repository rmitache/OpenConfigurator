define("Main/PropertyEditor/FeatureInnerEditor/AttributeInnerEditor/AttributeInnerEditor",
    [
        "text!Main/PropertyEditor/FeatureInnerEditor/AttributeInnerEditor/AttributeInnerEditor.html" // html markup
    ],
    function (HTMLmarkup) {
        var AttributeInnerEditor = function (container, attributeCLO) {

            // Fields
            var _container = container, _attributeCLO = attributeCLO;
            var _innerHtmlElem;
            var _innerElems = {
                focusElem: null,
                defaultValueTextBox: null
            };
            var _this = this;
            var _vm = {
                Name: _attributeCLO.Name.extend({
                    required: true
                }),
                Identifier: _attributeCLO.Identifier.extend({
                    required: true
                }),
                AttributeTypes: createKOObservableArrayFromEnum(Enums.AttributeTypes),
                AttributeType: _attributeCLO.AttributeType,
                DefaultValueMasked: _attributeCLO.DefaultValue.extend({
                    validation: {
                        validator: function (val) {
                            var currentAttributeDataType = _attributeCLO.AttributeDataType();
                            var isValid = false;


                            switch (currentAttributeDataType) {
                                case Enums.AttributeDataTypes.Integer:
                                    isValid = (val !== "" && !isNaN(val));
                                    break;
                                case Enums.AttributeDataTypes.Boolean:
                                    isValid = (val === "true" || val === "false" || val === "0" || val === "1");
                                    break;
                                case Enums.AttributeDataTypes.String:
                                    isValid = true;
                                    break;
                            }

                            return isValid;
                        },
                        message: 'Default value does not match the chosen AttributeDataType'
                    }
                }),
                AttributeDataTypes: createKOObservableArrayFromEnum(Enums.AttributeDataTypes),
                AttributeDataType: _attributeCLO.AttributeDataType
            }
            _vm.Name.OriginalValue = _attributeCLO.Name();
            _vm.Identifier.OriginalValue = _attributeCLO.Identifier();

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to html elems
                _innerElems.focusElem = $(_innerHtmlElem).find("#AttributeNameTextbox");
                _innerElems.defaultValueTextBox = $(_innerHtmlElem).find("#DefaultValueTextbox");

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
                if (!_attributeCLO.Name.isValid() || !_attributeCLO.Identifier.isValid()) {
                    _attributeCLO.Name(_vm.Name.OriginalValue);
                    _attributeCLO.Identifier(_vm.Identifier.OriginalValue);
                }

                // Clean up CLO from validation
                _attributeCLO.Name.extend({ validatable: false });
                _attributeCLO.Identifier.extend({ validatable: false });

                // Clean up bindings
                ko.cleanNode(_innerHtmlElem[0]);
                _innerHtmlElem.remove();
            }
        }
        return AttributeInnerEditor;
    });