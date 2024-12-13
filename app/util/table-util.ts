import {Table} from "@/types/table";

export const getFirstMissingInteger = (setOfNumbers: number[]) => {
    if (setOfNumbers.length === 0) {
        return 1;
    }
    const orderedSetOfNumbers = setOfNumbers.sort((a, b) => a > b ? 1 : -1);
    if (orderedSetOfNumbers[0] !== 1) {
        return 1;
    }
    let index = 0;
    for (let num of orderedSetOfNumbers) {
        if (num + 1 !== orderedSetOfNumbers[index + 1]) {
            return num + 1;
        }
        index++;
    }
    return orderedSetOfNumbers.length + 1;
}

export const getUsedTableNumbers = (tables: Table[]) => Array.from(new Set(
    tables
        .map(x => x.tableNumber)
        .filter(x => x)
));

export const getFirstMissingTableNumber = (tables: Table[]) => getFirstMissingInteger(getUsedTableNumbers(tables));
