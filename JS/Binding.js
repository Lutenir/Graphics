function Binding(mediator, bindingSettings, bindingsLayer) {
    var bindingsLayer = new Layer();
    this.getPoint = function (point) {
        var bindedPoint = point;
        if(bindingSettings.bindToGrid)
        {
            bindedPoint = bindToGrid(bindedPoint);
        }
        return bindedPoint;
    }
    this.drawPoint = function (point) {
        bindingsLayer.removeChildren();
        if(bindingSettings.bindToGrid)
        {
            var bindedPoint = bindToGrid(point);
            var line1 = new Path(bindedPoint.subtract(5), bindedPoint.add(5));
            var line2 = new Path(new Point(bindedPoint.x - 5, bindedPoint.y + 5), new Point(bindedPoint.x + 5, bindedPoint.y - 5));
            bindingsLayer.addChild(line1);
            bindingsLayer.addChild(line2);
            line1.strokeColor = 'grey';
            line1.strokeWidth = 1;
            line1.strokeScaling = false;
            line2.strokeColor = 'grey';
            line2.strokeWidth = 1;
            line2.strokeScaling = false;
        }
    }.bind(this);
    this.clear = function()
    {
        bindingsLayer.removeChildren();
    }

    function bindToGrid(point) {

        return point.divide(bindingSettings.gridStep).round().multiply(bindingSettings.gridStep);
    }
}