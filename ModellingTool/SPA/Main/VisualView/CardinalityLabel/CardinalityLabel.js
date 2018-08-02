define("Main/VisualView/CardinalityLabel/CardinalityLabel",
    [
    ],
    function () {
        var CardinalityLabel = function (firstNumber, secondNumber, calculatePositionFunction, parentCanvasInstance) {

            // Fields
            var _canvasInstance = parentCanvasInstance;
            var _innerElements = {
                box: null,
                text: null
            };
            var _outerElement = null;
            var _firstNumber = firstNumber, _secondNumber = secondNumber;
            var _boxWidth = UIStyles.Common.CardinalityLabel.Box.Dimensions.width * Settings.ScaleModifier, _boxHeight = UIStyles.Common.CardinalityLabel.Box.Dimensions.height * Settings.ScaleModifier;
            var _thisUICardinalityLabel = this;

            // Properties
            this.InnerElements = _innerElements;

            // Private methods
            function refresh() {

                //Scale
                _boxWidth = UIStyles.Common.CardinalityLabel.Box.Dimensions.width * Settings.ScaleModifier;
                _boxHeight = UIStyles.Common.CardinalityLabel.Box.Dimensions.height * Settings.ScaleModifier
                _innerElements.box.attr({ width: _boxWidth, height: _boxHeight });
                _innerElements.text.attr({ "font-size": parseFloat(UIStyles.Common.CardinalityLabel.Text.attr["font-size"]) * Settings.ScaleModifier });

                //
                var labelPoint = calculatePositionFunction();
                _innerElements.box.attr({ x: labelPoint.x - _boxWidth / 2, y: labelPoint.y - _boxHeight / 2 });
                _innerElements.text.attr({ x: labelPoint.x, y: labelPoint.y });

            }

            // Public methods
            this.Initialize = function () {

                // Create box and text
                var labelPoint = calculatePositionFunction();
                _innerElements.box = _canvasInstance.rect(labelPoint.x - _boxWidth / 2, labelPoint.y - _boxHeight / 2, _boxWidth, _boxHeight, 0);
                _innerElements.box.attr(UIStyles.Common.CardinalityLabel.Box.attr);
                _innerElements.text = _canvasInstance.text(labelPoint.x, labelPoint.y, "[" + _firstNumber + ".." + _secondNumber + "]");
                _innerElements.text.attr({ "font-size": parseFloat(UIStyles.Common.CardinalityLabel.Text.attr["font-size"]) * Settings.ScaleModifier });
            }
            this.RefreshGraphicalRepresentation = function () {
                refresh();
            }
            this.RemoveSelf = function () {
                _innerElements.text.remove();
                _innerElements.text = null;
                _innerElements.box.remove();
                _innerElements.box = null;
            }
            this.Update = function (newFirstNumber, newSecondNumber) {
                //
                _firstNumber = newFirstNumber;
                _secondNumber = newSecondNumber

                //Update visuals
                _innerElements.text.attr({ text: "[" + _firstNumber + ".." + _secondNumber + "]" });
            }
        }
        return CardinalityLabel;
    });