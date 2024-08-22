function countWords() {
    var inputText = document.getElementById("input").value.trim();

    if (inputText === '') {
        document.getElementById("result").innerHTML = "Please enter some text.";
        document.getElementById("chartContainer").style.display = 'none';
        return;
    }

    var words = inputText.split(/\s+/).filter(word => word.length > 0);
    var wordCount = words.length;
    var charCount = inputText.replace(/\s/g, '').length;
    var avgWordLength = wordCount > 0 ? (charCount / wordCount).toFixed(2) : 0;

    var sentenceCount = (inputText.match(/[.!?]/g) || []).length;
    var longestWord = words.reduce((a, b) => a.length > b.length ? a : b, "");
    var shortestWord = words.reduce((a, b) => a.length < b.length ? a : b, "");

    var avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(2) : 0;

    var wordFrequency = {};
    words.forEach(word => {
        word = word.toLowerCase();
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    var sortedWordFrequency = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);

    updateChart(sortedWordFrequency);

    var frequencyDisplay = sortedWordFrequency.map(([word, count]) => {
        return `${word}: ${count}`;
    }).join("<br>");

    var resultHtml = `
        <strong>Word count:</strong> ${wordCount}<br>
        <strong>Character count (excluding spaces):</strong> ${charCount}<br>
        <strong>Average word length:</strong> ${avgWordLength}<br>
        <strong>Sentence count:</strong> ${sentenceCount}<br>
        <strong>Average sentence length (words):</strong> ${avgSentenceLength}<br>
        <strong>Longest word:</strong> ${longestWord}<br>
        <strong>Shortest word:</strong> ${shortestWord}<br><br>
        <strong>Word Frequency:</strong><br>${frequencyDisplay}
    `;

    document.getElementById("result").innerHTML = resultHtml;
    document.getElementById("input").innerHTML = highlightedText;

    document.getElementById("chartContainer").style.display = 'block'; 

    localStorage.setItem('savedText', inputText);
    localStorage.setItem('savedResults', resultHtml);
}

function updateChart(wordFrequency) {
    var ctx = document.getElementById('wordFrequencyChart').getContext('2d');
    var labels = wordFrequency.map(([word]) => word);
    var data = wordFrequency.map(([, count]) => count);

    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Word Frequency',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById("input").addEventListener("input", debounce(countWords, 500));
document.getElementById("countButton").addEventListener("click", countWords);
document.getElementById("clearButton").addEventListener("click", () => {
    document.getElementById("input").value = '';
    document.getElementById("result").innerHTML = '';
    document.getElementById("chartContainer").style.display = 'none';
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
