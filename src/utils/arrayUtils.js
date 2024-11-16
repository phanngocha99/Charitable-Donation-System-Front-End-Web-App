export function replaceArrJS(arr, stringTarget, stringReplace) {
    const index = arr.indexOf(stringTarget);
    arr.splice(index, 1, stringReplace);
    return arr;
}