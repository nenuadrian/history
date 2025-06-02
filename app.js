// Wait for the DOM to be fully loaded before initializing Konva
window.onload = function() {
    const STAGE_WIDTH = 600;
    const STAGE_HEIGHT = 800;

    // Konva Stage Initialization
    const stage = new Konva.Stage({
        container: 'manuscript-container', // ID of the div
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
    });

    // Create a layer
    const layer = new Konva.Layer();
    stage.add(layer);

    // 1. Text Snippet Pool
    const manuscriptTexts = [
        "Ars longa, vita brevis.",
        "Tempus fugit.",
        "In vino veritas.",
        "Fortuna favet fortibus.",
        "Sapere aude.",
        "Carpe diem, quam minimum credula postero.",
        "Veni, vidi, vici.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta?",
        "Philosophia est ars vitae.",
        "Acta, non verba.",
        "Amor vincit omnia."
    ];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateManuscript() {
        console.log('Generating manuscript...');
        layer.destroyChildren(); // Clear previous content

        // Background
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: '#F5DEB3', // A parchment-like color (Wheat)
        });
        layer.add(background);

        background.cache();
        background.filters([Konva.Filters.Noise]);
        background.noise(0.3);

        // Random Text Selection
        let selectedSnippets = [];
        const numberOfSnippets = getRandomInt(2, 4); // Pick 2 to 4 snippets
        for (let i = 0; i < numberOfSnippets; i++) {
            selectedSnippets.push(getRandomElement(manuscriptTexts));
        }
        // Ensure not too long, roughly limit characters
        let combinedText = selectedSnippets.join("\n\n");
        if (combinedText.length > 450) { // Approximate character limit
            combinedText = combinedText.substring(0, 450) + "...";
        }


        // Randomized Text Styling
        const randomFontSize = getRandomInt(20, 24); // e.g., between 20 and 24
        const randomLetterSpacingOptions = [0.5, 1, 1.5];
        const randomLetterSpacing = getRandomElement(randomLetterSpacingOptions);

        const textObject = new Konva.Text({
            x: 40,
            y: 60,
            text: combinedText,
            fontFamily: 'MedievalSharp',
            fontSize: randomFontSize,
            fill: '#3A2A1B', // Dark brown
            width: STAGE_WIDTH - 80,
            lineHeight: 1.6, // Adjusted for potentially varied font sizes
            letterSpacing: randomLetterSpacing,
        });
        layer.add(textObject);

        stage.batchDraw();
        console.log('Manuscript generated with random text and styles.');
    }

    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateManuscript);
    } else {
        console.error('Generate button not found!');
    }

    setTimeout(() => {
        generateManuscript();
        console.log('Konva stage and initial manuscript initialized.');
    }, 100);
};
