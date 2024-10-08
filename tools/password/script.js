document.addEventListener('DOMContentLoaded', () => {
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const generateButton = document.getElementById('generate');
    const passwordsDiv = document.getElementById('passwords');
    const toggleThemeButton = document.getElementById('toggleTheme');
    const symbolSettings = document.getElementById('symbolSettings');
    const symbolsCheckbox = document.getElementById('symbols');
    const customSymbolsInput = document.getElementById('customSymbols');

    // スライダーの値を表示
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    // 記号設定の表示/非表示
    symbolsCheckbox.addEventListener('change', () => {
        symbolSettings.classList.toggle('hidden', !symbolsCheckbox.checked);
    });

    // パスワード生成ボタンのクリックイベント
    generateButton.addEventListener('click', () => {
        const length = parseInt(lengthSlider.value);
        const includeUppercase = document.getElementById('uppercase').checked;
        const includeLowercase = document.getElementById('lowercase').checked;
        const includeNumbers = document.getElementById('numbers').checked;
        const includeSymbols = document.getElementById('symbols').checked;
        const customSymbols = customSymbolsInput.value;
        const passwordCount = parseInt(document.getElementById('count').value);

        passwordsDiv.innerHTML = '';

        for (let i = 0; i < passwordCount; i++) {
            const password = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, customSymbols);
            passwordsDiv.innerHTML += `<p>${password}</p>`;
        }
    });

    // パスワード生成関数
    function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, customSymbols) {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = customSymbols || '!@#$%^&*()';

        let characterSet = '';
        if (includeUppercase) characterSet += uppercaseChars;
        if (includeLowercase) characterSet += lowercaseChars;
        if (includeNumbers) characterSet += numberChars;
        if (includeSymbols) characterSet += symbolChars;

        // 文字セットが空の場合は空文字を返す
        if (characterSet.length === 0) return '';

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            password += characterSet[randomIndex];
        }
        return password;
    }

    // ダークモードの切り替え
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleThemeButton.textContent = document.body.classList.contains('dark-mode') ? 'ライトモード' : 'ダークモード';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // ページ読み込み時にテーマを復元
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'ライトモード';
    }
});
