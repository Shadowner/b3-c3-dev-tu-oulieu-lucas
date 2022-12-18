const DEBUG = false;
function getMatchIndexes(str: string, re: RegExp | string) {
    let indexMatches = [];
    let match;
    if (typeof re == "string") re = new RegExp(`[${re}]`, "g");

    while (match = re.exec(str)) {
        indexMatches.push(match.index);
    }

    return indexMatches;
}

class AlgoElement {
    public value: number;
    constructor(
        public elementA: AlgoElement | number,
        public elementB: AlgoElement | number,
        public logic: ComputeLogic) {
        this.value = this.valueOf();
    }

    public valueOf(): number {
        return this.logic.call(this.elementA.valueOf(), this.elementB.valueOf());
    }
}



type AlgoSeparator = {
    start: string,
    end?: string,
} | string


export class ComputeLogic {
    public static logics: ComputeLogic[] = []

    constructor(
        public separator: AlgoSeparator,
        public call: (x: number, y: number) => number,
        public description?: string
    ) {
        ComputeLogic.logics.push(this);
    }
}

const paranthesesSeparator: AlgoSeparator = {
    start: "",
    end: ""
}
const add = new ComputeLogic("+", (x, y) => {
    if (DEBUG) console.warn(x, "+", y, "=", x + y)
    return x + y;
},
    "Ajoute deux nombres entre eux.");
const divide = new ComputeLogic("/", (x, y) => {
    if (DEBUG) console.warn(x, "/", y, "=", x / y)
    if (y === 0) throw new Error("Non divisible par 0")
    return x / y;
},
    "Divise deux nombres ");
const multiply = new ComputeLogic("*", (x, y) => {
    if (DEBUG) console.warn(x, "*", y, "=", x * y)
    return x * y;
},
    'Multiplie deux nombres entre eux');
const substract = new ComputeLogic("-", (x, y) => {
    if (DEBUG) console.warn(x, "-", y, "=", x - y)
    return x - y;
},
    "Soustrait deux nombre entre eux");

const square = new ComputeLogic({ start: "sqrt", end: "" }, (x, y) => {
    if (DEBUG) console.warn('sqrt(', x, ")=", Math.sqrt(x), " \t Y = ", y)
    if (x < 0) throw new Error("Impossible de faire la racine d'une nombre négatif")
    return Math.sqrt(x)
},
    "Fait la racine carrée d'un nombre");
const parenthesis = new ComputeLogic({ start: "", end: "" }, (x, y) => {
    if (DEBUG) console.warn('(', x, ") \t Y = ", y)
    return x;
});

const dot = new ComputeLogic(".", (x, y) => {
    // if (DEBUG) console.warn('(', x, ") \t Y = ", y)
    return Number(`${x}.${y}`);
}, "Le point est utilisé pour faire des chiffes à virgules");

const power = new ComputeLogic("^", (x, y) => {
    if (DEBUG) console.warn(x, "^", y, "=", x ** y)
    return x ** y
}, "Permet de faire une puisse à un nombre");

const logicPriorities: { [key: number]: ComputeLogic[] } = {
    0: [dot, square, parenthesis],
    1: [divide, multiply, power],
    2: [add, substract],
}

// 1 * 3 + 4 + 3 / 5
// const a = new AlgoElement(1, 3, ComputeLogic.multiply);
// const b = new AlgoElement(3, 5, ComputeLogic.divide)
// const c = new AlgoElement(a, 4, ComputeLogic.add);
// const d = new AlgoElement(c, b, ComputeLogic.add);

function matchingBetweenSeparator(separator: AlgoSeparator, isSimple = false) {
    if (typeof separator == "string")
        return isSimple ?
            new RegExp(`[${separator == '^' ? '\\^' : separator}]`, 'g')
            :
            new RegExp(`(\\d+|\\[index=\\d+\\])[${separator == '^' ? '\\^' : separator}](\\d+|\\[index=\\d+\\])`, "g");
    if (separator.start == "" && separator.end == "") return /\(([^()]*)\)/g;
    return new RegExp(`(${separator.start == '' ? '(\\()' : '(\\b' + separator.start + '\\b\\()'}(.*?)${separator.end == '' ? '' : ' (\\b' + separator.end + '\\b)'}(\\){1}))`, "g");
}

function testEntry(value: string) {
    let basicTypeStringRegex = Object.values(logicPriorities).flatMap(x => x).filter(x => typeof x.separator == "string")
        .map(x => x.separator).join("\\");
    let complexType = Object.values(logicPriorities).flatMap(x => x).filter(x => typeof x.separator != "string")
        .map(x => {
            if (typeof x.separator == "string") return;
            return Object.values(x.separator);
        }).flatMap(x => x).join("");
    if (new RegExp(`[^${basicTypeStringRegex}\\(\\) \\d${complexType}]`, "g").test(value)) throw new Error("Saisie incorrect");

    let opening = getMatchIndexes(value, '(').length;
    let closing = getMatchIndexes(value, ')').length;
    if (opening != closing) throw new Error("Saisie incorrect");
}

