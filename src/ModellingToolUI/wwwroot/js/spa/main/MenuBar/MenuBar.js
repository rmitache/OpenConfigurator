define("Main/MenuBar/MenuBar",
    [
        "text!Main/MenuBar/MenuBar.html" // html markup
    ],
    function (HTMLmarkup) {

        var MenuBar = function (container, DataStore, controller) {

            // Fields
            var _container = container, _DataStore = DataStore, _controller = controller;
            var _innerHtmlElem;
            var _this = this;

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Setup menu plugin
                $(_innerHtmlElem).simpleMenu({
                    onChildMenuElemClicked: onChildMenuElemClicked
                });

            }

            // Event handlers
            var onChildMenuElemClicked = function (childMenuElem) {
                var method = $(childMenuElem).attr("method");
                var methodHandlers = {
                    New: function () {
                        _controller.NewModel();
                    },
                    Open: function () {
                        _controller.OpenFile();
                    },
                    Save: function () {
                        _controller.SaveChanges();
                    },
                    ZoomIn: function () {
                        _controller.ZoomIn();
                    },
                    ZoomOut: function () {
                        _controller.ZoomOut();
                    }
                }

                // 
                methodHandlers[method]();
            }

        }
        return MenuBar;
    });