// Convert Function (API based)
async function convert() {

    let amount = document.getElementById("amount").value;
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;

    let resultBox = document.getElementById("result");

    // Validation
    if (amount === "" || amount <= 0) {
        resultBox.className = "alert alert-danger text-center mt-2";
        resultBox.innerText = "Please enter valid amount!";
        return;
    }

    // Loading message
    resultBox.className = "alert alert-warning text-center mt-2";
    resultBox.innerText = "Converting...";

    try {
        // API Call
        let response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        let data = await response.json();

        let rate = data.rates[to];
        let result = amount * rate;

        // Show result
        resultBox.className = "alert alert-success text-center mt-2";
        resultBox.innerText = "Converted Amount: " + result.toFixed(2) + " " + to;

        // Show rate info
        document.getElementById("rateInfo").innerText =
            "1 " + from + " = " + rate + " " + to;

        // Save history
        saveHistory(amount, from, to, result);

    } catch (error) {
        resultBox.className = "alert alert-danger text-center mt-2";
        resultBox.innerText = "Error fetching data!";
    }
}


// Save History
function saveHistory(amount, from, to, result) {

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        amount: amount,
        from: from,
        to: to,
        result: result.toFixed(2),
        time: new Date().toLocaleTimeString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    displayHistory();
}


// Display History
function displayHistory() {

    let history = JSON.parse(localStorage.getItem("history")) || [];
    let div = document.getElementById("history");

    if (!div) return;

    div.innerHTML = "";

    history.slice(-5).reverse().forEach(item => {
        let p = document.createElement("p");
        p.innerText = `${item.amount} ${item.from} → ${item.result} ${item.to} (${item.time})`;
        div.appendChild(p);
    });
}


// Clear History
function clearHistory() {
    localStorage.removeItem("history");
    displayHistory();
}


// Load History on Page Load
document.addEventListener("DOMContentLoaded", displayHistory);
