
async function previewUrl(){
    let url = document.getElementById("urlInput").value;

    let preview = "";

    try {
        const response = await fetch (`api/v1/urls/preview?url=${url}`);
        preview = await response.text();

    } catch (err) {
        preview = `Error fetching preview: ${err.message}`;
    }

    displayPreviews(preview)
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
