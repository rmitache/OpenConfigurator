define("Shared/Dialog/Dialog",
    [
        "text!Shared/Dialog/Dialog.html" // html markup
    ],
    function (HTMLmarkup) {
        
        var Dialog = function (title, content, settings) {

            // Fields
            var _title = title, _content = content;
            var _dialog = null;
            var _innerHtmlElem;
            var _innerElems = {
                container:null,
                headerLabel: null,
                innerContainer: null,
                closeIcon: null
            };
            var _options = {
                modal: false,
                showCloseIcon: true
            }
            var _widgetOptions = {
                modal: true,
                width: 300/*$(content).find(":first-child").css("width")*/
            };
            var _this = this;

            // Init
            this.Initialize = function () {
                
                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo("body");

                // Get references to html elems
                _innerElems.container = $(_innerHtmlElem).find(".dialog");
                _innerElems.closeIcon = $(_innerHtmlElem).find(".closeIcon");
                _innerElems.innerContainer = $(_innerHtmlElem).find(".boxContent");
                _innerElems.headerLabel = $(_innerHtmlElem).find(".headerLabel");

                // Setup based on options
                settings = (settings !== undefined) ? settings : {};
                _options = $.extend({}, _options, settings);
                _innerElems.closeIcon.bind("click", function () {
                    _dialog.dialog("close");
                });
                //$(_innerHtmlElem).draggable({
                //    handle: ".boxHeader",
                //    containment: "window"
                //});

                _innerElems.innerContainer.append(_content);
                _innerElems.headerLabel.text(_title);
            }

            // Public methods
            this.Show = function () {
                _dialog = $(_innerHtmlElem).dialog(_widgetOptions);
                $(_dialog).dialog("option", "width", $(content).find(":first-child").outerWidth() + 60);
            }
            this.Close = function () {
                _dialog.dialog("close");
            }

        }
        return Dialog;
    });