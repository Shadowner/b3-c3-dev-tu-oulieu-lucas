"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComputeLogic_1 = require("./ComputeLogic");
describe("Test de la calculatrice", () => {
    describe("Test réalisé en BDD", () => {
        describe("Test de base", () => {
            it("Ajout x nombres entre eux", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2+5");
                expect(element.value).toStrictEqual(7);
            });
            it("Soustrait x nombres entre eux", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("6-8");
                expect(element.value).toStrictEqual(-2);
            });
            it("Ajoute et soustrait x nombres entre eux", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2-8+3-4+8-9+2-9");
                expect(element.value).toStrictEqual(2 - 8 + 3 - 4 + 8 - 9 + 2 - 9);
            });
            it("Ne divise pas par 0", () => {
                try {
                    (0, ComputeLogic_1.traductToAlgoElements)("1/0");
                }
                catch (error) {
                    expect(error).toStrictEqual(new Error("Non divisible par 0"));
                }
            });
            it("divise plusieur nombres", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("6/5/1/2/6/10");
                expect(element.value).toStrictEqual(6 / 5 / 1 / 2 / 6 / 10);
            });
            it("Multiplie X nombre entre eux", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2*5*6*9*8*7*4*59*6");
                expect(element.value).toStrictEqual(2 * 5 * 6 * 9 * 8 * 7 * 4 * 59 * 6);
            });
            it("Entrer incorrect", () => {
                try {
                    (0, ComputeLogic_1.traductToAlgoElements)("1(0qsd *x212");
                }
                catch (error) {
                    expect(error).toStrictEqual(new Error("Saisie incorrect"));
                }
            });
        });
        describe("Ordre de priorité", () => {
            it("Mutliplication prioritaire sur addition / soustraction (sans parenthèse)", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2+5-6+2-10");
                expect(element.value).toStrictEqual(2 + 5 - 6 + 2 - 10);
            });
            it("Mutliplication prioritaire sur addition / soustraction (avec parenthèse)", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2+(5-6)+2-(-10)");
                expect(element.value).toStrictEqual(2 + (5 - 6) + 2 - (-10));
            });
            it("Division prioritaire sur addition / soustraction (sans parenthèse)", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2+3/4");
                expect(element.value).toStrictEqual(2 + 3 / 4);
            });
            it("Division prioritaire sur addition / soustraction (avec parenthèse)", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2+3/(4+2)+6/1");
                expect(element.value).toStrictEqual(2 + 3 / (4 + 2) + 6 / 1);
            });
            it("Schéma complexe de priorité ", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2*(6+9/8*(4^(3*1/4))-20)");
                expect(element.value).toEqual(2 * (6 + 9 / 8 * (4 ** (3 * 1 / 4)) - 20));
            });
            it("Respect l'ordre de priorité entre multiplication et addition/soustraction", () => {
                const element = (0, ComputeLogic_1.traductToAlgoElements)("2+3*1+5*2-3");
                expect(element.value).toStrictEqual(2 + 3 * 1 + 5 * 2 - 3);
            });
        });
    });
    describe("Tests réalisé en TDD", () => {
        it("Faire une racine carrée", () => {
            const element = (0, ComputeLogic_1.traductToAlgoElements)("sqrt(50)");
            expect(element.value).toStrictEqual(Math.sqrt(50));
        });
        it("Racine carrée impossible avec un nombre négatif", () => {
            try {
                (0, ComputeLogic_1.traductToAlgoElements)("sqrt(-1)");
            }
            catch (error) {
                expect(error).toStrictEqual(new Error("Impossible de faire la racine d'une nombre négatif"));
            }
        });
        it("Respect de l'odre de priorité des fonctions", () => {
            const element = (0, ComputeLogic_1.traductToAlgoElements)("(sqrt(50)-(56+2*4)-2)/sqrt(20)");
            expect(element.value).toStrictEqual((Math.sqrt(50) - (56 + 2 * 4) - 2) / Math.sqrt(20));
        });
        it("Faire la puissance d'un nombre positif", () => {
            const element = (0, ComputeLogic_1.traductToAlgoElements)("2^5");
            expect(element.value).toStrictEqual(2 ** 5);
        });
        it("Faire la puissance d'un nombre negatif", () => {
            const element = (0, ComputeLogic_1.traductToAlgoElements)("(-5)^3");
            expect(element.value).toStrictEqual((-5) ** 3);
        });
        it("Faire une puissance avec un nombre négatif", () => {
            const element = (0, ComputeLogic_1.traductToAlgoElements)("3^(-2)");
            expect(element.value).toStrictEqual(3 ** (-2));
        });
        it("Schéma complexe", () => {
            const element = (0, ComputeLogic_1.traductToAlgoElements)("3^(sqrt(256))*5");
            expect(element.value).toStrictEqual(3 ** (Math.sqrt(256)) * 5);
        });
    });
});
//# sourceMappingURL=Compute.spec.js.map