const categories = [
    {text: "TRIA.os", description: "You most likely know me from here, which is why this is the first and easiest section.", questions: [
        {
            text: "What is the only map I have fully created?",
            answers: ["EndZone", "Moonlight Cosmos", "Reaver", "The Sin"]
        },

        {
            text: "Which of these maps have I not helped on?",
            answers: ["Kneeling Shore", "Vacuus", "Vivid", "Mushroom Hills"]
        },
    ]},

    {text: "Silly questions", description: "I am bored okay :sob:", questions: [
        {
            text: "What's the color of Henry IV's white horse?",
            answers: ["Brown", "White", "Black", "Walmart bag"]
        },

        {
            text: "Mal de tête, mal de ventre...",
            answers: [
                "Le fantôme de la reine Elizabeth me hante",
                "C'est l'heure de la diarrhée foudroyante",
                "Dans 22 minutes, ce sera la fin des temps",
                "Après camper, les nordistes démontent leur tante",
            ]
        },
    ]}
]

const main = document.getElementById("main");

for (let category in categories) {
    const heading = document.createElement("h2");
    const description = document.createElement("h4");

    heading.innerHTML = categories[category].text;
    description.innerHTML = categories[category].description;

    main.appendChild(heading);
    main.appendChild(description);

    for (let question in categories[category].questions) {
        const questionDiv = document.createElement("div");
        const questionHeading = document.createElement("h3");
        const list = document.createElement("ul");

        questionHeading.innerHTML = categories[category].questions[question].text;
        questionDiv.className = "question";

        questionDiv.appendChild(questionHeading);
        questionDiv.appendChild(list);

        main.appendChild(questionDiv)

        for (let answer in categories[category].questions[question].answers) {
            const listItem = document.createElement("li")
            const checkbox = document.createElement("input");
            const answerText = document.createElement("span")

            checkbox.type = "checkbox";
            answerText.innerHTML = categories[category].questions[question].answers[answer]
            listItem.appendChild(checkbox)
            listItem.appendChild(answerText)
            list.appendChild(listItem)
        }
    }
}