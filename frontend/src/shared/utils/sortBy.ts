export function sortByNumericValue<T>(selector: (item: T) => number) {
    return (firstValue: T, secondValue: T) =>
        selector(firstValue) - selector(secondValue);
}
