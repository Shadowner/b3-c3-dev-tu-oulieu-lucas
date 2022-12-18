"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComputeLogic_1 = require("./Logic/ComputeLogic");
const prompt = require("prompt-sync")({ sigint: true });
let end = false;
let hasPromptedList = false;
do {
    if (!hasPromptedList)
        console.clear();
    const algo = prompt("Merci d'entrer votre équation ou 'liste' pour la liste des opérations possibles : ");
    if (algo == "")
        continue;
    if (algo == "liste") {
        hasPromptedList = true;
        let toShown = '';
        ComputeLogic_1.ComputeLogic.logics.forEach(logic => {
            if (!logic.description)
                return;
            if (typeof logic.separator == "string") {
                toShown += `\`${logic.separator}\`\t:\t${logic.description}\n`;
            }
            else {
                toShown += `\`${logic.separator.start}(...)${logic.separator.end}\`\t:\t${logic.description}\n`;
            }
        });
        toShown += "Pour faire des nombres négatifs, il suffit de les mettres entre parenthèses : '-10' -> '(-10)'";
        console.log(toShown);
    }
    else {
        if (hasPromptedList)
            hasPromptedList = false;
        console.clear();
        console.log("Calcule en cours.");
        try {
            const res = (0, ComputeLogic_1.traductToAlgoElements)(algo);
            console.log(`${algo} = ${res.value}`);
        }
        catch (error) {
            console.error(`Une erreur est survenue : ${error.message}`);
        }
        const answer = prompt("Souhaitez-vous entrer une nouvelle équation ?(Y/n)").toLowerCase();
        if (answer == "n")
            end = true;
    }
} while (!end);
console.log("Merci d'avoir utiliser ma calculatrice !");
//# sourceMappingURL=main.js.map