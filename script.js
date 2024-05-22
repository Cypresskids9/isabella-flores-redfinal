const userInput = document.querySelector(".story-input");
const submitButton = document.querySelector(".submit");
const responseContainer = document.querySelector(".response-container");

let storyContext = "";
let continueButton;

submitButton.addEventListener("click", async () => {
    if (userInput.value != "") {
        submitButton.disabled = true;
        let inputText = userInput.value;
        let response = await getNextStoryResponse(inputText);
        storyContext += response;
        const story = document.createElement("p");
        story.classList.add("story-text");
        story.innerHTML = storyContext;
        responseContainer.appendChild(story);

        continueButton = document.createElement("button");
        continueButton.classList.add("continue");
        continueButton.innerHTML = "Continue";
        responseContainer.appendChild(continueButton);
        createContinue(); 
    }
});

const getNextStoryResponse = async (data) => {
    data = "Write me a story about " + data + ".";
    const response = await fetch(
        "https://api-inference.huggingface.co/models/google/gemma-1.1-7b-it",
        {
            headers: {
                Authorization: "Bearer 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",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ "inputs": data }),
        }
    );
    const result = await response.json();
    let generatedText = result[0].generated_text;
    generatedText = generatedText.replace(data, '').trim();
    return generatedText;
}



function createContinue() {
    continueButton.addEventListener('click', async () => {
        let continuedStory = await getNextStoryResponse(storyContext);
        storyContext = continuedStory; 
        const story = document.createElement("p");
        story.classList.add("story-text");
        story.innerHTML = continuedStory;
        responseContainer.appendChild(story);
        responseContainer.removeChild(continueButton); 

        continueButton = document.createElement("button");
        continueButton.classList.add("continue");
        continueButton.innerHTML = "Continue";
        responseContainer.appendChild(continueButton);
        createContinue()
    });
}