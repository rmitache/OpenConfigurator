/*#region Observables*/
var ObservableCollection = function () {

    // Variables
    var koObservableArray = ko.observableArray([]);
    var absoluteItemCounter = 0; // special variable which keeps track of all items that have been part of the collection (this is used for auto-generating identifiers)

    // Special public field
    koObservableArray.IsObservableCollection = true;

    // Public methods
    koObservableArray.GetLength = function () {
        return koObservableArray().length;
    }
    koObservableArray.Add = function (object) {

        // Raise pre-event
        var eventRaiseDetails = koObservableArray.Adding.RaiseEvent(object);

        // If no handlers cancelled the pre-event
        if (eventRaiseDetails.CancelTriggered() === false) {
            koObservableArray.push(object);

            // Raise post-event
            koObservableArray.Added.RaiseEvent(object);

            // Increment special variable
            absoluteItemCounter++;
        }
    }
    koObservableArray.RemoveAt = function (index) {
        var removedObject = koObservableArray()[index];
        koObservableArray.splice(index, 1);
        koObservableArray.Removed.RaiseEvent(removedObject);
    }
    koObservableArray.Remove = function (obj) {
        for (var index = 0; index < koObservableArray().length; index++) {
            if (koObservableArray()[index] === obj) {
                break;
            }
        }

        koObservableArray.RemoveAt(index);
    }
    koObservableArray.RemoveAll = function () {
        while (koObservableArray.GetLength() > 0) {
            koObservableArray.RemoveAt(0);
        }
    }

    koObservableArray.GetAt = function (index) {
        return koObservableArray()[index];
    }
    koObservableArray.ContainsItemWith = function (fieldName, value) {
        if (koObservableArray.GetLength() > 0) {
            var match = ko.utils.arrayFirst(koObservableArray(), function (item) {
                if (item[fieldName] !== undefined)
                    return item[fieldName]() === value;
                else
                    return false;
            });
            return (match !== null);
        }
        else {
            return false;
        }
    }
    koObservableArray.GetItemWithFieldValue = function (fieldName, value) {
        if (koObservableArray.GetLength() > 0) {
            var item = ko.utils.arrayFirst(koObservableArray(), function (item) {
                if (item[fieldName] !== undefined)
                    return item[fieldName]() === value;
                else
                    return false;
            });

            return item;
        }
        else {
            return false;
        }
    }
    koObservableArray.GetAbsoluteItemCounter = function () {
        return absoluteItemCounter;
    }

    // Events
    koObservableArray.Adding = new Event();
    koObservableArray.Added = new Event();
    koObservableArray.Removed = new Event();

    //
    return koObservableArray;
}
var ObservableField = function () {
    // Can be called in the following ways
    // - with 2 parameters (sourceFieldParent, sourceFieldName) -> will create an observable and bind it (1 way) to the source field
    // - with 1 parameter (initial default value) -> will create an observable with the given initial default value
    // - without any parameters -> 

    // Variables
    var koObservable;

    // Implicit constructor logic
    if (arguments.length === 2) {
        var sourceFieldParent = arguments[0], sourceFieldName = arguments[1];
        var koObservable = ko.observable(sourceFieldParent[sourceFieldName]); // set the initial value for the koObservable to be that of the source field
        koObservable.subscribe(function (newVal) { // bind the koObs so it updates the value of the source field whenever it is changed itself
            sourceFieldParent[sourceFieldName] = newVal;
        });
    } else if (arguments.length === 1) {
        var defaultValue = arguments[0];
        koObservable = ko.observable(defaultValue);

    } else if (arguments.length === 0) {
        koObservable = ko.observable();
    }


    // Setup extra stuff
    koObservable.Changed = new Event();
    koObservable.subscribe(function (newVal) {
        koObservable.Changed.RaiseEvent(newVal);
    });
    koObservable.IsObservableField = true;

    return koObservable;
}
var InnerChangeTrackingManager = function (rootObjectToTrack) {

    // Fields
    var _rootObjectToTrack = rootObjectToTrack;
    var _hasChanges = new ObservableField(false);
    var _this = this;

    // Private methods
    function bindToChildProperties(targetObject) {
        if (!targetObject.ChildChangesTracked) {

            // Mark the object as having been binded to already 
            targetObject.ChildChangesTracked = true;

            // Bind to its properties
            for (var propertyName in targetObject) {
                var property = targetObject[propertyName];
                if (propertyName !== "Selected" && property !== null) { // ignore Selected and null properties

                    // Bind to observable field
                    if (property.IsObservableField) {
                        property.Changed.AddHandler(new EventHandler(onObservableChanged, "changeTracker"));
                    }

                    // Bind to observable collection 
                    if (property.IsObservableCollection) {
                        property.Added.AddHandler(new EventHandler(onCLOAdded, "changeTracker"));
                        property.Removed.AddHandler(new EventHandler(onCLORemoved, "changeTracker"));

                        // Bind to all CLOs it currently contains
                        for (var i = 0; i < property.GetLength() ; i++) {
                            var childCLO = property.GetAt(i);
                            bindToChildProperties(childCLO);
                        }
                    }
                }
            }
        }
    }
    function unbindChildProperties(targetObject) {
        if (targetObject.ChildChangesTracked) {

            // Remove marking
            delete targetObject.ChildChangesTracked;

            //
            for (var propertyName in targetObject) {
                var property = targetObject[propertyName];
                if (propertyName !== "Selected" && property !== null) { // ignore Selected and null properties

                    // Unbind from observable field
                    if (property.IsObservableField) {
                        property.Changed.RemoveHandler("changeTracker");
                    }

                    // Unbind from observable collection 
                    if (property.IsObservableCollection) {
                        property.Added.RemoveHandler("changeTracker");
                        property.Removed.RemoveHandler("changeTracker");

                        // Unbind from all CLOs it currently contains
                        for (var i = 0; i < property.GetLength() ; i++) {
                            var childCLO = property.GetAt(i);
                            unbindChildProperties(childCLO);
                        }
                    }
                }
            }
        }

    }

    // Initialize
    this.Initialize = function () {

        // Loop through all the object properties and bind to changes in ObservableFields and ObservableCollections
        bindToChildProperties(_rootObjectToTrack);

        // Add special HasChanges field to the target object
        _rootObjectToTrack.HasChanges = _hasChanges;
    }

    // Event handlers
    var onObservableChanged = function () {
        _hasChanges(true);
    }
    var onCLOAdded = function (addedCLO) {
        // Bind to the clo 
        bindToChildProperties(addedCLO);

        // Manually raise changes on the root
        _hasChanges(true);
    }
    var onCLORemoved = function (removedCLO) {
        // Unbind to the clo 
        unbindChildProperties(removedCLO);

        // Manually raise changes on the root
        _hasChanges(true);
    }
}
/*#endregion*/
/*#region Events*/
var Event = function () {

    // Fields
    var _handlers = [];
    var _suppressionEnabled = false;
    var _this = this;

    // Private methods
    function handlerWithNameExists(name) {
        for (var i = 0; i < _handlers.length; i++) {
            if (_handlers[i].GetName() === name) {
                return true;
            }
        }

        return false;
    }

    // Public Methods
    this.AddHandler = function (handler) {
        if (handler.GetName() !== null && handlerWithNameExists(handler.GetName())) {
            throw { message: "Handler with name '" + handler.GetName() + "' already exists" };
        } else {
            _handlers.push(handler);
        }
    }
    this.RaiseEvent = function () { // can be called with any number of arbitrary arguments (both as an array: [arg1, arg2] or directly as: arg1,arg2)

        // Get the arguments and place them in an array.
        var argsArray;
        if (arguments.length === 1 && $.isArray(arguments[0])) {
            argsArray = arguments[0]; // passed as array ([arg1, arg2])
        } else {
            argsArray = Array.prototype.slice.call(arguments, 0); // passed directly (arg1,arg2)
        }

        // Call each of the handlers, if event suppresion is not enabled 
        var eventRaiseObj = new EventRaiseDetails();
        if (_suppressionEnabled === false) {
            for (var i = 0; i < _handlers.length; i++) {
                _handlers[i].NotifyEventRaised.call(null, argsArray, eventRaiseObj);
            }
        }

        // Return the eventRaiseDetails object associated with this event raise
        return eventRaiseObj;
    }
    this.SetNotificationSuppresion = function (bool) { // allows to supress sending notifications to handlers when the event is raised
        _suppressionEnabled = bool;
    }
    this.RemoveAllHandlers = function () {
        _handlers = {};
    }
    this.RemoveHandler = function (name) {
        for (var i = 0; i < _handlers.length; i++) {
            if (_handlers[i].GetName() === name) {
                _handlers.splice(i, 1);
            }
        }
    }
}
var EventHandler = function (func, name) {

    // Fields
    var _func = func, _name = name;
    var _this = this;

    // Properties
    this.GetName = function () {
        if (_name !== undefined) {
            return _name;
        } else {
            return null;
        }
    }

    // Methods
    this.NotifyEventRaised = function (argsArray, eventRaiseObj) {

        // Variables
        var mergedArgs = argsArray.slice(0);
        mergedArgs.push(eventRaiseObj);

        // Call function
        _func.apply(this, mergedArgs); // the event raise object is passed as an extra argument
    }
}
var EventRaiseDetails = function () {

    // Fields
    var _cancelled = false;
    var _this = this;

    // Propertes
    this.CustomArguments = {}; // can be used for passing data between multiple event handlers, as well as from a pre-event handler to a post-event handler
    this.CancelTriggered = function () {
        return _cancelled;
    }

    // Methods
    this.TriggerCancel = function () {
        _cancelled = true;
    }
}
/*#endregion*/
/*#region States*/
var InnerStateManager = function (targetStatesReference, initialStateName, targetChangedEvent) {

    // Fields
    var _targetStatesReference = targetStatesReference, _initialStateName = initialStateName;
    var _targetChangedEvent = targetChangedEvent;
    var _currentStateName = null;
    var _this = this;



    // Init
    this.Initialize = function () {

        // Enter the initial state
        _currentStateName = _initialStateName;
        var currentState = targetStatesReference[_currentStateName];
        currentState.EnterState();
    }

    // Public methods
    this.GetCurrentStateName = function () {
        return _currentStateName;
    }
    this.SwitchToState = function (newStateName) {

        // Switch to the new state, as long as it is not the same
        if (newStateName !== _currentStateName) {

            // Remember the old UI state and set the new
            var oldStateName = _currentStateName;

            // Leave the old state and enter the new one
            var oldState = _targetStatesReference[oldStateName];
            var newState = _targetStatesReference[newStateName];
            oldState.LeaveState();
            _currentStateName = newStateName;
            newState.EnterState();

            // Raise target "changed" event, if one is provided
            if (_targetChangedEvent !== undefined && _targetChangedEvent !== null) {
                _targetChangedEvent.RaiseEvent(oldStateName, newStateName);
            }
        }
    }
}
/*#endregion*/

