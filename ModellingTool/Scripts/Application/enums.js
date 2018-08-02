// Settings and defaults
var CLOTypes = {
    Model: "Model",
    Feature: "Feature",
    Attribute: "Attribute",
    Relation: "Relation",
    GroupRelation: "GroupRelation",
    CompositionRule: "CompositionRule",
    CustomRule: "CustomRule"
}
var Enums = {

    // Client-only
    CLODataStates: {
        Unchanged: "Unchanged",
        Modified: "Modified",
        Deleted: "Deleted",
        New: "New"
    },
    UIElementStates: {
        Selected: "Selected",
        Unselected: "Unselected",
        Wireframe: "Wireframe"
    },
    VisualView: {
        ElemTypes: {
            FeatureElem: "FeatureElem",
            RelationElem: "RelationElem",
            GroupRelationElem: "GroupRelationElem",
            CompositionRuleElem: "CompositionRuleElem"
        },
        StateNames: {
            Default: "Default",
            CreatingNewFeature: "CreatingNewFeature",
            CreatingNewRelation: "CreatingNewRelation",
            CreatingNewGroupRelation: "CreatingNewGroupRelation",
            CreatingNewCompositionRule: "CreatingNewCompositionRule"
        }
    },
    ConnectorPositionTypes: {
        EndPoint: "EndPoint",
        StartPoint: "StartPoint"
    },

    // Also on server  
    UIOrientationTypes: {
        Vertical: 0,
        Horizontal: 1
    },
    AttributeTypes: {
        Constant: 0,
        Dynamic: 1,
        UserInput: 2
    },
    AttributeDataTypes: {
        Integer: 0,
        Boolean: 1,
        String: 2
    },
    RelationTypes: {
        Mandatory: 0,
        Optional: 1
        //Cloneable: 2
    },
    GroupRelationTypes: {
        OR: 0,
        XOR: 1,
        Cardinal: 2
    },
    CompositionRuleTypes: {
        Dependency: 0,
        MutualDependency: 1,
        MutualExclusion: 2
    }
}
var EnumExtraInfo = {
    RelationTypes_Info: {},
    GroupRelationTypes_Info: {}
}
EnumExtraInfo.RelationTypes_Info[Enums.RelationTypes.Mandatory] = {
    FixedLowerBound: 1,
    FixedUpperBound: 1
}
EnumExtraInfo.RelationTypes_Info[Enums.RelationTypes.Optional] = {
    FixedLowerBound: 0,
    FixedUpperBound: 1
}
EnumExtraInfo.RelationTypes_Info[Enums.RelationTypes.Cloneable] = {
    FixedLowerBound: null,
    FixedUpperBound: null
}
EnumExtraInfo.GroupRelationTypes_Info[Enums.GroupRelationTypes.OR] = {
    FixedLowerBound: 1,
    FixedUpperBound: -1
}
EnumExtraInfo.GroupRelationTypes_Info[Enums.GroupRelationTypes.XOR] = {
    FixedLowerBound: 1,
    FixedUpperBound: 1
}
EnumExtraInfo.GroupRelationTypes_Info[Enums.GroupRelationTypes.Cardinal] = {
    FixedLowerBound: null,
    FixedUpperBound: null
}
var Settings = {
    UIOrientation: Enums.UIOrientationTypes.Vertical, //determines orientation of diagram - options: Horizontal / Vertical / false (automatic - needs bug fixing to work properly),
    DrawCurves: true,
    ScaleModifier: 1,
    DisplayCardinalities: "Full" //determines how many cardinalities to display - options : "None" (no cardinalities) / "Partial" (only cloneable and cardinal groups) / "All" (all relations and groupRelations)
}
var UIStyles = {
    Common: {
        Glow: {
            attr: {
                width: 10,
                opacity: 0.5,
                color: "black"
            }
        },
        Connection: {
            States: {
                Unselected: {
                    Line: {
                        attr: {
                            fill: "none",
                            stroke: "#CDCDCD",
                            "stroke-width": 1.5,
                            "stroke-linejoin": "round"
                        }
                    }
                },
                Selected: {
                    Line: {
                        attr: {
                            stroke: "Black",
                            fill: "none",
                            "stroke-width": 3
                        }
                    }
                }
            }
        },
        OuterElement: {
            attr: {
                stroke: "black",
                fill: "black",
                "stroke-width": 15,
                opacity: 0,
                cursor: "default"
            }
        },
        SelectionRectangle: {
            Box: {
                attr: {
                    stroke: "#D8D7D6",
                    "stroke-dasharray": "-"
                }
            }
        },
        CardinalityLabel: {
            Text: {
                attr: {
                    "font-size": 10
                }
            },
            Box: {
                Dimensions: {
                    width: 30,
                    height: 15
                },
                attr: {
                    opacity: 1,
                    fill: "#FFFFC6",
                    "stroke-width": 1,
                    stroke: "#CECECE"
                }
            }
        }
    },
    Feature: {
        General: {
            Box: {
                Dimensions: {
                    width: 90,
                    height: 20,
                    maxWidth: 150,
                    paddingLeftRight: 3
                }
            },
            Text: {
                "font-size": 10
            }
        },
        States: {
            Unselected: {
                Box: {
                    attr: {
                        fill: "#F0FBBD",
                        stroke: "#A6C70C",
                        "stroke-width": 0.5,
                        opacity: 1
                    }
                },
                Line: {
                    attr: {
                        fill: "#E1E9FF",
                        stroke: "#CECECE",
                        "stroke-width": 1,
                        opacity: 1
                    }
                },
                Text: {
                    attr: {
                        cursor: "default"
                    }
                }
            },
            Selected: {
                Box: {
                    attr: {
                        fill: "#BCEA51",
                        stroke: "black",
                        "stroke-width": 1,
                        opacity: 1
                    }
                },
                Text: {
                    attr: {
                        cursor: "default",
                        fill: "red"
                    }
                }
            },
            Wireframe: {
                Box: {
                    attr: {
                        fill: "#E4E4E4",
                        stroke: "Gray",
                        "stroke-width": 1.2,
                        opacity: 0.5
                    }
                },
                Text: {
                    attr: {
                        opacity: 0
                    }
                }
            }
        }
    },
    Relation: {
        General: {
            Connection: {
                Connectors: {
                    EndConnector: {
                        RaphaelType: "circle",
                        DimensionModifier: 0,
                        Dimensions: {
                            r: 5 //radius
                        }
                    }
                }
            }
        },
        SubTypes: {
            Mandatory: {
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "black",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            Optional: {
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "#fff7d7",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            Cloneable: {
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "#fff7d7",
                                opacity: 0
                            }
                        }
                    }
                }
            }
        }

    },
    GroupRelation: {
        General: {
            RootArc: {
                attr: {
                    stroke: "Black",
                    "stroke-width": 1
                },
                Dimensions: {
                    Length: 35
                }
            },
            Connection: {
                Connectors: {
                    EndConnector: {
                        RaphaelType: "rect",
                        DimensionModifier: 5, //used to center rect
                        Dimensions: {
                            width: 11,
                            height: 11
                        }
                    }
                }
            }
        },
        SubTypes: {
            OR: {
                RootArc: {
                    attr: {
                        fill: "Black",
                        opacity: 1
                    }
                },
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "black",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            XOR: {
                RootArc: {
                    attr: {
                        fill: "#ffffff",
                        opacity: 1
                    }
                },
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {

                                fill: "#fff7d7",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            Cardinal: {
                RootArc: {
                    attr: {
                        fill: "#ffffff",
                        opacity: 0
                    }
                },
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "#fff7d7",
                                opacity: 0
                            }
                        }
                    }
                }
            }
        }
    },
    CompositionRule: {
        General: {
            Connection: {
                Line: {
                    attr: {
                        "stroke-dasharray": ["- "],
                        opacity: 0.5
                    }
                }
            }
        },
        SubTypes: {
            Dependency: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "green",
                            'arrow-end': 'classic-wide-long'
                        }
                    }
                }
            },
            MutualDependency: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "green",
                            'arrow-end': 'classic-wide-long',
                            'arrow-start': 'classic-wide-long'
                        }
                    }
                }
            },
            MutualExclusion: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "red",
                            'arrow-end': 'classic-wide-long',
                            'arrow-start': 'classic-wide-long'
                        }
                    }
                }
            }
        }
    }
}
var SystemDefaults = {
    Orientations: {
        Horizontal: {
            Name: "Horizontal",
            Opposite: "Vertical",
            CardinalityDistances: {
                GroupRelation: 17,
                Relation: 30
            },
            ArcModifiers: { rx: 6, ry: 12 },
            ArcDirection: {
                LeftToRight: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.x < pointA.x) {
                            return true;
                        }
                    },
                    ArcSweep: 0
                },
                RightToLeft: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.x > pointA.x) {
                            return true;
                        }
                    },
                    ArcSweep: 1
                }
            },
            Connections: [["left", "right"], ["right", "left"]],
            CurveModifiers: [{ x: -40, y: 0 }, { x: +40, y: 0 }],
            AngleIntervals: [{ min: 0, max: 45 }, { min: 136, max: 224 }, { min: 316, max: 359 }]
        },
        Vertical: {
            Name: "Vertical",
            Opposite: "Horizontal",
            CardinalityDistances: {
                GroupRelation: 17,
                Relation: 30
            },
            ArcModifiers: { rx: 12, ry: 6 },
            ArcDirection: {
                UpToDown: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.y < pointA.y) {
                            return true;
                        }
                    },
                    ArcSweep: 0
                },
                DownToUp: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.y > pointA.y) {
                            return true;
                        }
                    },
                    ArcSweep: 1
                }
            },
            Connections: [["top", "bottom"], ["bottom", "top"]],
            CurveModifiers: [{ x: 0, y: -40 }, { x: 0, y: +40 }],
            AngleIntervals: [{ min: 46, max: 135 }, { min: 225, max: 315 }]
        }
    }
}