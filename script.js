function countWords() {
    var inputText = document.getElementById("input").value;
    var wordCount = inputText.trim().split(/\s+/).length;
    document.getElementById("result").innerHTML = "Word count: " + wordCount;
}