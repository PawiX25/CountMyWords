function countWords() {
    var inputText = document.getElementById("input").value;
    
    var words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    var wordCount = words.length;
    
    var charCount = inputText.replace(/\s/g, '').length;
    
    document.getElementById("result").innerHTML = "Word count: " + wordCount + "<br>Character count: " + charCount;
}

document.getElementById("input").addEventListener("input", countWords);