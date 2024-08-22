function countWords() {
    var inputText = document.getElementById("input").value.trim();

    if (inputText === '') {
        document.getElementById("result").innerHTML = "Please enter some text.";
        return;
    }

    var words = inputText.split(/\s+/).filter(word => word.length > 0);
    var wordCount = words.length;
    var charCount = inputText.replace(/\s/g, '').length;
    var avgWordLength = wordCount > 0 ? (charCount / wordCount).toFixed(2) : 0;

    var sentenceCount = (inputText.match(/[.!?]/g) || []).length;
    var longestWord = words.reduce((a, b) => a.length > b.length ? a : b, "");
    var shortestWord = words.reduce((a, b) => a.length < b.length ? a : b, "");

    var wordFrequency = {};
    words.forEach(word => {
        word = word.toLowerCase();
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    var sortedWordFrequency = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
    
    var frequencyDisplay = sortedWordFrequency.map(([word, count]) => {
        return `${word}: ${count}`;
    }).join("\n");

    var resultHtml = `
        Word count: ${wordCount}\n
        Character count (excluding spaces): ${charCount}\n
        Average word length: ${avgWordLength}\n
        Sentence count: ${sentenceCount}\n
        Longest word: ${longestWord}\n
        Shortest word: ${shortestWord}\n\n
        Word Frequency:\n${frequencyDisplay}
    `;

    document.getElementById("result").innerHTML = `
        <strong>Word count:</strong> ${wordCount}<br>
        <strong>Character count (excluding spaces):</strong> ${charCount}<br>
        <strong>Average word length:</strong> ${avgWordLength}<br>
        <strong>Sentence count:</strong> ${sentenceCount}<br>
        <strong>Longest word:</strong> ${longestWord}<br>
        <strong>Shortest word:</strong> ${shortestWord}<br><br>
        <strong>Word Frequency:</strong><br>${sortedWordFrequency.map(([word, count]) => `${word}: ${count}`).join("<br>")}
    `;

    localStorage.setItem('savedText', inputText);
    localStorage.setItem('savedResults', resultHtml);
}

document.getElementById("input").addEventListener("input", debounce(countWords, 500));
document.getElementById("countButton").addEventListener("click", countWords);
document.getElementById("clearButton").addEventListener("click", () => {
    document.getElementById("input").value = '';
    document.getElementById("result").innerHTML = '';
    localStorage.removeItem('savedText');
    localStorage.removeItem('savedResults');
});

document.getElementById("exportTextButton").addEventListener("click", () => {
    var blob = new Blob([document.getElementById("result").innerText], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'word_count_results.txt';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById("exportPdfButton").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    var doc = new jsPDF();
    var resultText = document.getElementById("result").innerText;
    doc.text(resultText, 10, 10);
    doc.save('word_count_results.pdf');
});

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
