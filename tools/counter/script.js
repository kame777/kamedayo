// ページが読み込まれたときにテーマを適用
window.onload = function() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.toggle('dark-mode', currentTheme === 'dark');
        document.querySelector('.container').classList.toggle('dark-mode', currentTheme === 'dark');
        document.querySelector('textarea').classList.toggle('dark-mode', currentTheme === 'dark');

        // ボタンのテキストを切り替え
        document.getElementById('toggleTheme').textContent = currentTheme === 'dark' ? 'ライトモード' : 'ダークモード';
    }
};

document.getElementById('textInput').addEventListener('input', function() {
    updateCounts();
});

document.getElementById('textInput').addEventListener('select', function() {
    updateSelectedCounts();
});

function updateCounts() {
    const text = document.getElementById('textInput').value;

    // 全体文字数
    const totalCharCount = text.length;

    // スペースと改行を除く文字数
    const nonSpaceCharCount = text.replace(/\s+/g, '').length;

    // 全角文字数
    const fullWidthCharCount = text.match(/[\u3000-\uFFEF]/g) ? text.match(/[\u3000-\uFFEF]/g).length : 0;

    // 半角文字数
    const halfWidthCharCount = totalCharCount - fullWidthCharCount;

    // 行数
    const lineCount = text.split('\n').length;

    // 各カウントを表示
    document.getElementById('totalCharCount').textContent = totalCharCount;
    document.getElementById('nonSpaceCharCount').textContent = nonSpaceCharCount;
    document.getElementById('fullWidthCharCount').textContent = fullWidthCharCount;
    document.getElementById('halfWidthCharCount').textContent = halfWidthCharCount;
    document.getElementById('lineCount').textContent = lineCount;
}

function updateSelectedCounts() {
    const textArea = document.getElementById('textInput');
    const selectedText = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);

    // 選択された文字数
    const selectedCharCount = selectedText.length;

    // 選択された行数
    const selectedLines = selectedText.split('\n').length;

    // 各カウントを表示
    document.getElementById('selectedCharCount').textContent = selectedCharCount;
    document.getElementById('selectedLineCount').textContent = selectedLines;
}

// ダークモードの切り替え
document.getElementById('toggleTheme').addEventListener('click', function() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.querySelector('textarea').classList.toggle('dark-mode');

    // テーマをlocalStorageに保存
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // ボタンのテキストを切り替え
    this.textContent = isDarkMode ? 'ライトモード' : 'ダークモード';
});

// クリアボタンのイベントリスナー
document.getElementById('clearText').addEventListener('click', function() {
    document.getElementById('textInput').value = ''; // テキストエリアをクリア
    updateCounts(); // カウントを更新
});