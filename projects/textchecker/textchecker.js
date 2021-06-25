window.onload = function() {
    console.log("Javascript working!");

    let buttonPalindrome = document.getElementById("button-palindrome");
    let outputDisplay = document.getElementById("output");

    buttonPalindrome.onclick = function() {palindromeFunc();}

    function palindromeFunc() {
        let string = document.getElementById("user-input").value;
        let reverse = string.split("").reverse().join("");
        outputDisplay.innerHTML = `"${string}" is ${reverse == string ? "" : "not "}a palindrome!`
    }
}