function Settings() {
    this.drawing =
        {
            strokeColor: 'red',
            strokeWidth: 1,
            strokeScaling: true,
        };
    this.background =
        {
            showAxis: true,
            axisColor: 'red',
            showGrid: true,
            gridColor: 'orange',
            gridStep: 30,
        };
    this.scaling =
        {
            step: 0.1,
        };
    this.binding =
        {
            bindToGrid: true,
            bindToLineEnds: true,
            bindToIntersections: true,
            bindToCenters: true,
            bindingTolerance: 10,
            gridStep: 30,
        };
}
function SettingsManager(mediator) {
    this.settings = {};
    var settingsObj = new Settings();
    setWrappers(settingsObj, this.settings);

    function setWrappers(source, dest, prevProps) {
        prevProps = prevProps || [];
        for (var s in source) {
            if (typeof(source[s]) == 'object') {
                dest[s] = {};
                setWrappers(source[s], dest[s], prevProps.concat(s));
                Object.defineProperty(dest, s, {
                    writable:false
                });
            }
            else {
                var context = {
                    source: source,
                    name: s.slice(0),
                    prevProps: prevProps,
                }
                Object.defineProperty(dest, s, {

                    get: function () {
                        return this.source[this.name];
                    }.bind(context),

                    set: function (value) {
                        this.source[this.name] = value;
                        var path = prevProps.concat([this.name]).join('.');
                        mediator.publish("settingsChanged", path, value);
                        saveSettings();
                    }.bind(context),
                });
            }
        }
    }

    var saveSettings = function ()
    {
        if(!localStorage) return;
        var json = JSON.stringify(settingsObj);
        localStorage.removeItem('settings');
        localStorage.setItem('settings',json);
    }.bind(this);

    var loadSettings = function () {
        if(!localStorage) return;
        var json = localStorage.getItem('settings');
        if(!json) return;
        var savedSettings = JSON.parse(json);
        $.extend( true,settingsObj,savedSettings );
    }.bind(this);

    this.reset = function()
    {
        this.settings = {};
        var settingsObj = new Settings();
        setWrappers(settingsObj, this.settings);
        saveSettings();
    }
    this.reset();
    loadSettings();
}