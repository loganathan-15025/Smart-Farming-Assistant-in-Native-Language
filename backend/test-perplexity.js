import fetch from "node-fetch";

async function testPerplexity() {
  try {
    const response = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "Say hello in Tamil",
        model: "perplexity",
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test error:", error.message);
  }
}

testPerplexity();
