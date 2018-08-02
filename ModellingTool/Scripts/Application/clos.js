// CLOs
var ModelCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _changeTrackingManager = new InnerChangeTrackingManager(this);
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Model;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Name = new ObservableField(_innerBLO, "Name");
    this.UIOrientation = new ObservableField(_innerBLO, "UIOrientation");
    this.ScaleModifier = new ObservableField(_innerBLO, "ScaleModifier");
    this.Features = new ObservableCollection();
    this.Relations = new ObservableCollection();
    this.GroupRelations = new ObservableCollection();
    this.CompositionRules = new ObservableCollection();
    this.CustomRules = new ObservableCollection();

    // Init
    this.Initialize = function () {

        // Bind to collections
        _this.Features.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.Relations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.GroupRelations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CompositionRules.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CustomRules.Adding.AddHandler(new EventHandler(onCLOAdding));

        // Setup change tracking
        _changeTrackingManager.Initialize();
    }

    // Event handlers
    var onCLOAdding = function (clo, eventRaiseDetails) {
        IdentifierProvider.SetupIdentifier(clo, _this);
    }
}
var FeatureCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Feature;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Selected = new ObservableField();
    this.Attributes = new ObservableCollection();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.XPos = new ObservableField(_innerBLO, "XPos");
    this.YPos = new ObservableField(_innerBLO, "YPos");
    this.RelatedCLOS = new ObservableCollection();

    // Private methods
    function getNewAttributeCLOIdentifier() {

        // Variables
        var identifier;
        var baseIdentifier = CLOTypes.Attribute + "_";

        // Find a suitable Identifier
        var i = _this.Attributes.GetLength();
        do {
            identifier = baseIdentifier + i;
        }
        while (_this.Attributes.ContainsItemWith("Identifier", baseIdentifier + i++));

        return identifier;
    }

    // Init
    this.Initialize = function () {



        // Bind to attributes collection
        _this.Attributes.Added.AddHandler(new EventHandler(onAttributeCLOAdded));


    }

    // Event handlers
    var onAttributeCLOAdded = function (clo) {
        clo.ParentFeature = _this;
        IdentifierProvider.SetupIdentifier(clo, _this);
    }
}
var AttributeCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Attribute;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Description = new ObservableField(_innerBLO, "Description");
    this.AttributeType = new ObservableField(_innerBLO, "AttributeType");
    this.DefaultValue = new ObservableField(_innerBLO, "DefaultValue");
    this.AttributeDataType = new ObservableField(_innerBLO, "AttributeDataType");
    this.ParentFeature = null;

    // Init
    this.Initialize = function () {

    }
}
var RelationCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Relation;
    };
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.ParentFeature = null;
    this.ChildFeature = null;
    this.RelationType = new ObservableField(_innerBLO, "RelationType");
    this.FixedUpperBound = new ObservableField(_innerBLO, "FixedUpperBound");
    this.FixedLowerBound = new ObservableField(_innerBLO, "FixedLowerBound");
    this.UpperBound = new ObservableField(_innerBLO, "UpperBound");
    this.LowerBound = new ObservableField(_innerBLO, "LowerBound");

    // Init
    this.Initialize = function () {
        _this.RelationType.Changed.AddHandler(new EventHandler(function (newValue) {
            _this.FixedUpperBound(EnumExtraInfo.RelationTypes_Info[newValue].FixedUpperBound);
            _this.FixedLowerBound(EnumExtraInfo.RelationTypes_Info[newValue].FixedLowerBound);

            // Set default initial bounds
            _this.LowerBound((_this.FixedLowerBound() == null) ? 1 : _this.FixedLowerBound());
            _this.UpperBound((_this.FixedUpperBound() == null) ? 2 : _this.FixedUpperBound());
        }));
    }
}
var GroupRelationCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.GroupRelation;
    };
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.ParentFeature = null;
    this.ChildFeatures = new ObservableCollection();
    this.GroupRelationType = new ObservableField(_innerBLO, "GroupRelationType");
    this.FixedUpperBound = new ObservableField(_innerBLO, "FixedUpperBound");
    this.FixedLowerBound = new ObservableField(_innerBLO, "FixedLowerBound");
    this.UpperBound = new ObservableField(_innerBLO, "UpperBound");
    this.LowerBound = new ObservableField(_innerBLO, "LowerBound");

    // Init
    this.Initialize = function () {
        _this.GroupRelationType.Changed.AddHandler(new EventHandler(function (newValue) {
            _this.FixedLowerBound(EnumExtraInfo.GroupRelationTypes_Info[newValue].FixedLowerBound);
            _this.FixedUpperBound(EnumExtraInfo.GroupRelationTypes_Info[newValue].FixedUpperBound);

            // Set default initial bounds
            _this.LowerBound((_this.FixedLowerBound() == null) ? 0 : _this.FixedLowerBound());
            _this.UpperBound((_this.FixedUpperBound() == null || _this.FixedUpperBound() == -1) ? _this.ChildFeatures.GetLength() : _this.FixedUpperBound());
        }));
    }
}
var CompositionRuleCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _attributes = [];
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CompositionRule;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Selected = new ObservableField();
    this.Name = new ObservableField(_innerBLO, "Identifier");
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.FirstFeature = null;
    this.SecondFeature = null;
    this.CompositionRuleType = new ObservableField(_innerBLO, "CompositionRuleType");

    // Init
    this.Initialize = function () {

    }
}
var CustomRuleCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _attributes = [];
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CustomRule;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Expression = new ObservableField(_innerBLO, "Expression");
    this.Description = new ObservableField(_innerBLO, "Description");

    // Init
    this.Initialize = function () {

    }
}
