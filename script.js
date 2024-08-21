function countWords() {
    var inputText = document.getElementById("input").value;
    var wordCount = inputText.trim().split(/\s+/).length;
    var charCount = inputText.length;
    document.getElementById("result").innerHTML = "Word count: " + wordCount + "<br>Character count: " + charCount;
}