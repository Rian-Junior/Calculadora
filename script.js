// Referenciando os elementos do DOM
const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".buttons button");

// Variáveis globais
let currentNumber = "";
let firstOperand = null;
let operator = null;
let restart = false;

// Atualizar o visor
function updateResult(originClear = false) {
    result.innerText = originClear ? "0" : currentNumber.replace(".", ",");
}

// Adicionar dígito
function addDigit(digit) {
    if (digit === "," && (currentNumber.includes(",") || !currentNumber)) {
        return; // Impede múltiplas vírgulas ou iniciar com vírgula
    }

    if (restart) {
        currentNumber = digit === "," ? "0," : digit;
        restart = false;
    } else {
        currentNumber += digit;
    }

    updateResult();
}

// Definir operador
function setOperator(newOperator) {
    if (currentNumber) {
        if (operator) {
            calculate(); // Calcula operação anterior antes de definir novo operador
        } else {
            firstOperand = parseFloat(currentNumber.replace(",", "."));
        }
        currentNumber = "";
    }
    operator = newOperator;
    restart = false;
}

// Calcular resultado
function calculate() {
    if (operator === null || firstOperand === null || currentNumber === "") return;

    const secondOperand = parseFloat(currentNumber.replace(",", "."));
    let resultValue;

    switch (operator) {
        case "+":
            resultValue = firstOperand + secondOperand;
            break;
        case "-":
            resultValue = firstOperand - secondOperand;
            break;
        case "x":
            resultValue = firstOperand * secondOperand;
            break;
        case "/":
            resultValue = secondOperand === 0 ? "Erro" : firstOperand / secondOperand;
            break;
        default:
            return;
    }

    if (typeof resultValue === "number") {
        if (resultValue.toString().split(".")[1]?.length > 5) {
            resultValue = parseFloat(resultValue.toFixed(5)); // Limita a 5 casas decimais
        }
        currentNumber = resultValue.toString().replace(".", ",");
    } else {
        currentNumber = resultValue; // Caso de erro (como divisão por zero)
    }

    operator = null;
    firstOperand = null;
    restart = true;
    updateResult();
}

// Limpar calculadora
function clearCalculator() {
    currentNumber = "";
    firstOperand = null;
    operator = null;
    restart = false;
    updateResult(true);
}

// Adicionar eventos aos botões
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText = button.innerText;

        if (/^[0-9]+$/.test(buttonText)) {
            addDigit(buttonText);
        } else if (["+", "-", "x", "/"].includes(buttonText)) {
            setOperator(buttonText);
        } else if (buttonText === "=") {
            calculate();
        } else if (buttonText === "C") {
            clearCalculator();
        } else if (buttonText === "+-") {
            if (currentNumber) {
                currentNumber = (parseFloat(currentNumber.replace(",", ".")) * -1).toString().replace(".", ",");
                updateResult();
            }
        }
    });
});
