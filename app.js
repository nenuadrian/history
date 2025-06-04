// Wait for the DOM to be fully loaded
window.onload = function() {
    const STAGE_WIDTH = 600;
    const STAGE_HEIGHT = 800;

    // DOM Element References
    const uploadInput = document.getElementById('manuscript-upload');
    const uploadBtn = document.getElementById('upload-btn');
    const generatedImage = document.getElementById('generated-manuscript-image');
    const serverImageContainer = document.getElementById('server-image-container');
    const serverImagePlaceholderText = document.getElementById('server-image-placeholder-text');
    const generateBtn = document.getElementById('generate-btn');
    const konvaContainer = document.getElementById('manuscript-container');

    // Global variable to store the ID from uploads
    let currentStyleId = null;

    // Konva Stage Initialization (can be left for potential future use, but not drawn on by default)
    const stage = new Konva.Stage({
        container: 'manuscript-container',
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    // konvaContainer.style.display = 'none'; // Optionally hide Konva canvas initially

    // --- FILE UPLOAD LOGIC ---
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            if (!uploadInput.files || uploadInput.files.length === 0) {
                alert('Please select a file to upload.');
                return;
            }
            const file = uploadInput.files[0];
            const formData = new FormData();
            formData.append('manuscript_image', file);

            console.log('Initiating file upload...');
            serverImagePlaceholderText.textContent = 'Uploading style image...';
            generatedImage.style.display = 'none';
            serverImagePlaceholderText.style.display = 'block';


            fetch('/api/upload_manuscript', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    // Try to parse error message from server if available
                    return response.json().then(errData => {
                        throw new Error(errData.message || `Server error: ${response.status} ${response.statusText}`);
                    }).catch(() => {
                        // Fallback if error data is not JSON or no message field
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    });
                }
            })
            .then(data => {
                console.log('Upload successful:', data);
                alert(data.message || 'File uploaded successfully!');
                currentStyleId = data.upload_id; // Store the upload_id
                serverImagePlaceholderText.textContent = `Style ID ${currentStyleId} learned. Click "Generate Manuscript".`;

            })
            .catch(error => {
                console.error('Upload failed:', error);
                alert(`Upload failed: ${error.message}`);
                serverImagePlaceholderText.textContent = 'Upload failed. Please try again.';
            });
        });
    } else {
        console.error('Upload button not found!');
    }

    // --- SERVER-SIDE GENERATION REQUEST LOGIC ---
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            let url = '/api/generate_manuscript';
            if (currentStyleId) {
                url += `?style_id=${currentStyleId}`;
            }

            console.log(`Requesting manuscript from: ${url}`);
            serverImagePlaceholderText.textContent = 'Generating manuscript from server...';
            generatedImage.style.display = 'none';
            serverImagePlaceholderText.style.display = 'block';
            if(konvaContainer) konvaContainer.style.display = 'none'; // Hide Konva canvas


            fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                     return response.json().then(errData => {
                        throw new Error(errData.message || `Server error: ${response.status} ${response.statusText}`);
                    }).catch(() => {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    });
                }
            })
            .then(data => {
                if (data.status === "success" && data.generated_images && data.generated_images.length > 0) {
                    console.log('Generation successful:', data);
                    generatedImage.src = data.generated_images[0].image_url;
                    generatedImage.style.display = 'block';
                    serverImagePlaceholderText.style.display = 'none';
                    if(konvaContainer) konvaContainer.style.display = 'none'; // Ensure Konva is hidden
                } else if (data.status === "processing") {
                    console.log('Image generation is processing:', data);
                    alert(data.message || "Your image is being processed. Please try generating again shortly.");
                    serverImagePlaceholderText.textContent = data.message || "Image processing. Try again soon.";
                    // Could implement polling here if desired using data.job_id
                }
                else {
                    throw new Error(data.message || 'Received success status, but no image URL found or invalid data structure.');
                }
            })
            .catch(error => {
                console.error('Generation failed:', error);
                alert(`Generation failed: ${error.message}`);
                serverImagePlaceholderText.textContent = 'Generation failed. Please try again.';
                generatedImage.style.display = 'none';
                serverImagePlaceholderText.style.display = 'block';
            });
        });
    } else {
        console.error('Generate button not found!');
    }

    // Remove or comment out old Konva-based generateManuscript and its initial call
    /*
    const manuscriptTexts = [ ... ]; // Old text pool
    function generateManuscript() { ... } // Old Konva generation function
    setTimeout(() => {
        // generateManuscript(); // DO NOT CALL OLD FUNCTION
        console.log('Konva stage initialized. Client-side generation is disabled by default.');
    }, 100);
    */
    console.log('Client-side manuscript generation app initialized. Ready for server interaction.');
    serverImagePlaceholderText.textContent = 'Upload an image to define a style, or click "Generate Manuscript" for a default style.';

};
