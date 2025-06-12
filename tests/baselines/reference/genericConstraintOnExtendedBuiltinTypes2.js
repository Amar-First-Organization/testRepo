//// [tests/cases/compiler/genericConstraintOnExtendedBuiltinTypes2.ts] ////

//// [genericConstraintOnExtendedBuiltinTypes2.ts]
module EndGate {
    export interface ICloneable {
        Clone(): any;
    }
}

interface Number extends EndGate.ICloneable { }

module EndGate.Tweening {
    export class Tween<T extends ICloneable>{
        private _from: T;

        constructor(from: T) {
            this._from = from.Clone();
        }
    }
}

module EndGate.Tweening {
    export class NumberTween extends Tween<Number>{
        constructor(from: number) {
            super(from);
        }
    }
}

//// [genericConstraintOnExtendedBuiltinTypes2.js]
var EndGate;
(function (EndGate) {
    var Tweening;
    (function (Tweening) {
        class Tween {
            constructor(from) {
                this._from = from.Clone();
            }
        }
        Tweening.Tween = Tween;
    })(Tweening = EndGate.Tweening || (EndGate.Tweening = {}));
})(EndGate || (EndGate = {}));
(function (EndGate) {
    var Tweening;
    (function (Tweening) {
        class NumberTween extends Tweening.Tween {
            constructor(from) {
                super(from);
            }
        }
        Tweening.NumberTween = NumberTween;
    })(Tweening = EndGate.Tweening || (EndGate.Tweening = {}));
})(EndGate || (EndGate = {}));
