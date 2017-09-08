// ==ORIGINAL==
function F<T, U extends T[], V extends U[]>(v: V) {
    v.toString();
}
// ==SCOPE::function 'F'==
function F<T, U extends T[], V extends U[]>(v: V) {
    newFunction();

    function newFunction() {
        v.toString();
    }
}
// ==SCOPE::global scope==
function F<T, U extends T[], V extends U[]>(v: V) {
    newFunction<T, U, V>(v);
}
function newFunction<T, U extends T[], V extends U[]>(v: V) {
    v.toString();
}
