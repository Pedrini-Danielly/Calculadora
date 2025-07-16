 let display = '';
        let currentOperation = '';
        let previousValue = '';
        let operatorPressed = false;
        let isPlaceholder = true;

        const displayElement = document.getElementById('displayText');

        function updateDisplay() {
            if (display === '' && !currentOperation) {
                displayElement.textContent = 'Nelly-Calc';
                displayElement.className = 'display-text display-placeholder';
                displayElement.style.textAlign = 'center';
                isPlaceholder = true;
            } else {
                displayElement.textContent = display || '0';
                displayElement.className = 'display-text';
                displayElement.style.textAlign = 'right';
                isPlaceholder = false;
            }
        }

        function inputNumber(num) {
            if (isPlaceholder) {
                display = '';
                isPlaceholder = false;
            }
            
            if (operatorPressed) {
                display = '';
                operatorPressed = false;
            }
            
            if (num === '.' && display.includes('.')) return;
            
            display += num;
            updateDisplay();
        }

        function inputOperator(op) {
            if (isPlaceholder) return;
            
            if (currentOperation && display && !operatorPressed) {
                calculate();
            }
            
            previousValue = display;
            currentOperation = op;
            operatorPressed = true;
        }

        function calculate() {
            if (!currentOperation || !previousValue || !display) return;
            
            try {
                const prev = parseFloat(previousValue);
                const current = parseFloat(display);
                let result;
                
                switch (currentOperation) {
                    case '+':
                        result = prev + current;
                        break;
                    case '-':
                        result = prev - current;
                        break;
                    case '*':
                        result = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            throw new Error('Divisão por zero');
                        }
                        result = prev / current;
                        break;
                    default:
                        return;
                }
                
                display = result.toString();
                currentOperation = '';
                previousValue = '';
                operatorPressed = false;
                updateDisplay();
            } catch (error) {
                displayElement.textContent = 'Erro';
                displayElement.className = 'display-text error';
                setTimeout(() => {
                    clearAll();
                }, 2000);
            }
        }

        function clearAll() {
            display = '';
            currentOperation = '';
            previousValue = '';
            operatorPressed = false;
            isPlaceholder = true;
            updateDisplay();
        }

        function backspace() {
            if (isPlaceholder) return;
            
            if (display.length > 1) {
                display = display.slice(0, -1);
            } else {
                display = '';
            }
            updateDisplay();
        }

        function squareRoot() {
            if (isPlaceholder || !display) return;
            
            try {
                const num = parseFloat(display);
                if (num < 0) {
                    throw new Error('Raiz de número negativo');
                }
                display = Math.sqrt(num).toString();
                updateDisplay();
            } catch (error) {
                displayElement.textContent = 'Erro';
                displayElement.className = 'display-text error';
                setTimeout(() => {
                    clearAll();
                }, 2000);
            }
        }

        function invertSign() {
            if (isPlaceholder || !display) return;
            
            const num = parseFloat(display);
            display = (-num).toString();
            updateDisplay();
        }

        // Suporte para teclado
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Números
            if (key >= '0' && key <= '9') {
                inputNumber(key);
            }
            // Ponto decimal
            else if (key === '.' || key === ',') {
                inputNumber('.');
            }
            // Operadores
            else if (key === '+') {
                inputOperator('+');
            }
            else if (key === '-') {
                inputOperator('-');
            }
            else if (key === '*') {
                inputOperator('*');
            }
            else if (key === '/') {
                event.preventDefault();
                inputOperator('/');
            }
            // Enter para calcular
            else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            }
            // Backspace
            else if (key === 'Backspace') {
                backspace();
            }
            // Delete ou Escape para limpar
            else if (key === 'Delete' || key === 'Escape') {
                clearAll();
            }
        });

        // Inicializar display
        updateDisplay();