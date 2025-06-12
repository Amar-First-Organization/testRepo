//// [tests/cases/compiler/emitSuperCallBeforeEmitPropertyDeclaration1.ts] ////

//// [emitSuperCallBeforeEmitPropertyDeclaration1.ts]
class A {
    blub = 6;
}


class B extends A {

    blub = 12;

    constructor() {
        "use strict";
        'someStringForEgngInject';
        super()
    }
}

//// [emitSuperCallBeforeEmitPropertyDeclaration1.js]
class A {
    constructor() {
        this.blub = 6;
    }
}
class B extends A {
    constructor() {
        "use strict";
        'someStringForEgngInject';
        super();
        this.blub = 12;
    }
}
