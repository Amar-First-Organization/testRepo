1:: modify public to protected
*** Needs explanation
Incremental signature is neither dts signature nor file version for File:: ./messageableperson.ts
Incremental:: {
  "original": {
    "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "signature": "-2474549887-export default MessageablePerson;\n",
    "impliedFormat": 1
  },
  "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "-2474549887-export default MessageablePerson;\n",
  "impliedFormat": "commonjs"
}
Clean:: {
  "original": {
    "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "impliedFormat": 1
  },
  "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "impliedFormat": "commonjs"
}
Dts Signature:: $"-21450256696-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n(116,7)Error4094: Property 'message' of exported class expression may not be private or protected."
2:: no-change-run
*** Needs explanation
Incremental signature is neither dts signature nor file version for File:: ./messageableperson.ts
Incremental:: {
  "original": {
    "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "signature": "-2474549887-export default MessageablePerson;\n",
    "impliedFormat": 1
  },
  "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "-2474549887-export default MessageablePerson;\n",
  "impliedFormat": "commonjs"
}
Clean:: {
  "original": {
    "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "impliedFormat": 1
  },
  "version": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "3462418372-const Messageable = () => {\n    return class MessageableClass {\n        protected message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "impliedFormat": "commonjs"
}
Dts Signature:: $"-21450256696-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n(116,7)Error4094: Property 'message' of exported class expression may not be private or protected."
3:: modify protected to public
*** Needs explanation
TsBuild info text without affectedFilesPendingEmit:: /src/project/tsconfig.tsbuildinfo.readable.baseline.txt::
CleanBuild:
{
  "program": {
    "fileInfos": {
      "../../lib/lib.d.ts": {
        "version": "5700251342-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;\ntype InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;",
        "affectsGlobalScope": true,
        "impliedFormat": "commonjs"
      },
      "./messageableperson.ts": {
        "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
        "impliedFormat": "commonjs"
      },
      "./main.ts": {
        "version": "4191603667-import MessageablePerson from './MessageablePerson.js';\nfunction logMessage( person: MessageablePerson ) {\n    console.log( person.message );\n}",
        "impliedFormat": "commonjs"
      }
    },
    "root": [
      [
        2,
        "./messageableperson.ts"
      ],
      [
        3,
        "./main.ts"
      ]
    ],
    "options": {
      "declaration": true
    },
    "referencedMap": {
      "./main.ts": [
        "./messageableperson.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../lib/lib.d.ts",
      "./main.ts",
      "./messageableperson.ts"
    ]
  },
  "version": "FakeTSVersion"
}
IncrementalBuild:
{
  "program": {
    "fileInfos": {
      "../../lib/lib.d.ts": {
        "version": "5700251342-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;\ntype InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;",
        "affectsGlobalScope": true,
        "impliedFormat": "commonjs"
      },
      "./messageableperson.ts": {
        "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
        "impliedFormat": "commonjs"
      },
      "./main.ts": {
        "version": "4191603667-import MessageablePerson from './MessageablePerson.js';\nfunction logMessage( person: MessageablePerson ) {\n    console.log( person.message );\n}",
        "impliedFormat": "commonjs"
      }
    },
    "root": [
      [
        2,
        "./messageableperson.ts"
      ],
      [
        3,
        "./main.ts"
      ]
    ],
    "options": {
      "declaration": true
    },
    "referencedMap": {
      "./main.ts": [
        "./messageableperson.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../lib/lib.d.ts",
      [
        "./main.ts",
        [
          {
            "file": "./main.ts",
            "start": 131,
            "length": 7,
            "messageText": "Property 'message' is protected and only accessible within class 'MessageableClass' and its subclasses.",
            "category": 1,
            "code": 2445
          }
        ]
      ],
      "./messageableperson.ts"
    ]
  },
  "version": "FakeTSVersion"
}
Incremental signature is neither dts signature nor file version for File:: ./messageableperson.ts
Incremental:: {
  "original": {
    "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "signature": "-2474549887-export default MessageablePerson;\n",
    "impliedFormat": 1
  },
  "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "-2474549887-export default MessageablePerson;\n",
  "impliedFormat": "commonjs"
}
Clean:: {
  "original": {
    "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "signature": "-21006966954-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n",
    "impliedFormat": 1
  },
  "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "-21006966954-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n",
  "impliedFormat": "commonjs"
}
Dts Signature:: $"-21006966954-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n"
4:: no-change-run
*** Needs explanation
TsBuild info text without affectedFilesPendingEmit:: /src/project/tsconfig.tsbuildinfo.readable.baseline.txt::
CleanBuild:
{
  "program": {
    "fileInfos": {
      "../../lib/lib.d.ts": {
        "version": "5700251342-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;\ntype InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;",
        "affectsGlobalScope": true,
        "impliedFormat": "commonjs"
      },
      "./messageableperson.ts": {
        "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
        "impliedFormat": "commonjs"
      },
      "./main.ts": {
        "version": "4191603667-import MessageablePerson from './MessageablePerson.js';\nfunction logMessage( person: MessageablePerson ) {\n    console.log( person.message );\n}",
        "impliedFormat": "commonjs"
      }
    },
    "root": [
      [
        2,
        "./messageableperson.ts"
      ],
      [
        3,
        "./main.ts"
      ]
    ],
    "options": {
      "declaration": true
    },
    "referencedMap": {
      "./main.ts": [
        "./messageableperson.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../lib/lib.d.ts",
      "./main.ts",
      "./messageableperson.ts"
    ]
  },
  "version": "FakeTSVersion"
}
IncrementalBuild:
{
  "program": {
    "fileInfos": {
      "../../lib/lib.d.ts": {
        "version": "5700251342-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;\ntype InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;",
        "affectsGlobalScope": true,
        "impliedFormat": "commonjs"
      },
      "./messageableperson.ts": {
        "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
        "impliedFormat": "commonjs"
      },
      "./main.ts": {
        "version": "4191603667-import MessageablePerson from './MessageablePerson.js';\nfunction logMessage( person: MessageablePerson ) {\n    console.log( person.message );\n}",
        "impliedFormat": "commonjs"
      }
    },
    "root": [
      [
        2,
        "./messageableperson.ts"
      ],
      [
        3,
        "./main.ts"
      ]
    ],
    "options": {
      "declaration": true
    },
    "referencedMap": {
      "./main.ts": [
        "./messageableperson.ts"
      ]
    },
    "semanticDiagnosticsPerFile": [
      "../../lib/lib.d.ts",
      [
        "./main.ts",
        [
          {
            "file": "./main.ts",
            "start": 131,
            "length": 7,
            "messageText": "Property 'message' is protected and only accessible within class 'MessageableClass' and its subclasses.",
            "category": 1,
            "code": 2445
          }
        ]
      ],
      "./messageableperson.ts"
    ]
  },
  "version": "FakeTSVersion"
}
Incremental signature is neither dts signature nor file version for File:: ./messageableperson.ts
Incremental:: {
  "original": {
    "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "signature": "-2474549887-export default MessageablePerson;\n",
    "impliedFormat": 1
  },
  "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "-2474549887-export default MessageablePerson;\n",
  "impliedFormat": "commonjs"
}
Clean:: {
  "original": {
    "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
    "signature": "-21006966954-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n",
    "impliedFormat": 1
  },
  "version": "31173349369-const Messageable = () => {\n    return class MessageableClass {\n        public message = 'hello';\n    }\n};\nconst wrapper = () => Messageable();\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;",
  "signature": "-21006966954-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n",
  "impliedFormat": "commonjs"
}
Dts Signature:: $"-21006966954-declare const wrapper: () => {\n    new (): {\n        message: string;\n    };\n};\ntype MessageablePerson = InstanceType<ReturnType<typeof wrapper>>;\nexport default MessageablePerson;\n"