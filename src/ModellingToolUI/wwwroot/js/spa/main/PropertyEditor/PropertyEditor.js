define("Main/PropertyEditor/PropertyEditor",
    [
        "text!Main/PropertyEditor/PropertyEditor.html", // html markup
        "Main/PropertyEditor/FeatureInnerEditor/FeatureInnerEditor",
        "Main/PropertyEditor/RelationInnerEditor/RelationInnerEditor",
        "Main/PropertyEditor/GroupRelationInnerEditor/GroupRelationInnerEditor",
        "Main/PropertyEditor/CompositionRuleInnerEditor/CompositionRuleInnerEditor",
        "Main/PropertyEditor/CustomRuleInnerEditor/CustomRuleInnerEditor"
    ],
    function (HTMLmarkup, FeatureInnerEditor, RelationInnerEditor, GroupRelationInnerEditor, CompositionRuleInnerEditor, CustomRuleInnerEditor) {
        var PropertyEditor = function (container, DataStore, cloSelectionManager) {

            // Fields
            var _container = container, _DataStore = DataStore, _cloSelectionManager = cloSelectionManager;
            var _innerHtmlElem;
            var _currentInnerEditorInstance = null, _currentCLO = null;
            var _innerElems = {
                headerLabel: null,
                innerContainer: null
            };
            var _this = this;
            var _specializedDataStore = {
                CreateNewCLO: _DataStore.CreateNewCLO,
                DeleteByClientID: _DataStore.DeleteByClientID
            }

            // Private methods
            function loadInnerEditor(clo) {

                // Clear current editor instance (if one exists)
                if (_currentInnerEditorInstance) {
                    _currentInnerEditorInstance.RemoveSelf();
                    _currentInnerEditorInstance = null;
                }

                // 
                _innerElems.headerLabel.text(clo.GetType() + " properties");
                var innerEditorType = eval(clo.GetType() + "InnerEditor");
                _currentInnerEditorInstance = new innerEditorType(_innerElems.innerContainer, clo, _specializedDataStore);
                _currentInnerEditorInstance.Initialize();
            }

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to html elems
                _innerElems.headerLabel = $(_innerHtmlElem).find(".headerLabel");
                _innerElems.innerContainer = $(_innerHtmlElem).find(".boxContent");

                // Make draggable
                $(_innerHtmlElem).draggable({
                    handle: ".boxHeader",
                    containment: "window"
                });

                // Hide initially
                _innerHtmlElem.hide();
            }

            // Public methods
            this.Close = function () {
                if (_currentInnerEditorInstance) {
                    _currentInnerEditorInstance.RemoveSelf();
                    _currentInnerEditorInstance = null;
                }
                _innerHtmlElem.hide();
            }
            this.OpenAndEdit = function (CLOArray) {

                // Load the CLO 
                loadInnerEditor(CLOArray[0]);
                _innerHtmlElem.show();
            }
        }
        return PropertyEditor;
    });