export function traductToAlgoElements(value: string, isChild = false, childNumber = 0, algoElements = []): AlgoElement {
    // if (isChild) console.log(`${"".padStart(childNumber, "\t")}Child(${childNumber}) to process : ${value}`)
    // else console.log(`to process : ${value}`)

    if (!isChild) testEntry(value)
    if (!isNaN(Number(value))) return new AlgoElement(Number(value), 0, parenthesis);

    const indexRegex = new RegExp(`\[index=\d\]`);
    /**Traiter ça comme un separateur avec des choses entres */

    let toProcessString = value.replaceAll(" ", "");
    let calculationOrder: Record<number, ComputeLogic[]> = {}
    let calculationString = toProcessString;

    for (const entries of Object.entries(logicPriorities)) {
        const logics = entries[1];
        const logicPrio = entries[0];

        for (const logic of logics) {
            if (logic == parenthesis) {
                while (matchingBetweenSeparator(logic.separator, true).exec(calculationString) !== null) {
                    const regexp = matchingBetweenSeparator(logic.separator, true);
                    const items = regexp.exec(calculationString);
                    if (!items || items.length == 0) continue;

                    let opening = getMatchIndexes(items[0], '(').length;
                    let closing = getMatchIndexes(items[0], ')').length;

                    const toReplace = items[0].padEnd(items[0].length + (opening - closing), ')')
                    const toProcess = toReplace.slice(1, -1);

                    // console.log(`${"".padStart(childNumber + 1, "\t")}New Child(${childNumber + 1})`)

                    const indexAlgo = algoElements.push(new AlgoElement(traductToAlgoElements(toProcess, true, childNumber + 1, algoElements), 0, logic)) - 1;
                    calculationString = calculationString.replace(toReplace, `[index=${indexAlgo}]`);
                    // if (isChild) console.log(`${"".padStart(childNumber + 1, "\t")}newString(${childNumber}) : ${calculationString}`);
                    // else console.log(`newString : ${calculationString}`);
                }
                continue;
            }


            const regexp = matchingBetweenSeparator(logic.separator, true);
            const potentialIndex = getMatchIndexes(calculationString, regexp);
            if (typeof logic.separator == "string") {
                potentialIndex.forEach(index => {
                    if (!calculationOrder[logicPrio]) calculationOrder[logicPrio] = [];
                    calculationOrder[logicPrio][index] = logic;
                });
            } else {
                potentialIndex.forEach(index => {
                    if (typeof logic.separator == "string") return;
                    const items = regexp.exec(calculationString);
                    if (items.length == 0) return;
                    let opening = getMatchIndexes(items[0], '(').length;
                    let closing = getMatchIndexes(items[0], ')').length;

                    let toReplace = items[0].padEnd(items[0].length + (opening - closing), ')')


                    let toProcess = ""
                    if (logic.separator.start != "") {
                        toProcess += toReplace.replace(logic.separator.start, '');
                        toProcess = toProcess.slice(1);
                    } else {
                        toProcess += toReplace.slice(1);
                    }
                    if (logic.separator.end != "") {
                        toProcess = toProcess.replace(new RegExp(logic.separator.end + '$'), 'finish');
                        toProcess = toProcess.slice(0, -1);
                    } else {
                        toProcess = toProcess.slice(0, -1);
                    }

                    // console.log(`${"".padStart(childNumber + 1, "\t")}New Child(${childNumber + 1})`)

                    const indexAlgo = algoElements.push(new AlgoElement(traductToAlgoElements(toProcess, true, childNumber + 1, algoElements), 0, logic)) - 1;
                    calculationString = calculationString.replace(toReplace, `[index=${indexAlgo}]`);
                    // if (isChild) console.log(`${"".padStart(childNumber + 1, "\t")}newString(${childNumber}) : ${calculationString}`);
                    // else console.log(`newString : ${calculationString}`);
                });
            }

        }

    }
    const calculationOrderArray = Object.values(calculationOrder).flatMap(x => x);

    for (const logic of calculationOrderArray) {
        const regex = matchingBetweenSeparator(logic.separator);
        const elementToProcess = regex.exec(calculationString)?.shift();
        if (!elementToProcess) throw new Error("Impossible d'avoir un objet à ne pas prendre.");

        /** Je dois faire un truc la mais quoi :') */
        if (typeof logic.separator != "string") return;
        const operationString = elementToProcess.split(logic.separator);

        const numOrAlgA: number | AlgoElement = operationString[1] && indexRegex.test(operationString[0]) ?
            algoElements[Number(operationString[0].replace("[index=", "").replace(']', ""))]
            :
            Number(operationString[0])

        const numOrAlgB: number | AlgoElement = operationString[1] && indexRegex.test(operationString[1]) ?
            algoElements[Number(operationString[1].replace("[index=", "").replace(']', ""))]
            :
            Number(operationString[1])

        const index = algoElements.push(new AlgoElement(numOrAlgA, numOrAlgB, logic)) - 1;
        calculationString = calculationString.replace(elementToProcess, `[index=${index}]`);
        // if (isChild) console.log(`${"".padStart(childNumber + 1, "\t")}stringUpdate : ${calculationString}`)
        // else console.log(`stringUpdate : ${calculationString}`)
    }
    if (algoElements.length == 0) throw new Error("Algo element vide");
    // if (isChild) console.log(`${"".padStart(childNumber, "\t")}EndChild(${childNumber})`)

    return algoElements.pop() as AlgoElement;
}