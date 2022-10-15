(function ($) {

    //Global variables
    var internalNodeIDCounter = 0;
    var treeDefaultSettings = {
        nodeSystemTypes: {
            parent: "parent",
            leaf: "leaf"
        },
        nodeDisplayStates: {
            expanded: "expanded",
            collapsed: "collapsed"
        },
        nodeSelectedStates: {
            selected: "selected",
            unselected: "unselected"
        }
    }

    //JQuery constructor method
    $.fn.simpleTree = function (opts) {
        
        //Initialize the options
        var options = $.extend({}, $.fn.simpleTree.defaults, opts);

        //Initialize the treeTable
        return this.each(function () {
            var tree = $(this);
            var treeId = tree.attr("id");

            createTreeStructure(tree, options);
        });

    }

    //Default settings
    $.fn.simpleTree.defaults = {
        data: null,
        types: null,
        onNodeClicked: function (node, ctrl) {
            
        }
    };

    //Private functions****************************************************************************************************************
    var createTreeStructure = function (tree, opts) {
        $(tree).addClass("simpleTree");
        $(tree).data("options", opts);
        //
        var rootUl = $("<ul class='root'></ul>").appendTo(tree);
        for (var i = 0; i < opts.data.length; i++) {

            //Row
            var dataRow = opts.data[i];
            var hasChildren = (opts.data[i].children != undefined);
            var row = createRow(dataRow, opts.types[dataRow.typeName], dataRow.typeName, opts.onNodeClicked);
            row.appendTo(rootUl);

            //Create children
            if (hasChildren) {
                for (var j = 0; j < opts.data[i].children.length; j++) {
                    var childDataRow = opts.data[i].children[j];
                    var childRow = createRow(childDataRow, opts.types[childDataRow.typeName], childDataRow.typeName, opts.onNodeClicked);
                    appendChildRow(childRow, row);
                }
            }
        }
    }
    var createRow = function (dataObj, type, typeName, onNodeClicked) {

        //Row
        var row = $("<li class='row'></li>");
        row.attr("id", "node-" + internalNodeIDCounter++);
        row.attr("dataID", dataObj[type.idField]);

        //Node and expander
        var node = $("<div class='node'></div>").addClass(typeName).appendTo(row);
        var expander = $("<div class='expander'></div>").appendTo(node);

        //InnerNode 
        var innerNode = $("<div class='innerNode'></div>").appendTo(node);
        var icon = $("<div class='icon'></div>").appendTo(innerNode);
        var nameNode = $("<div class='name'>" + dataObj[type.labelField] + "</div>").appendTo(innerNode);

        //Initialize
        node.attr("nodeSystemType", treeDefaultSettings.nodeSystemTypes.leaf);
        expander.css("visibility", "hidden");

        //Event handlers
        expander.bind("click", function (e) {
            toggleExpandCollapseState(node);
        });
        if (type.selectable) {
            node.bind("click", function (e) {
                onNodeClicked.call({}, node, e.ctrlKey);
            });
        }

        //Disable browser ctrl selection
        $(node).disableSelection();

        return row;
    }

    var appendChildRow = function (childRow, destinationRow, pos) {

        //Variables
        var destinationNode = $(destinationRow).children(".node");
        var destinationNodeSystemType = $(destinationNode).attr("nodeSystemType");
        var childrenContainer = null;

        //Add attribute to keep track of parent
        $(childRow).attr("parentDataID", destinationRow.attr("dataID"));

        //Reinitialize destinationRow
        switch (destinationNodeSystemType) {

            //Old type = Parent                                                                                                                           
            case treeDefaultSettings.nodeSystemTypes.parent:
                childrenContainer = $(destinationRow).children(".childrenContainer");
                break;

            //Old type = Leaf                                                                                                                           
            case treeDefaultSettings.nodeSystemTypes.leaf:
                $(destinationNode).attr("nodeSystemType", treeDefaultSettings.nodeSystemTypes.parent);
                $(destinationNode).attr("nodeDisplayState", treeDefaultSettings.nodeDisplayStates.collapsed);
                childrenContainer = $("<ul class='childrenContainer level0'></ul>").hide().appendTo(destinationRow);

                //Show expander & collapse
                var expander = $(destinationNode).children(".expander");
                expander.css("visibility", "visible");
                break;
        }

        //Append row
        if (pos == undefined || $(childrenContainer).find(".row").length == 0) {
            childRow.appendTo(childrenContainer);
        } else {
            var indexNode = $(childrenContainer).find(".row:eq(" + pos.index + ")");
            eval("indexNode." + pos.relative + "(childRow)");
        }
    }
    var getParentNode = function (node) {
        var row = $(node).parent();
        var tree = $(node).parents(".simpleTree");
        var parentNode = getNode(tree, row.attr("parentDataID"));
        return parentNode;
    }
    var getChildNodes = function (node) {
        var childrenContainer = $(node).parent().children(".childrenContainer");
        var childNodes = $(childrenContainer).find("li.row");

        return childNodes;
    }
    var findInsertPos = function (val, array, getField) {//Finds the position for a new value within an alphabetically sorted array (ASC)

        //Variables
        var returnPos = {
            index: 0,
            relative: "before" //before or after
        }

        //Verify 1st and last pos
        var compareVal = val.toLowerCase();
        if (compareVal < getField(array[0]).toLowerCase()) {
            returnPos.index = 0;
            returnPos.relative = "before";
            return returnPos;
        } else if (compareVal >= getField(array[array.length - 1]).toLowerCase()) {
            returnPos.index = array.length - 1;
            returnPos.relative = "after";
            return returnPos;
        }

        //Verify other positions
        for (var i = 0; i < array.length - 1; i++) {
            var leftVal = getField(array[i]).toLowerCase();
            var rightVal = getField(array[i + 1]).toLowerCase();

            if (compareVal >= leftVal && compareVal < rightVal) {
                returnPos.index = i;
                returnPos.relative = "after";
                return returnPos;
            }
        }
    }
    var getNodeSortedPos = function (name, parentNode) {
        var siblings = getChildNodes(parentNode);
        var pos = findInsertPos(name, siblings, function (row) {
            var name = $(row).find(".innerNode .name").text();
            return name;
        });

        return pos;
    }
    var getNode = function (tree, dataId) {
        var node = $(tree).find(".row[dataId='" + dataId + "']").children(".node");
        if (node.length == 1)
            return node;
        else
            return null;
    }
    var getDataID = function (node) {
        return $(node).parent().attr("dataID");
    }
    var expandRow = function (row) {

        //Set expanded state 
        var node = $(row).children(".node");
        node.attr("nodeDisplayState", "expanded");
        $(node).children().css({ backgroundColor: "transparent !important" }); //fix for IE10


        //Show children
        var childrenContainer = $(row).children(".childrenContainer");
        childrenContainer.show();
    }
    var collapseRow = function (row) {

        //Set collapsed state
        var node = $(row).children(".node");
        node.attr("nodeDisplayState", "collapsed");
        $(node).children().css({ backgroundColor: "transparent !important" }); //fix for IE10

        //Hide children
        var childrenContainer = $(row).children(".childrenContainer");
        childrenContainer.hide();
    }
    var toggleExpandCollapseState = function (node) {
        var row = $(node).parent();
        var currentState = $(node).attr("nodeDisplayState");
        switch (currentState) {
            case treeDefaultSettings.nodeDisplayStates.expanded:
                collapseRow(row);
                break;
            case treeDefaultSettings.nodeDisplayStates.collapsed:
                expandRow(row);
                break;
        }
    }

    var setSelected = function (node) {
        var isSelected = $(node).attr("selected");
        if (!isSelected) {
            $(node).attr("selected", "selected");
        }
    }
    var setUnselected = function (node) {
        $(node).removeAttr("selected");
    }
    var nodeIsSelected = function (node) {
        var isSelected = $(node).attr("selected");
        return isSelected;
    }
    var deselectAll = function (tree) {
        $(tree).find(".node[selected=selected]").removeAttr("selected");
    }

    var updateNodeName = function (node, newName) {

        var oldName = $(node).children(".innerNode").children(".name").text();
        if (oldName != newName) {

            //Setup variables and remove the row
            var parentNode = getParentNode(node);
            var row = $(node).parent();
            var parentRow = $(parentNode).parent();
            $(row).detach();

            //Get the position
            var pos = getNodeSortedPos(newName, parentNode);

            //Update the position and name
            appendChildRow(row, parentRow, pos);
            $(node).children(".innerNode").children(".name").text(newName);
        }
    }
    var deleteNode = function (node) {
        //Variables
        var row = $(node).parent();
        var hasSiblings = ($(row).siblings().length > 0);
        var childrenContainer = $(row).parent();
        var parentNode = getParentNode(node);
        var parentNodeExpander = parentNode.children(".expander");

        //Delete the row containing the node
        row.remove();

        //Reset the parent if there were no other siblings left
        if (!hasSiblings) {
            $(parentNode).attr("nodeSystemType", treeDefaultSettings.nodeSystemTypes.leaf);
            $(parentNode).removeAttr("nodeDisplayState");
            childrenContainer.remove();
            parentNodeExpander.css("visibility", "hidden");
        }
    }
    //*********************************************************************************************************************************
    //Public functions*****************************************************************************************************************
    $.fn.getNode = function (dataId) {
        var tree = $(this);
        var node = getNode(tree, dataId);
        return node;
    }
    $.fn.addNewChildNode = function (dataRow, useSort) {

        //Get the destination node and options
        var parentNode = $(this);
        var parentRow = $(parentNode).parent();
        var opts = $(parentRow).parents(".simpleTree").data("options");

        //Create and append a new row
        var newRow = createRow(dataRow, opts.types[dataRow.typeName], dataRow.typeName, opts.onNodeClicked);
        if (useSort == true) {

            //Append to the correct position
            var pos = getNodeSortedPos(dataRow.Name, parentNode);
            appendChildRow(newRow, parentRow, pos);

        } else {
            //Append to the end
            appendChildRow(newRow, parentRow);
        }

        //
        var node = newRow.children(".node");
        return node;
    }
    $.fn.setNodeSelected = function () {
        var node = $(this);
        setSelected(node);
    }
    $.fn.setNodeUnselected = function () {
        var node = $(this);
        setUnselected(node);
    }
    $.fn.isNodeSelected = function () {
        var node = $(this);
        return nodeIsSelected(node);
    }
    $.fn.deselectAll = function () {
        var tree = $(this);
        deselectAll(tree);
    }
    $.fn.getSelectedNodes = function () {
        var tree = $(this);
        var selectedNodes = $(tree).find(".node[selected=selected]");
        if (selectedNodes.length > 0)
            return selectedNodes;
        else
            return null;

    }

    $.fn.updateNodeName = function (newName) {
        var node = $(this);
        updateNodeName(node, newName);
    }
    $.fn.deleteNode = function () {
        var node = $(this);
        deleteNode(node);
    }
    $.fn.getNodeDataID = function () {
        var node = $(this);
        return getDataID(node);
    }
    //*********************************************************************************************************************************
})(jQuery);
