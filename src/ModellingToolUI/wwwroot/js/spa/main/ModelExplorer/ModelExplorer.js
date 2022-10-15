define("Main/ModelExplorer/ModelExplorer",
    [
        
    ],
    function () {

        var ModelExplorer = function (container, dataStore, cloSelectionManager) {

            // Fields
            var _container = container, _dataStore = dataStore, _cloSelectionManager = cloSelectionManager;
            var _tree = null, _treeOptions = {
                data: [
                        {
                            ID: "CompositionRulesNode",
                            Name: "Composition Rules",
                            typeName: "Folder"
                        },
                        {
                            ID: "CustomRulesNode",
                            Name: "Custom Rules",
                            typeName: "Folder"
                        },
                        {
                            ID: "FeaturesNode",
                            Name: "Features",
                            typeName: "Folder"
                        }
                ],
                types: {
                    Folder: {
                        idField: "ID",
                        labelField: "Name",
                        selectable: false
                    },
                    Feature: {
                        idField: "ID",
                        labelField: "Name",
                        selectable: true
                    },
                    CompositionRule: {
                        idField: "ID",
                        labelField: "Name",
                        selectable: true
                    },
                    CustomRule: {
                        idField: "ID",
                        labelField: "Name",
                        selectable: true
                    }
                },
                onNodeClicked: onNodeClicked
            };
            var _innerHtmlElem;
            var _this = this;

            // Private methods
            function addElement(clo, nodeType) {

                // Create a new element 
                var name = clo.Name();
                var newDataRow = {
                    ID: clo.GetClientID(),
                    Name: name,
                    typeName: nodeType
                };

                // Add it to its parent node
                var parentNode = $(_tree).getNode(nodeType + "sNode");
                var newNode = $(parentNode).addNewChildNode(newDataRow);

                // Bind it to the CLO
                clo.Name.Changed.AddHandler(new EventHandler(function (newValue) {
                    $(newNode).updateNodeName(newValue);
                }));
                clo.Selected.Changed.AddHandler(new EventHandler(function (newValue) {
                    if (newValue) {
                        $(newNode).setNodeSelected();
                    } else {
                        $(newNode).setNodeUnselected();
                    }
                }));

                //
                return newNode;
            }
            function removeElement(node) {
                $(node).deleteNode();
            }

            // Init
            this.Initialize = function () {

                // Setup innerHtml elem
                _innerHtmlElem = $("<div id='modelExplorerTree'></div>").appendTo(_container);

                // Create simpleTree
                _tree = $(_innerHtmlElem).simpleTree(_treeOptions);

                // Handler for onFocus
                $(_container).bind("click", function (e) {
                    _this.Focus.RaiseEvent();
                });
            }

            // Events
            this.Focus = new Event();

            // Event handlers
            this.OnModelLoaded = function (modelCLO) {

                // References to all relevant model child collections
                var bindableCollections = [
                    modelCLO.Features,
                    modelCLO.CompositionRules,
                    modelCLO.CustomRules
                ];

                // Go through each of the collections
                for (var i = 0; i < bindableCollections.length; i++) {
                    var collection = bindableCollections[i];

                    // Create elements for any existing CLOs that are already in the collection
                    for (var j = 0; j < collection.GetLength() ; j++) {
                        var clo = collection.GetAt(j);
                        modelHandlers.onCLOAdded(clo);
                    }

                    // Bind to it
                    collection.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
                    collection.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
                }
            }
            this.OnModelUnloaded = function (modelCLO) {
                // Create new tree
                $(_innerHtmlElem).html("");
                _tree = $(_innerHtmlElem).simpleTree(_treeOptions);
            }
            function onNodeClicked(node, ctrlKey) {
                var clo = _dataStore.GetByClientID(node.getNodeDataID());
                _cloSelectionManager.ToggleSingleCLO(clo, ctrlKey);
            };
            var modelHandlers = {
                onCLOAdded: function (clo) {
                    addElement(clo, clo.GetType());
                },
                onCLORemoved: function (clo) {
                    var nodeElem = $(_tree).getNode(clo.GetClientID());
                    removeElement(nodeElem);
                }
            }
        }

        return ModelExplorer;
    });