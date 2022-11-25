define("Main/CommandToolbar/CommandToolbar",
    [
        "text!Main/CommandToolbar/CommandToolbar.html" // html markup
    ],
    function (HTMLmarkup) {

        var CommandToolbar = function (container, DataStore, controller) {

            // Fields
            var _container = container, _DataStore = DataStore, _controller = controller;
            var _innerHtmlElem;
            var _innerElems = {
                modelNameTextbox: null,
                fileCommandItems: {
                    newModelItem: null,
                    openModelItem: null,
                    saveModelItem: null,
                    runConfigurationItem: null
                },
                modelManipulationItems: {
                    newFeatureItem: null,
                    newRelationItem: null,
                    newGroupRelationItem: null,
                    newCompositionRuleItem: null,
                    newCustomRuleItem: null
                },
                visualOptionsItems: {
                    toggleOrientationItem: null,
                    zoomInItem: null,
                    zoomOutItem: null
                }
            };
            var _this = this;

            // Private methods
            function removeAllToggleEffects() {
                for (var itemKey in _innerElems.modelManipulationItems) {
                    var item = _innerElems.modelManipulationItems[itemKey];
                    $(item).removeClass("iconButton-active");
                }
            }
            function addToggleEffect(item) {
                $(item).addClass("iconButton-active");
            }
            function bindToModelHasChanges(modelCLO) {
                modelCLO.HasChanges.Changed.AddHandler(new EventHandler(onModelHasChangesChanged, "toolbarSaveItem"));
                onModelHasChangesChanged(modelCLO.HasChanges()); // trigger change to load initial value

            }
            function unbindFromModelHasChanges(modelCLO) {
                modelCLO.HasChanges.Changed.RemoveHandler("toolbarSaveItem");
            }

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to html elems
                _innerElems.modelNameTextbox = $(_innerHtmlElem).find("#modelNameTextbox");
                _innerElems.fileCommandItems.newModelItem = $(_innerHtmlElem).find("#newModelItem");
                _innerElems.fileCommandItems.openModelItem = $(_innerHtmlElem).find("#openModelItem");
                _innerElems.fileCommandItems.saveModelItem = $(_innerHtmlElem).find("#saveModelItem");
                _innerElems.fileCommandItems.runConfigurationItem = $(_innerHtmlElem).find("#runConfigurationItem");
                
                _innerElems.modelManipulationItems.newFeatureItem = $(_innerHtmlElem).find("#newFeatureItem");
                _innerElems.modelManipulationItems.newRelationItem = $(_innerHtmlElem).find("#newRelationItem");
                _innerElems.modelManipulationItems.newGroupRelationItem = $(_innerHtmlElem).find("#newGroupRelationItem");
                _innerElems.modelManipulationItems.newCompositionRuleItem = $(_innerHtmlElem).find("#newCompositionRuleItem");
                _innerElems.modelManipulationItems.newCustomRuleItem = $(_innerHtmlElem).find("#newCustomRuleItem");

                _innerElems.visualOptionsItems.zoomInItem = $(_innerHtmlElem).find("#zoomInItem");
                _innerElems.visualOptionsItems.zoomOutItem = $(_innerHtmlElem).find("#zoomOutItem");
                _innerElems.visualOptionsItems.toggleOrientationItem = $(_innerHtmlElem).find("#toggleOrientationItem");

                // Set event handlers
                $(_innerElems.fileCommandItems.newModelItem).bind("click", toolbarItemHandlers.newModelItemTriggered);
                $(_innerElems.fileCommandItems.openModelItem).bind("click", toolbarItemHandlers.openModelItemTriggered);
                $(_innerElems.fileCommandItems.saveModelItem).bind("click", toolbarItemHandlers.saveModelItemTriggered);
                $(_innerElems.modelManipulationItems.newFeatureItem).bind("click", toolbarItemHandlers.newFeatureItemTriggered);
                $(_innerElems.modelManipulationItems.newRelationItem).bind("click", toolbarItemHandlers.newRelationItemTriggered);
                $(_innerElems.modelManipulationItems.newGroupRelationItem).bind("click", toolbarItemHandlers.newGroupRelationItemTriggered);
                $(_innerElems.modelManipulationItems.newCompositionRuleItem).bind("click", toolbarItemHandlers.newCompositionRuleItemTriggered);
                $(_innerElems.modelManipulationItems.newCustomRuleItem).bind("click", toolbarItemHandlers.newCustomRuleItemTriggered);
                $(_innerElems.visualOptionsItems.zoomInItem).bind("click", toolbarItemHandlers.zoomInItemTriggered);
                $(_innerElems.visualOptionsItems.zoomOutItem).bind("click", toolbarItemHandlers.zoomOutItemTriggered);
                $(_innerElems.visualOptionsItems.toggleOrientationItem).bind("click", toolbarItemHandlers.toggleOrientationItemTriggered);

                // Key shortcut handlers
                $(document).keydown(function (e) {
                    $.ctrl('S', toolbarItemHandlers.saveModelItemTriggered);
                    $.ctrl('F', toolbarItemHandlers.newFeatureItemTriggered);
                    $.ctrl('R', toolbarItemHandlers.newRelationItemTriggered);
                    $.ctrl('G', toolbarItemHandlers.newGroupRelationItemTriggered);
                    $.ctrl('M', toolbarItemHandlers.newCompositionRuleItemTriggered);
                    $.ctrl('U', toolbarItemHandlers.newCustomRuleItemTriggered);
                });

                // Setup tooltips
                $(_innerHtmlElem).find(".Textbox").tipTip();
                $(_innerHtmlElem).find(".iconButton").tipTip();
            }

            // Event handlers
            this.OnVisualViewStateChanged = function (oldStateName, newStateName) {

                // Mappings from VisualView states to item buttons in command bar
                var itemToVisualViewStateMappings = {};
                itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewFeature] = _innerElems.modelManipulationItems.newFeatureItem;
                itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewRelation] = _innerElems.modelManipulationItems.newRelationItem;
                itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewGroupRelation] = _innerElems.modelManipulationItems.newGroupRelationItem;
                itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewCompositionRule] = _innerElems.modelManipulationItems.newCompositionRuleItem;

                // Handle the states
                if (newStateName === Enums.VisualView.StateNames.Default) {
                    removeAllToggleEffects();
                } else {
                    addToggleEffect(itemToVisualViewStateMappings[newStateName]);
                }
            }
            this.OnModelLoaded = function (modelCLO) {
                // Bind to it
                var vm = {
                    Name: modelCLO.Name.extend({
                        required: true
                    })
                }
                ko.applyBindings(vm, _innerElems.modelNameTextbox[0]);

                bindToModelHasChanges(modelCLO);
            }
            this.OnModelUnloaded = function (modelCLO) {
                // Clean up bindings and html
                ko.cleanNode(_innerElems.modelNameTextbox[0]);
                _innerElems.modelNameTextbox.val("");
                unbindFromModelHasChanges(modelCLO);
            }
            var onModelHasChangesChanged = function (val) {
                if (val === false)
                    _innerElems.fileCommandItems.saveModelItem.prop("disabled", "disabled");
                else
                    _innerElems.fileCommandItems.saveModelItem.prop("disabled", false);
            }
            var toolbarItemHandlers = {
                newModelItemTriggered: function () {
                    _controller.NewModel();
                },
                openModelItemTriggered: function () {
                    _controller.OpenFile();
                },
                saveModelItemTriggered: function () {
                    _controller.SaveChanges();
                    toastr.success("Feature Model saved successfully!");
                },
                newFeatureItemTriggered: function () {
                    _controller.AddNewFeature();
                },
                newRelationItemTriggered: function () {
                    _controller.AddNewRelation();
                },
                newGroupRelationItemTriggered: function () {
                    _controller.AddNewGroupRelation();
                },
                newCompositionRuleItemTriggered: function () {
                    _controller.AddNewCompositionRule();
                },
                newCustomRuleItemTriggered: function () {
                    _controller.AddNewCustomRule();
                },
                zoomInItemTriggered: function () {
                    _controller.ZoomIn();
                },
                zoomOutItemTriggered: function () {
                    _controller.ZoomOut();
                },
                toggleOrientationItemTriggered: function () {
                    _controller.ToggleOrientation();
                }

            };

        }
        return CommandToolbar;
    });