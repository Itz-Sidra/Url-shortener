const API_URL = "http://localhost:3000/shorten";  // Update this when deployed
console.log("Script loaded successfully!");

document.getElementById("shortenBtn").addEventListener("click", shortenUrl);


async function shortenUrl() {
    console.log("Button clicked!");
    const longUrl = document.getElementById("longUrl").value;
    console.log("URL Entered:", longUrl);

    if (!longUrl) {
        alert("Please enter a valid URL");
        return;
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl })
    });

    const data = await response.json();

    if (data.short) {
        document.getElementById("shortenedUrl").innerHTML = 
            `Short URL: <a href="http://localhost:3000/${data.short}" target="_blank">${window.location.origin}/${data.short}</a>`;
    } else {
        document.getElementById("shortenedUrl").innerText = "Error shortening URL.";
    }
}
