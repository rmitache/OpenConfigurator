define("Main/PropertyEditor/FeatureInnerEditor/FeatureInnerEditor",
    [
        "text!Main/PropertyEditor/FeatureInnerEditor/FeatureInnerEditor.html", // html markup
        "Main/PropertyEditor/FeatureInnerEditor/AttributeInnerEditor/AttributeInnerEditor"
    ],
    function (HTMLmarkup, AttributeInnerEditor) {

        var FeatureInnerEditor = function (container, featureCLO, specializedDataStore) {

            // Fields
            var _container = container, _featureCLO = featureCLO, _specializedDataStore = specializedDataStore;
            var _innerHtmlElem;
            var _innerElems = {
                focusElem: null,
                attributesContainer: null,
                attributeEditorContainer: null

            };
            var _attributeEditorInstance = null;
            var _this = this;
            var _vm = {
                Name: _featureCLO.Name.extend({
                    required: true
                }),
                Identifier: _featureCLO.Identifier.extend({
                    required: true
                }),
                CurrentlySelectedAttribute: new ObservableField(),
                SelectAttribute: function (attributeCLO) {
                    _vm.CurrentlySelectedAttribute(attributeCLO);
                    loadAttributeEditor(attributeCLO);
                },
                Attributes: _featureCLO.Attributes,
                AddAttribute: function () {
                    var newAttributeCLO = _specializedDataStore.CreateNewCLO(CLOTypes.Attribute);
                    _featureCLO.Attributes.Add(newAttributeCLO);
                },
                RemoveAttribute: function (attributeCLO) {
                    if (attributeCLO === _vm.CurrentlySelectedAttribute()) {
                        _vm.SelectAttribute(null);
                    }

                    _specializedDataStore.DeleteByClientID(attributeCLO.GetClientID());
                }
            }
            _vm.Name.OriginalValue = _featureCLO.Name();
            _vm.Identifier.OriginalValue = _featureCLO.Identifier();

            // Private methods
            function loadAttributeEditor(attributeCLO) {

                // Clear current editor instance (if one exists)
                if (_attributeEditorInstance) {
                    _attributeEditorInstance.RemoveSelf();
                    _attributeEditorInstance = null;
                }

                if (attributeCLO !== null) {
                    // Open the editor
                    _attributeEditorInstance = new AttributeInnerEditor(_innerElems.attributeEditorContainer, attributeCLO);
                    _attributeEditorInstance.Initialize();
                }
            }

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to html elems
                _innerElems.focusElem = $(_innerHtmlElem).find("#NameTextbox");
                _innerElems.attributesContainer = $(_innerHtmlElem).find("#AttributeListContainer");
                _innerElems.attributeEditorContainer = $(_innerHtmlElem).find("#attributeEditorContainer");

                // Apply bindings
                ko.applyBindings(_vm, _innerHtmlElem[0]);

                // Select default elem
                setTimeout(function () {
                    _innerElems.focusElem.select();
                }, 0);

                //
                $(_innerHtmlElem).find(".iconButton-small").tipTip();
            }

            // Public methods
            this.RemoveSelf = function () {

                // Remove Attribute editor if one is open
                if (_attributeEditorInstance) {
                    _attributeEditorInstance.RemoveSelf();
                    _attributeEditorInstance = null;
                }

                // Revert if invalid
                if (!_featureCLO.Name.isValid() || !_featureCLO.Identifier.isValid()) {
                    _featureCLO.Name(_vm.Name.OriginalValue);
                    _featureCLO.Identifier(_vm.Identifier.OriginalValue);
                }

                // Clean up CLO from validation
                _featureCLO.Name.extend({ validatable: false });
                _featureCLO.Identifier.extend({ validatable: false });

                // Clean up bindings
                ko.cleanNode(_innerHtmlElem[0]);
                _innerHtmlElem.remove();
            }
        }
        return FeatureInnerEditor;
    });