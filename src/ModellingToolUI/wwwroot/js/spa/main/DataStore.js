define("Main/DataStore",
    [],
    function () {
        var DataStore = function () {

            // Fields
            var _bloService = null, _cloFactory = null;
            var _currentModelCLO = null;
            var _deletedCLOs = {};
            var _this = this;

            // Properties
            this.GetCurrentModelCLO = function () {
                return _currentModelCLO;
            }

            // Init
            this.Initialize = function () {

                // Instantiate inner classes
                if (_bloService === null || _bloService === undefined) {
                    _bloService = new DataStore.BLOService();
                    _bloService.Initialize();
                }
                if (_cloFactory === null || _cloFactory === undefined) {
                    _cloFactory = new DataStore.CLOFactory(_bloService);
                    _cloFactory.Initialize();
                }
            }

            // Public methods
            this.CreateNewCLO = function (cloType, extraParams) {
                return _cloFactory.CreateNewCLO(cloType, extraParams);
            }
            this.GetByClientID = function (clientID) {
                return _cloFactory.GetByClientID(clientID);
            }
            this.DeleteByClientID = function (clientID) {

                // Get the clo 
                var clo = _this.GetByClientID(clientID);

                // If it is not already deleted
                if (clo.DataState !== Enums.CLODataStates.Deleted) {
                    clo.DataState = Enums.CLODataStates.Deleted; // mark it as deleted
                    _deletedCLOs[clientID] = clo; // add it to the deleted clo collection

                    // Handle clo type specific delete operation
                    switch (clo.GetType()) {
                        case CLOTypes.Feature:
                            _currentModelCLO.Features.Remove(clo);
                            for (var i = clo.Attributes.GetLength() ; i > 0; i--) {// delete attributes
                                _this.DeleteByClientID(clo.Attributes.GetAt(i - 1).GetClientID());
                            }
                            for (var i = clo.RelatedCLOS.GetLength() ; i > 0; i--) { // delete adjacent relations
                                _this.DeleteByClientID(clo.RelatedCLOS.GetAt(i - 1).GetClientID());
                            }

                            break;

                        case CLOTypes.Attribute:
                            clo.ParentFeature.Attributes.Remove(clo);
                            break;

                        case CLOTypes.Relation:
                            _currentModelCLO.Relations.Remove(clo);
                            clo.ParentFeature.RelatedCLOS.Remove(clo);
                            clo.ChildFeature.RelatedCLOS.Remove(clo);
                            break;

                        case CLOTypes.GroupRelation:
                            _currentModelCLO.GroupRelations.Remove(clo);
                            clo.ParentFeature.RelatedCLOS.Remove(clo);
                            for (var i = 0; i < clo.ChildFeatures.GetLength() ; i++) {
                                clo.ChildFeatures.GetAt(i).RelatedCLOS.Remove(clo);
                            }
                            break;

                        case CLOTypes.CompositionRule:
                            _currentModelCLO.CompositionRules.Remove(clo);
                            clo.FirstFeature.RelatedCLOS.Remove(clo);
                            clo.SecondFeature.RelatedCLOS.Remove(clo);
                            break;

                        case CLOTypes.CustomRule:
                            _currentModelCLO.CustomRules.Remove(clo);
                            break;

                    }

                    // Raise events
                    _this.CLODeleted.RaiseEvent(clo);
                }
            }
            this.CreateAndLoadNewModel = function () {

                // Clean up current Model (if one is present)
                var currentModel = _currentModelCLO;
                if (_currentModelCLO !== null) {
                    _currentModelCLO = null;
                    _deletedCLOs = {};
                    _cloFactory.Reset();
                    _this.ModelUnloaded.RaiseEvent(currentModel);
                }

                // Init a new ModelCLO
                _currentModelCLO = _cloFactory.CreateNewCLO(CLOTypes.Model);
                _this.ModelLoaded.RaiseEvent(_currentModelCLO);
            }
            this.LoadExistingModel = function (ModelName) {

                // Clean up current Model (if one is present)
                if (_currentModelCLO !== null) {
                    var modelCLO = _currentModelCLO;
                    _currentModelCLO = null;
                    _deletedCLOs = {};
                    _cloFactory.Reset();
                    _this.ModelUnloaded.RaiseEvent(modelCLO);
                }

                // Get the existing feature model
                var ModelBLO = _bloService.GetModel(ModelName);
                var loadedModelCLO = _cloFactory.FromBLO(ModelBLO, CLOTypes.Model);

                // Attempt to load the model
                var eventRaiseDetails = _this.ModelLoading.RaiseEvent(_currentModelCLO);
                if (eventRaiseDetails.CancelTriggered() === false) {
                    _currentModelCLO = loadedModelCLO;
                    _this.ModelLoaded.RaiseEvent(_currentModelCLO);
                }

            }
            this.GetAllModelFiles = function () {
                var modelNames = _bloService.GetAllModelFiles();
                return modelNames;
            }
            this.SaveChanges = function () {

                //
                var ModelBLO = _cloFactory.ToBLO(_currentModelCLO);
                _bloService.SaveChanges(ModelBLO);

                // 
                _currentModelCLO.HasChanges(false);
            }

            // Events
            this.ModelLoading = new Event();
            this.ModelLoaded = new Event();
            this.ModelUnloaded = new Event();
            this.CLODeleted = new Event();
        }
        DataStore.CLOFactory = function (bloService) {

            var FromBLO = {
                Model: function (blo) {
                    
                    // Strip off all child collections from the blo
                    var strippedOffBLOArrays = stripOffChildArrays(blo); // it is assumed all arrays on BLOs are part of BLO Lists

                    // Create it
                    var newClientID = getNewClientID();
                    var newCLO = new ModelCLO(newClientID, blo);

                    // Child Features
                    for (var i = 0; i < strippedOffBLOArrays.Features.length; i++) {
                        var featureCLO = FromBLO.Feature(strippedOffBLOArrays.Features[i]);
                        newCLO.Features.Add(featureCLO);
                    }
                    // Child Relations
                    for (var i = 0; i < strippedOffBLOArrays.Relations.length; i++) {
                        var relationBLO = strippedOffBLOArrays.Relations[i];
                        var relationCLO = FromBLO.Relation(strippedOffBLOArrays.Relations[i]);

                        // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                        relationCLO.ParentFeature = newCLO.Features.GetItemWithFieldValue("Identifier", relationBLO.ParentFeature.Identifier);
                        relationCLO.ChildFeature = newCLO.Features.GetItemWithFieldValue("Identifier", relationBLO.ChildFeature.Identifier);
                        delete relationBLO.ParentFeature; delete relationBLO.ChildFeature; // delete them off the BLO afterwards

                        newCLO.Relations.Add(relationCLO);
                    }
                    // Child GroupRelations
                    for (var i = 0; i < strippedOffBLOArrays.GroupRelations.length; i++) {
                        var groupRelationBLO = strippedOffBLOArrays.GroupRelations[i];
                        var groupRelationCLO = FromBLO.GroupRelation(strippedOffBLOArrays.GroupRelations[i]);

                        // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                        groupRelationCLO.ParentFeature = newCLO.Features.GetItemWithFieldValue("Identifier", groupRelationBLO.ParentFeature.Identifier);
                        for (var j = 0; j < groupRelationBLO.ChildFeatures.length; j++) {
                            var childFeatureIdentifier = groupRelationBLO.ChildFeatures[j].Identifier;
                            groupRelationCLO.ChildFeatures.Add(newCLO.Features.GetItemWithFieldValue("Identifier", childFeatureIdentifier));
                        }
                        delete groupRelationBLO.ParentFeature; delete groupRelationBLO.ChildFeatures; // delete them off the BLO afterwards


                        newCLO.GroupRelations.Add(groupRelationCLO);
                    }
                    // Child CompositionRules
                    for (var i = 0; i < strippedOffBLOArrays.CompositionRules.length; i++) {
                        var compositionRuleBLO = strippedOffBLOArrays.CompositionRules[i];
                        var compositionRuleCLO = FromBLO.CompositionRule(strippedOffBLOArrays.CompositionRules[i]);

                        // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                        compositionRuleCLO.FirstFeature = newCLO.Features.GetItemWithFieldValue("Identifier", compositionRuleBLO.FirstFeature.Identifier);
                        compositionRuleCLO.SecondFeature = newCLO.Features.GetItemWithFieldValue("Identifier", compositionRuleBLO.SecondFeature.Identifier);
                        delete compositionRuleBLO.FirstFeature; delete compositionRuleBLO.SecondFeature; // delete them off the BLO afterwards

                        newCLO.CompositionRules.Add(compositionRuleCLO);
                    }
                    // Child CustomRules
                    for (var i = 0; i < strippedOffBLOArrays.CustomRules.length; i++) {
                        var customRuleCLO = FromBLO.CustomRule(strippedOffBLOArrays.CustomRules[i]);
                        newCLO.CustomRules.Add(customRuleCLO);
                    }


                    // Initialize and return
                    newCLO.Initialize();
                    return newCLO;
                },
                Feature: function (blo) {

                    // Strip off all child collections from the blo
                    var strippedOffArrays = stripOffChildArrays(blo);

                    // Create it
                    var newClientID = getNewClientID();
                    var newCLO = new FeatureCLO(newClientID, blo);

                    // Child Attributes
                    for (var i = 0; i < strippedOffArrays.Attributes.length; i++) {
                        var attributeCLO = FromBLO.Attribute(strippedOffArrays.Attributes[i]);
                        attributeCLO.Initialize();
                        newCLO.Attributes.Add(attributeCLO);
                    }

                    // Register and return it
                    newCLO.Initialize();
                    _factoryCLORegister[newCLO.GetClientID()] = newCLO;
                    return newCLO;
                },
                Attribute: function (blo) {

                    // Create the clo
                    var newClientID = getNewClientID();
                    var newCLO = new AttributeCLO(newClientID, blo);

                    // Register and return it
                    newCLO.Initialize();
                    _factoryCLORegister[newCLO.GetClientID()] = newCLO;
                    return newCLO;
                },
                Relation: function (blo, parentFeatureCLO, childFeatureCLO) {

                    // Create the clo
                    var newClientID = getNewClientID();
                    var newCLO = new RelationCLO(newClientID, blo);

                    // Set parent/child feature CLOs if they are provided as parameters
                    if (parentFeatureCLO !== undefined && childFeatureCLO !== undefined) {
                        newCLO.ParentFeature = parentFeatureCLO;
                        newCLO.ChildFeature = childFeatureCLO;
                        parentFeatureCLO.RelatedCLOS.Add(newCLO);
                        childFeatureCLO.RelatedCLOS.Add(newCLO);
                    }

                    // Register and return it
                    newCLO.Initialize();
                    _factoryCLORegister[newCLO.GetClientID()] = newCLO;
                    return newCLO;
                },
                GroupRelation: function (blo, parentFeatureCLO, childFeatureCLOs) {

                    // Create the clo
                    var newClientID = getNewClientID();
                    var newCLO = new GroupRelationCLO(newClientID, blo);

                    // Set parent/child feature CLOs if they are provided as parameters
                    if (parentFeatureCLO !== undefined && childFeatureCLOs !== undefined) {
                        newCLO.ParentFeature = parentFeatureCLO;
                        parentFeatureCLO.RelatedCLOS.Add(newCLO);

                        // ChildFeatureCLOs
                        for (var i = 0; i < childFeatureCLOs.length; i++) {
                            newCLO.ChildFeatures.Add(childFeatureCLOs[i]);
                            childFeatureCLOs[i].RelatedCLOS.Add(newCLO);
                        }

                    }

                    // Register and return it
                    newCLO.Initialize();
                    _factoryCLORegister[newCLO.GetClientID()] = newCLO;
                    return newCLO;
                },
                CompositionRule: function (blo, firstFeatureCLO, secondFeatureCLO) {

                    // Create the clo
                    var newClientID = getNewClientID();
                    var newCLO = new CompositionRuleCLO(newClientID, blo);

                    // Set parent/child feature CLOs if they are provided as parameters
                    if (firstFeatureCLO !== undefined && secondFeatureCLO !== undefined) {
                        newCLO.FirstFeature = firstFeatureCLO;
                        newCLO.SecondFeature = secondFeatureCLO;
                        firstFeatureCLO.RelatedCLOS.Add(newCLO);
                        secondFeatureCLO.RelatedCLOS.Add(newCLO);
                    }

                    // Register and return it
                    newCLO.Initialize();
                    _factoryCLORegister[newCLO.GetClientID()] = newCLO;
                    return newCLO;
                },
                CustomRule: function (blo) {

                    // Create the clo
                    var newClientID = getNewClientID();
                    var newCLO = new CustomRuleCLO(newClientID, blo);

                    // Register and return it
                    newCLO.Initialize();
                    _factoryCLORegister[newCLO.GetClientID()] = newCLO;
                    return newCLO;
                },
                ModelFile: function (blo) {

                    // Create the clo
                    var newClientID = getNewClientID();
                    var newCLO = new ModelFileCLO(newClientID, blo);

                    // Register and return it
                    newCLO.Initialize();
                    _factoryCLORegister[newCLO.GetClientID()] = newCLO;
                    return newCLO;
                }
            }
            var ToBLO = {
                Model: function (clo) {

                    // Get its BLO
                    var blo = clo.GetBLOCopy();

                    // Child collections
                    var collectionNames = {
                        Features: "Features",
                        Relations: "Relations",
                        GroupRelations: "GroupRelations",
                        CompositionRules: "CompositionRules",
                        CustomRules: "CustomRules"
                    }
                    for (var key in collectionNames) {
                        for (var i = 0; i < clo[key].GetLength() ; i++) {
                            if (blo[key] === undefined)
                                blo[key] = [];
                            var childCLO = clo[key].GetAt(i);
                            var childBLO = ToBLO[childCLO.GetType()](childCLO);
                            blo[key].push(childBLO);
                        }
                    }

                    //
                    return blo;
                },
                Feature: function (clo) {

                    // Get its BLO
                    var blo = clo.GetBLOCopy();

                    // Child Attributes
                    for (var i = 0; i < clo.Attributes.GetLength() ; i++) {
                        var attributeCLO = clo.Attributes.GetAt(i);
                        var attributeBLO = ToBLO[CLOTypes.Attribute](attributeCLO);
                        if (blo.Attributes === undefined)
                            blo.Attributes = [];
                        blo.Attributes.push(attributeBLO);
                    }

                    //
                    return blo;
                },
                Attribute: function (clo) {

                    // Get its BLO
                    var blo = clo.GetBLOCopy();

                    //
                    return blo;
                },
                Relation: function (clo) {

                    // Get its BLO
                    var blo = clo.GetBLOCopy();

                    // Get Parent/Child Features
                    blo.ParentFeature = ToBLO[CLOTypes.Feature](clo.ParentFeature);
                    blo.ChildFeature = ToBLO[CLOTypes.Feature](clo.ChildFeature);

                    //
                    return blo;
                },
                GroupRelation: function (clo) {

                    // Get its BLO
                    var blo = clo.GetBLOCopy();

                    // Get Parent/Child Features
                    blo.ParentFeature = ToBLO[CLOTypes.Feature](clo.ParentFeature);
                    for (var i = 0; i < clo.ChildFeatures.GetLength() ; i++) {
                        var childFeatureCLO = clo.ChildFeatures.GetAt(i);
                        var childFeatureBLO = ToBLO[CLOTypes.Feature](childFeatureCLO);

                        if (blo.ChildFeatures === undefined)
                            blo.ChildFeatures = [];
                        blo.ChildFeatures.push(childFeatureBLO);
                    }

                    //
                    return blo;
                },
                CompositionRule: function (clo) {

                    // Get its BLO
                    var blo = clo.GetBLOCopy();

                    // Get First/Second Features
                    blo.FirstFeature = ToBLO[CLOTypes.Feature](clo.FirstFeature);
                    blo.SecondFeature = ToBLO[CLOTypes.Feature](clo.SecondFeature);

                    //
                    return blo;
                },
                CustomRule: function (clo) {

                    //
                    var blo = clo.GetBLOCopy();

                    //
                    return blo;
                },
                ModelFile: function (clo) {

                    //
                    var blo = clo.GetBLOCopy();

                    //
                    return blo;
                }
            }

            // Fields
            var _bloService = bloService;
            var _clientIDCounter = 0, _factoryCLORegister = {};
            var _this = this;

            // Private methods
            function getNewClientID() {
                _clientIDCounter += 1;
                return _clientIDCounter;
            }
            function stripOffChildArrays(blo) {

                // Variables
                var strippedOffArrays = {};

                // Go through all properties on the given blo object and remove them if they are of the Array type
                for (var propertyName in blo) {
                    if ($.isArray(blo[propertyName])) {
                        strippedOffArrays[propertyName] = blo[propertyName];
                        delete blo[propertyName];
                    }
                }

                return strippedOffArrays;
            }

            // Init
            this.Initialize = function () {
            }

            // Public methods
            this.GetByClientID = function (clientID) {
                return _factoryCLORegister[clientID];
            }
            this.ToBLO = function (clo) {

                // Get the BLO
                var blo = ToBLO[clo.GetType()](clo);
                return blo;
            }
            this.FromBLO = function (blo, type) {

                // Create the CLO
                var clo = FromBLO[type](blo);
                return clo;
            }
            this.CreateNewCLO = function (cloType, extraParamsArrays) {

                // Get a new default BLO
                var newBLO = _bloService.CreateNewDefaultBLO(cloType);

                // Setup parameters to include extra parameters, if any are provided
                var params = (extraParamsArrays !== undefined) ? extraParamsArrays : [];
                params.unshift(newBLO);

                // Create the CLO
                var newCLO = FromBLO[cloType].apply(_this, params);
                return newCLO;
            }
            this.Reset = function () { // used when loading a new Model
                _clientIDCounter = 0;
                _factoryCLORegister = {};
            }
        }
        DataStore.BLOService = function () {

            // Fields
            var _this = this;

            // Init
            this.Initialize = function () {

            }

            // Public methods
            this.CreateNewDefaultBLO = function (bloTypeName) {

                var newDefaultBLO = null;
                $.ajax({
                    type: "Get",
                    url: "api/CreateNewDefaultBLO",
                    data: { entityTypeName: bloTypeName },
                    async: false,
                    success: function (response) {
                        newDefaultBLO = response;
                    }
                });

                return newDefaultBLO;
            }
            this.SaveChanges = function (ModelBLO) {

                
                var newDefaultBLO = null;
                $.ajax({
                    dataType: "application/json",
                    type: "POST",
                    url: "api/SaveChanges",
                    data: JSON.stringify(ModelBLO),
                    async: false,
                    success: function (response) {
                        newDefaultBLO = response;
                    }
                });

                return newDefaultBLO;
            }
            this.GetModel = function (ModelName) {
                var blo = null;
                $.ajax({
                    type: "Get",
                    url: "api/GetModel",
                    data: { ModelName: ModelName },
                    async: false,
                    success: function (response) {
                        blo = response;
                    }
                });

                return blo;
            }
            this.GetAllModelFiles = function () {
                var blos = null;
                $.ajax({
                    type: "Get",
                    url: "api/GetAllModelNames",
                    data: {},
                    async: false,
                    success: function (response) {
                        blos = response;
                    }
                });

                return blos;
            }
        }
        return DataStore;

    });