
interface koElement1 {
    // Getter
    (): string;
    (value: string): void;
}


function invoke(fn: (c: number) => void) {
    fn(4);
}

var x: koElement1;
// Desired: error
invoke(x);


interface koElement2 {
    (): string;
    (value: string): void;
    (value: number): void;
}

var y: koElement2;
invoke(y); // Should be OK
