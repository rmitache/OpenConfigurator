(function ($) {

    // Global variables
    var openSubmenuIndex = false;

    // JQuery constructor method
    $.fn.simpleMenu = function (opts) {

        // Initialize the dropdown menu
        var options = $.extend({}, $.fn.simpleMenu.defaults, opts);
        return this.each(function () {

            // Variables
            var dropdownElem = $(this);
            var rootMenuItems = $(dropdownElem).children("li").addClass("rootMenuItem");
            var childMenuItems = $(dropdownElem).find("li ul li").addClass("childMenuItem");

            // Init properties for the dropdown menu
            $(dropdownElem).addClass("simpleMenu");
            $(rootMenuItems).children("ul").hide();

            // RootMenuItems event handlers
            $(rootMenuItems).each(function (index) {
                var rootItem = rootMenuItems[index];

                $(rootItem).bind("click", function (e) {
                    //Open on click
                    if (openSubmenuIndex === false) {
                        hideAll(dropdownElem, options);
                        showSubmenu(rootItem, index, options);
                        e.stopPropagation();
                    }
                        //Close on click if submenu already open
                    else {
                        hideAll(dropdownElem, options);
                        e.stopPropagation();
                    }

                });
                $(rootItem).bind("mouseover", function (e) {
                    //Open on hover only if another submenu is already open
                    if (openSubmenuIndex !== false) {
                        hideAll(dropdownElem, options);
                        showSubmenu(rootItem, index, options);
                    }
                });
            });

            // ChildMenuItems event handlers
            $(childMenuItems).bind("click", function (e) {
                if ($(this).attr("disabled") !== "disabled") {
                    var childMenuItem = $(this);
                    options.onChildMenuElemClicked(childMenuItem, options);
                }

            });

            // Page hideall click event
            $('html').click(function (e) {
                if (openSubmenuIndex !== false && !$(e.target).hasClass("childMenuItem")) {
                    hideAll(dropdownElem, options);
                }
            });
        });
    }

    // Default settings
    $.fn.simpleMenu.defaults = {
        onChildMenuElemClicked: function (childMenuItem, opts) {
            alert($(childMenuItem).children("a").text());
        }
    };

    // Private functions***************************************************************************************************************
    var showSubmenu = function (rootItem, itemIndex, opts) {
        var submenu = $(rootItem).children("ul");

        if (submenu.length == 1) {
            $(submenu).show().removeClass("submenu").addClass("submenu");
            $(rootItem).children("a").addClass("itemActive");
            openSubmenuIndex = itemIndex;
        }
    }
    var hideAll = function (dropdownElem, opts) {
        $(dropdownElem).children("li").children("ul").hide();
        $(dropdownElem).find(".itemActive").removeClass("itemActive");
        openSubmenuIndex = false;
    }
    //*********************************************************************************************************************************
})(jQuery);
