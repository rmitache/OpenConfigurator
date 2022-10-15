define("Main/VisualView/ConnectorElem/ConnectorElem",
    [
    ],
    function () {
        var ConnectorElem = function (parentConnection, raphaelConnectorType, connectorStyle, positionType, parentCanvasInstance) {

            // Fields
            var _canvasInstance = parentCanvasInstance;
            var _innerElements = {
                raphaelElem: null
            };
            var _connectionElement = parentConnection;
            var _this = this;

            // Properties
            this.InnerElements = _innerElements;

            // Private methods
            function refresh() {

                //
                var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier;
                var yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier;
                _innerElements.raphaelElem.attr({ cx: xPos, cy: yPos, x: xPos, y: yPos });

                //
                var scaledDimensions = $.extend(true, {}, raphaelConnectorType.Dimensions);
                for (var dimensionKey in scaledDimensions) {
                    var originalValue = scaledDimensions[dimensionKey];
                    scaledDimensions[dimensionKey] = originalValue * Settings.ScaleModifier;
                }
                _innerElements.raphaelElem.attr(scaledDimensions);
            }

            // Initialize
            this.Initialize = function () {

                //Create raphaelElem
                var scaledDimensions = $.extend(true, {}, raphaelConnectorType.Dimensions);
                for (var dimensionKey in scaledDimensions) {
                    var originalValue = scaledDimensions[dimensionKey];
                    scaledDimensions[dimensionKey] = originalValue * Settings.ScaleModifier;
                }

                var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier;
                var yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier; //position for endConnector
                _innerElements.raphaelElem = eval("_canvasInstance." + raphaelConnectorType.RaphaelType + "(xPos, yPos" + paramsToString(scaledDimensions) + ")");
                _innerElements.raphaelElem.attr(connectorStyle);
            }

            // Public methods
            this.RefreshGraphicalRepresentation = function () {
                refresh();
            }
            this.Delete = function () {
                _innerElements.raphaelElem.remove();
                _innerElements.raphaelElem = null;
            }
            this.Update = function (newConnectorStyle) {
                _innerElements.raphaelElem.attr(newConnectorStyle);
            }
            this.RemoveSelf = function () {
                _innerElements.raphaelElem.remove();
                _innerElements.raphaelElem = null;
            }
        }
        return ConnectorElem;
    });