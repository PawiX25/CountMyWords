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
    }).join("<br>");

    document.getElementById("result").innerHTML = `
        <strong>Word count:</strong> ${wordCount}<br>
        <strong>Character count (excluding spaces):</strong> ${charCount}<br>
        <strong>Average word length:</strong> ${avgWordLength}<br>
        <strong>Sentence count:</strong> ${sentenceCount}<br>
        <strong>Longest word:</strong> ${longestWord}<br>
        <strong>Shortest word:</strong> ${shortestWord}<br><br>
        <strong>Word Frequency:</strong><br>${frequencyDisplay}
    `;
}

document.getElementById("input").addEventListener("input", debounce(countWords, 500));
document.getElementById("countButton").addEventListener("click", countWords);

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
