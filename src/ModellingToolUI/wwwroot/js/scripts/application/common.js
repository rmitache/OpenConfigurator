//Settings/initializations****************************************************************************************

//Ajax settings
$(document).ready(function () {
    $.ajaxSetup({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        async: false,
        cache: false
        //,
        //error: function (response) {
        //    alert('error');
        //    debugger;
        //}
    });
});

// Settings for ToastR notifications
toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
//****************************************************************************************************************

//Helper methods/small plugins************************************************************************************
// Jquery extensions
jQuery.fn.visible = function () {
    return this.css('visibility', 'visible');
};
jQuery.fn.hidden = function () {
    return this.css('visibility', 'hidden');
};

// Key press plugin method
var readyToPress = true;
$.ctrl = function (key, callback, args) {
    $(document).keydown(function (e) {
        if (e.keyCode === key.charCodeAt(0) && e.ctrlKey) {
            if (readyToPress) {
                readyToPress = false;

                if (!args) args = []; // IE barks when args is null
                callback.apply(this, args);

                $.timer(500, function () {
                    readyToPress = true;
                });
            }
            return false;
        }
    });
};

// Helper methods
function getEnumEntryNameByID(enumeration, id) {
    for (var key in enumeration) {

        if (enumeration[key] === id) {
            return key;
        }
    }
}
function createKOObservableArrayFromEnum(enumeration) {
    var koEntry = function (name, value) {
        this.name = name;
        this.value = value;
    }

    var koArray = ko.observableArray();
    for (var key in enumeration) {
        var enumValue = enumeration[key];
        koArray.push(new koEntry(key, enumValue));
    }
    return koArray;
}
function getEnumEntryNameByID(enumeration, id) {
    for (var key in enumeration) {

        if (enumeration[key] === id) {
            return key;
        }
    }
}
function paramsToString(collection) {
    var returnString = "";
    for (var key in collection) {
        var collectionEntry = collection[key];
        returnString += "," + collectionEntry;
    }
    return returnString;
}
function sortUnique(array) {
    return $.grep(array, function (el, index) {
        return index == $.inArray(el, array);
    });
}
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function isArray(a) {
    return Object.prototype.toString.apply(a) === '[object Array]';
}
(function ($) {

    $.fn.disableSelection = function () {
        return this.each(function () {
            $(this).attr('unselectable', 'on')
               .css({
                   '-moz-user-select': 'none',
                   '-webkit-user-select': 'none',
                   'user-select': 'none'
               })
               .each(function () {
                   this.onselectstart = function () { return false; };
               });
        });
    };

})(jQuery);
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


/**
 * Creates a promise that resolves when all AMD modules mentioned in moduleIDs are resolved
 * @param {Array * String} moduleIDs
 * @returns {Promise}
 */
function requireAsync(moduleIDs) {
    var dfd = $.Deferred();
    require(moduleIDs, function () {
        dfd.resolveWith(null, arguments);
    }, function () {
        dfd.reject();
    });
    return dfd.promise();
}
//****************************************************************************************************************

