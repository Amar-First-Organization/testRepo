//// [tests/cases/compiler/aliasUsageInGenericFunction.ts] ////

//// [aliasUsageInGenericFunction_backbone.ts]
export class Model {
    public someData: string;
}

//// [aliasUsageInGenericFunction_moduleA.ts]
import Backbone = require("./aliasUsageInGenericFunction_backbone");
export class VisualizationModel extends Backbone.Model {
    // interesting stuff here
}

//// [aliasUsageInGenericFunction_main.ts]
import Backbone = require("./aliasUsageInGenericFunction_backbone");
import moduleA = require("./aliasUsageInGenericFunction_moduleA");
interface IHasVisualizationModel {
    VisualizationModel: typeof Backbone.Model;
}
function foo<T extends { a: IHasVisualizationModel }>(x: T) {
    return x;
}
var r = foo({ a: moduleA });
var r2 = foo({ a: <IHasVisualizationModel>null });


//// [aliasUsageInGenericFunction_backbone.js]
"use strict";
var Model = (function () {
    function Model() {
    }
    return Model;
}());
exports.Model = Model;
//// [aliasUsageInGenericFunction_moduleA.js]
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    if (b) Object.setPrototypeOf ? Object.setPrototypeOf(d, b) : d.__proto__ = b;
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require("./aliasUsageInGenericFunction_backbone");
var VisualizationModel = (function (_super) {
    __extends(VisualizationModel, _super);
    function VisualizationModel() {
        _super.apply(this, arguments);
    }
    return VisualizationModel;
}(Backbone.Model));
exports.VisualizationModel = VisualizationModel;
//// [aliasUsageInGenericFunction_main.js]
"use strict";
var moduleA = require("./aliasUsageInGenericFunction_moduleA");
function foo(x) {
    return x;
}
var r = foo({ a: moduleA });
var r2 = foo({ a: null });
