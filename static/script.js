// Update time every second
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('current-time').textContent = timeString;
}



// Call the function once immediately and then every second
updateTime();
setInterval(updateTime, 1000);



/*

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Animating the form appearance with fade-in effect
    const form = document.querySelector(".task-form");
    if (form) {
        form.style.opacity = 0;
        setTimeout(() => {
            form.style.transition = "opacity 0.5s ease-in-out";
            form.style.opacity = 1;
        }, 200);
    }

    // Styling input fields on focus
    const inputs = document.querySelectorAll(".styled-input");
    inputs.forEach(input => {
        input.addEventListener("focus", function () {
            this.style.borderColor = "#007bff";
            this.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)";
        });
        input.addEventListener("blur", function () {
            this.style.borderColor = "#ccc";
            this.style.boxShadow = "none";
        });
    });

    // File input label update
    const fileInput = document.getElementById("fileUpload");
    const fileLabel = document.getElementById("file-label");

    if (fileInput && fileLabel) {
        fileInput.addEventListener("change", function () {
            if (this.files.length > 0) {
                fileLabel.textContent = this.files[0].name;
            } else {
                fileLabel.textContent = "Choose a file";
            }
        });
    }

    // Character counter for description
    const descriptionInput = document.getElementById("description");
    const charCounter = document.getElementById("char-counter");

    if (descriptionInput && charCounter) {
        descriptionInput.addEventListener("input", function () {
            charCounter.textContent = `${this.value.length}/1000`;
        });
    }

    // Date input styling
    const dateInputs = document.querySelectorAll(".date-input");
    dateInputs.forEach(dateInput => {
        dateInput.addEventListener("focus", function () {
            this.type = "datetime-local";
        });
        dateInput.addEventListener("blur", function () {
            if (!this.value) this.type = "text";
        });
    });

    // Smooth scrolling to the task form
    const createTaskBtn = document.getElementById("create-task-btn");
    if (createTaskBtn) {
        createTaskBtn.addEventListener("click", function (e) {
            e.preventDefault();
            document.getElementById("task-form-section").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Add checklist item
    const addChecklistItemBtn = document.getElementById("addChecklistItem");
    if (addChecklistItemBtn) {
        addChecklistItemBtn.addEventListener("click", function () {
            const checklistDiv = document.getElementById("checklistItems");
            const newItem = document.createElement("div");
            newItem.innerHTML = `
                <input type="checkbox">
                <input type="text" name="checklist[]" placeholder="Checklist item">
            `;
            checklistDiv.appendChild(newItem);
        });
    }

    // Cancel task creation
    const cancelTaskBtn = document.getElementById("cancelTask");
    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener("click", function () {
            document.getElementById("taskFormContainer").style.display = "none";
        });
    }

    // Close task form
    const closeTaskFormBtn = document.getElementById("closeTaskForm");
    if (closeTaskFormBtn) {
        closeTaskFormBtn.addEventListener("click", function () {
            document.getElementById("taskFormContainer").style.display = "none";
        });
    }

    // Show task form (if you have a button to open the form)
    const openTaskFormBtn = document.getElementById("openTaskForm");
    if (openTaskFormBtn) {
        openTaskFormBtn.addEventListener("click", function () {
            document.getElementById("taskFormContainer").style.display = "flex";
        });
    }

    // Handle "Upload File" button click
    const uploadFileBtn = document.getElementById("uploadFile");
    const fileUploadInput = document.getElementById("fileUpload");

    if (uploadFileBtn) {
        uploadFileBtn.addEventListener("click", function () {
            // Trigger the file input click when the button is clicked
            fileUploadInput.click();
        });
    }

    // Show the selected file name after the user selects a file
    if (fileUploadInput) {
        fileUploadInput.addEventListener("change", function () {
            const fileName = this.files.length > 0 ? this.files[0].name : "No file selected";
            // Optionally, display the file name next to the upload button
            uploadFileBtn.textContent = `📂 ${fileName}`;
        });
    }

    // Handle "Create Document" button click
    const createDocumentBtn = document.getElementById("createDocument");

    if (createDocumentBtn) {
        createDocumentBtn.addEventListener("click", function () {
            const documentEditor = document.getElementById("documentEditor");
            const documentContent = document.getElementById("documentContent");

            // Toggle visibility: Hide the button and show the editor
            createDocumentBtn.style.display = "none"; 
            documentEditor.style.display = "block";  // Show the editor
            
            // Initialize TinyMCE editor
            tinymce.init({
                selector: '#documentEditor',
                setup: function(editor) {
                    editor.on('init', function() {
                        editor.setContent('<p>Start writing your document...</p>');
                    });
                },
                height: 400,
                plugins: 'advlist autolink lists link image charmap print preview anchor',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
            });

            // Sync TinyMCE content with textarea before form submission
            document.getElementById("create-task-form").addEventListener("submit", function () {
                documentContent.value = tinymce.get('documentEditor').getContent();
            });
        });
    }
});
*/
// Task form submission
/*let createTaskForm = document.getElementById("create-task-form");
if (createTaskForm) {
    createTaskForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let formData = new FormData(this);

        // Convert datetime-local format to Django's expected format
        let startTaskOn = document.getElementById("startTaskOn").value;
        if (startTaskOn) {
            formData.set("start_task_on", startTaskOn.replace("T", " ") + ":00"); // Append seconds
        }

        try {
            const response = await fetch("/createtask", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                }
            });

            const data = await response.json();

            if (data.id) {
                alert("Task Created Successfully!");
                window.location.href = "/";  // Redirect after success
            } else {
                alert("Error: " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the task.");
        }
    });
}











const fileBrowseButton = document.querySelector(".file-browse-button");
const fileBrowseInput = document.querySelector(".file-browse-input");
const fileList = document.querySelector(".file-list");
const fileCompletedStatus = document.querySelector(".file-completed-status");
let totalFiles = 0;
let completedFiles = 0;

// Function to handle file uploading via AJAX
const handleFileUploading = (file, formData) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload_task_files/", true);  // Adjust URL to your Django view
    xhr.upload.addEventListener("progress", (e) => {
        const fileProgress = document.querySelector(`#file-item-${file.name} .file-progress`);
        const progress = Math.round((e.loaded / e.total) * 100);
        fileProgress.style.width = `${progress}%`;
    });

    // Send the file to Django view using AJAX
    xhr.send(formData);

    xhr.onload = () => {
        if (xhr.status === 200) {
            completedFiles++;
            fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
        }
    };

    xhr.onerror = () => {
        alert("There was an error uploading the file.");
    };
}

// Function to handle selected files
const handleSelectedFiles = (files) => {
    console.log('files:', files); // Log the 'files' object
    if (files.length === 0) return;
    
    // Convert FileList to an array
    const filesArray = Array.from(files);
    console.log('filesArray:', filesArray); // Log the array after conversion
    
    totalFiles += filesArray.length;

    filesArray.forEach((file, index) => {
        const uniqueIdentifier = Date.now() + index;
        const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
        fileList.insertAdjacentHTML("afterbegin", fileItemHTML);
        const currentFileItem = document.querySelector(`#file-item-${uniqueIdentifier}`);
        const formData = new FormData(createTaskForm);
        formData.append("file", file);

        const cancelFileUploadButton = currentFileItem.querySelector(".cancel-button");
        const xhr = handleFileUploading(file, formData);
        
        cancelFileUploadButton.addEventListener("click", () => {
            xhr.abort();
            updateFileStatus("Cancelled", "#E3413F");
            cancelFileUploadButton.remove();
        });
    });
};

// Function to create the file item HTML
const createFileItemHTML = (file, uniqueIdentifier) => {
    const { name, size } = file;
    const extension = name.split(".").pop();
    const formattedFileSize = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / 1024).toFixed(2)} KB`;

    return `<li class="file-item" id="file-item-${uniqueIdentifier}">
                <div class="file-extension">${extension}</div>
                <div class="file-content-wrapper">
                    <div class="file-content">
                        <div class="file-details">
                            <h5 class="file-name">${name}</h5>
                            <div class="file-info">
                                <small class="file-size">0 MB / ${formattedFileSize}</small>
                                <small class="file-divider">•</small>
                                <small class="file-status">Uploading...</small>
                            </div>
                        </div>
                        <button class="cancel-button">
                            <i class="bx bx-x"></i>
                        </button>
                    </div>
                    <div class="file-progress-bar">
                        <div class="file-progress"></div>
                    </div>
                </div>
            </li>`;
}

// Event listeners for drag-and-drop and browse button
fileBrowseInput.addEventListener("change", (e) => handleSelectedFiles(e.target.files));
fileBrowseButton.addEventListener("click", () => fileBrowseInput.click());

// Handle form submission
createTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(createTaskForm);

    // Handle the AJAX form submission, including file upload and other fields
    fetch('/submit_task/', {  // Adjust URL to your Django view
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Task created successfully!");
        } else {
            alert("Failed to create task.");
        }
    })
    .catch(error => {
        alert("An error occurred while submitting the form.");
    });
});


fileBrowseInput.addEventListener("change", (e) => {
    console.log('Input change event triggered');
    handleSelectedFiles(e.target.files);
});*/

/*let createTaskForm = document.getElementById("create-task-form");

if (createTaskForm) {
    createTaskForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let formData = new FormData(this);

        // Convert datetime-local format to Django's expected format
        let startTaskOn = document.getElementById("startTaskOn").value;
        if (startTaskOn) {
            formData.set("start_task_on", startTaskOn.replace("T", " ") + ":00"); // Append seconds
        }

        // Prevent file input from being added multiple times if already uploaded via AJAX
        const files = document.querySelector(".file-browse-input").files;
        Array.from(files).forEach(file => {
            formData.append("file", file);  // Here, you can handle this via AJAX only.
        });

        // Handle the task creation and file upload asynchronously
        await handleTaskCreation(formData);
    });
}

// This is the async function that will handle the task creation
async function handleTaskCreation(formData) {
    try {
        const response = await fetch("/createtask", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
            }
        });

        const data = await response.json();

        if (data.id) {
            alert("Task Created Successfully!");
            window.location.href = "/";  // Redirect after success
        } else {
            alert("Error: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the task.");
    }
}

// Function to handle file uploading via AJAX
const handleFileUploading = (file, formData) => {
    // Create the list item for the file in the file list
    const fileList = document.querySelector('.file-list');
    const fileItem = document.createElement('li');
    fileItem.id = `file-item-${file.name}`;
    fileItem.innerHTML = `
        <span>${file.name}</span>
        <div class="file-progress-bar">
            <div class="file-progress" style="width: 0%"></div>
        </div>
    `;
    fileList.appendChild(fileItem);

    // Get the file progress element
    const fileProgress = fileItem.querySelector('.file-progress');

    // Initialize the XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/createtask", true);  // Use the same endpoint for creating the task

    // Update progress bar on progress event
    xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            fileProgress.style.width = `${progress}%`;  // Update the progress bar width
        }
    });

    // Send the file data to the Django server
    xhr.send(formData);

    // Handle success and error
    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(`File ${file.name} uploaded successfully.`);
        } else {
            console.error(`Error uploading file ${file.name}. Status: ${xhr.status}`);
        }
    };

    // Add a listener for the error event
    xhr.onerror = () => {
        console.error(`There was an error uploading the file ${file.name}.`);
    };

    return xhr;  // Return the xhr for cancellation purposes
};

// Add event listener to the file input
const fileInput = document.querySelector('.file-browse-input');
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        handleFileUploading(file, formData);  // Upload each file
    });
});

// Function to handle selected files
const handleSelectedFiles = (files) => {
    if (files.length === 0) return;

    // Convert FileList to an array
    const filesArray = Array.from(files);
    totalFiles += filesArray.length;

    filesArray.forEach((file, index) => {
        const uniqueIdentifier = Date.now() + index;
        const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
        fileList.insertAdjacentHTML("afterbegin", fileItemHTML);
        const currentFileItem = document.querySelector(`#file-item-${uniqueIdentifier}`);

        // Append file to the formData
        const formData = new FormData(createTaskForm);
        formData.append("file", file);

        // Handling the file upload progress
        const cancelFileUploadButton = currentFileItem.querySelector(".cancel-button");

        // You may choose to upload the files directly via AJAX
        const xhr = handleFileUploading(file, formData);

        cancelFileUploadButton.addEventListener("click", () => {
            xhr.abort();
            updateFileStatus("Cancelled", "#E3413F");
            cancelFileUploadButton.remove();
        });
    });
};

// Function to create the file item HTML
const createFileItemHTML = (file, uniqueIdentifier) => {
    const { name, size } = file;
    const extension = name.split(".").pop();
    const formattedFileSize = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / 1024).toFixed(2)} KB`;

    return `<li class="file-item" id="file-item-${uniqueIdentifier}">
                <div class="file-extension">${extension}</div>
                <div class="file-content-wrapper">
                    <div class="file-content">
                        <div class="file-details">
                            <h5 class="file-name">${name}</h5>
                            <div class="file-info">
                                <small class="file-size">0 MB / ${formattedFileSize}</small>
                                <small class="file-divider">•</small>
                                <small class="file-status">Uploading...</small>
                            </div>
                        </div>
                        <button class="cancel-button">
                            <i class="bx bx-x"></i>
                        </button>
                    </div>
                    <div class="file-progress-bar">
                        <div class="file-progress"></div>
                    </div>
                </div>
            </li>`;
};

// Event listeners for drag-and-drop and browse button
const fileBrowseInput = document.querySelector('.file-browse-input');
const fileBrowseButton = document.querySelector('.file-browse-button');
fileBrowseInput.addEventListener("change", (e) => handleSelectedFiles(e.target.files));
fileBrowseButton.addEventListener("click", () => fileBrowseInput.click());*/

// Define fileList
/*const fileList = document.querySelector('.file-list');
let createTaskForm = document.getElementById("create-task-form");
let totalFiles = 0; // Initialize file counter

if (createTaskForm) {
    createTaskForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        // Convert datetime-local format to Django's expected format
        let startTaskOn = document.getElementById("startTaskOn").value;
        if (startTaskOn) {
            formData.set("start_task_on", startTaskOn.replace("T", " ") + ":00"); // Append seconds
        }

        // Prevent file input from being added multiple times if already uploaded via AJAX
        const files = document.querySelector(".file-browse-input").files;
        Array.from(files).forEach(file => {
            formData.append("file", file);  // Handle files uploaded via AJAX
        });

        // Handle the task creation and file upload asynchronously
        await handleTaskCreation(formData);
    });
}

// This is the async function that will handle the task creation
async function handleTaskCreation(formData) {
    try {
        const response = await fetch("/createtask", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value                
            }            
        });

        const data = await response.json();

        if (data.id) {
            alert("Task Created Successfully!");
            window.location.href = "/";  // Redirect after success
        } else {
            alert("Error: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the task.");
    }
}

// Function to handle file uploading via AJAX
const handleFileUploading = (file, formData) => {
    // Create the list item for the file in the file list
    const fileList = document.querySelector('.file-list');
    const fileItem = document.createElement('li');
    fileItem.id = `file-item-${file.name}`;
    fileItem.innerHTML = `
        <span>${file.name}</span>
        <div class="file-progress-bar">
            <div class="file-progress" style="width: 0%"></div>
        </div>
        <button class="cancel-button"><i class="bx bx-x"></i></button>
    `;
    fileList.appendChild(fileItem);

    // Get the file progress element
    const fileProgress = fileItem.querySelector('.file-progress');

    // Initialize the XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/createtask", true);  // Use the same endpoint for creating the task

    // Update progress bar on progress event
    xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            fileProgress.style.width = `${progress}%`;  // Update the progress bar width
        }
    });

    // Send the file data to the Django server
    xhr.send(formData);

    // Handle success and error
    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(`File ${file.name} uploaded successfully.`);
            fileItem.querySelector('.file-status').textContent = "Upload Complete"; // Update status
        } else {
            console.error(`Error uploading file ${file.name}. Status: ${xhr.status}`);
            fileItem.querySelector('.file-status').textContent = "Error Uploading"; // Error status
        }
    };

    // Add a listener for the error event
    xhr.onerror = () => {
        console.error(`There was an error uploading the file ${file.name}.`);
        fileItem.querySelector('.file-status').textContent = "Upload Failed"; // Error status
    };

    return xhr;  // Return the xhr for cancellation purposes
};

// Add event listener to the file input
const fileInput = document.querySelector('.file-browse-input');
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        handleFileUploading(file, formData);  // Upload each file
    });
});

// Function to handle selected files
const handleSelectedFiles = (files) => {
    if (files.length === 0) return;

    // Convert FileList to an array
    const filesArray = Array.from(files);
    totalFiles += filesArray.length;

    filesArray.forEach((file, index) => {
        const uniqueIdentifier = Date.now() + index;
        const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
        fileList.insertAdjacentHTML("afterbegin", fileItemHTML);
        const currentFileItem = document.querySelector(`#file-item-${uniqueIdentifier}`);

        // Append file to the formData
        const formData = new FormData(createTaskForm);
        formData.append("file", file);

        // Handling the file upload progress
        const cancelFileUploadButton = currentFileItem.querySelector(".cancel-button");

        // You may choose to upload the files directly via AJAX
        const xhr = handleFileUploading(file, formData);

        cancelFileUploadButton.addEventListener("click", () => {
            xhr.abort();
            updateFileStatus("Cancelled", "#E3413F");
            cancelFileUploadButton.remove();
        });
    });
};

// Function to create the file item HTML
const createFileItemHTML = (file, uniqueIdentifier) => {
    const { name, size } = file;
    const extension = name.split(".").pop();
    const formattedFileSize = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / 1024).toFixed(2)} KB`;

    return `<li class="file-item" id="file-item-${uniqueIdentifier}">
    <div class="file-extension">${extension}</div>
    <div class="file-content-wrapper">
        <div class="file-content">
            <div class="file-details">
                <h5 class="file-name">${name}</h5>
                <div class="file-info">
                    <small class="file-size">0 MB / ${formattedFileSize}</small>
                    <small class="file-divider">•</small>
                    <small class="file-status">Uploading...</small> <!-- Ensure this element exists -->
                </div>
            </div>
            <button class="cancel-button">
                <i class="bx bx-x"></i>
            </button>
        </div>
        <div class="file-progress-bar">
            <div class="file-progress"></div>
        </div>
    </div>
</li>
`;
};

// Event listeners for drag-and-drop and browse button
const fileBrowseInput = document.querySelector('.file-browse-input');
const fileBrowseButton = document.querySelector('.file-browse-button');
fileBrowseInput.addEventListener("change", (e) => handleSelectedFiles(e.target.files));
fileBrowseButton.addEventListener("click", () => fileBrowseInput.click());

/*<li class="file-item" id="file-item-${uniqueIdentifier}">
                <div class="file-extension">${extension}</div>
                <div class="file-content-wrapper">
                    <div class="file-content">
                        <div class="file-details">
                            <h5 class="file-name">${name}</h5>
                            <div class="file-info">
                                <small class="file-size">0 MB / ${formattedFileSize}</small>
                                <small class="file-divider">•</small>
                                <small class="file-status">Uploading...</small>
                            </div>
                        </div>
                        <button class="cancel-button">
                            <i class="bx bx-x"></i>
                        </button>
                    </div>
                    <div class="file-progress-bar">
                        <div class="file-progress"></div>
                    </div>
                </div>
            </li>
*/
/*let createTaskForm = document.getElementById("create-task-form");
let totalFiles = 0; // Initialize file counter
const fileList = document.querySelector('.file-list'); // Ensure fileList is defined

// Store a reference of uploaded files to avoid duplication
const uploadedFiles = new Set();

if (createTaskForm) {
    createTaskForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        // Convert datetime-local format to Django's expected format
        let startTaskOn = document.getElementById("startTaskOn").value;
        if (startTaskOn) {
            formData.set("start_task_on", startTaskOn.replace("T", " ") + ":00"); // Append seconds
        }

        // Prevent file input from being added multiple times if already uploaded via AJAX
        const files = document.querySelector(".file-browse-input").files;
        Array.from(files).forEach(file => {
            formData.append("file", file);  // Handle files uploaded via AJAX
        });

        // Handle the task creation and file upload asynchronously
        await handleTaskCreation(formData);
    });
}

// Function to handle task creation
async function handleTaskCreation(formData) {
    try {
        const response = await fetch("/createtask", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
            }
        });

        const data = await response.json();

        if (data.id) {
            alert("Task Created Successfully!");
            window.location.href = "/";  // Redirect after success
        } else {
            alert("Error: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the task.");
    }
}

// Function to handle file uploading via AJAX
const handleFileUploading = (file, formData) => {
    // Prevent duplicate file uploads
    if (uploadedFiles.has(file.name)) {
        console.log(`File ${file.name} is already being uploaded.`);
        return;  // Prevent uploading the same file again
    }

    // Mark the file as being uploaded
    uploadedFiles.add(file.name);

    // Create the list item for the file in the file list
    const fileItem = document.createElement('li');
    fileItem.id = `file-item-${file.name}`;
    fileItem.innerHTML = `
        <span>${file.name}</span>
        <div class="file-progress-bar">
            <div class="file-progress" style="width: 0%"></div>
        </div>
        <small class="file-status">Uploading...</small> <!-- Ensure status exists -->
        <button class="cancel-button"><i class="bx bx-x"></i></button>
    `;
    fileList.appendChild(fileItem);

    // Get the file progress element
    const fileProgress = fileItem.querySelector('.file-progress');
    const cancelFileUploadButton = fileItem.querySelector(".cancel-button");

    // Initialize the XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/createtask", true);

    // Update progress bar on progress event
    xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            fileProgress.style.width = `${progress}%`;  // Update the progress bar width
        }
    });

    // Handle the response once the file is uploaded
    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(`File ${file.name} uploaded successfully.`);
            fileItem.querySelector('.file-status').textContent = "Upload Complete"; // Update status
        } else {
            console.error(`Error uploading file ${file.name}. Status: ${xhr.status}`);
            fileItem.querySelector('.file-status').textContent = "Error Uploading"; // Error status
        }
    };

    // Handle errors
    xhr.onerror = () => {
        console.error(`There was an error uploading the file ${file.name}.`);
        fileItem.querySelector('.file-status').textContent = "Upload Failed"; // Error status
    };

    // Cancel file upload
    cancelFileUploadButton.addEventListener("click", () => {
        xhr.abort(); // Abort the upload
        fileItem.querySelector('.file-status').textContent = "Cancelled"; // Set status to "Cancelled"
        cancelFileUploadButton.remove(); // Remove cancel button after abort
        uploadedFiles.delete(file.name); // Remove from the uploaded set to allow re-upload
    });

    xhr.send(formData);

    return xhr;  // Return the xhr for cancellation purposes
};

// Add event listener to the file input
const fileInput = document.querySelector('.file-browse-input');
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        handleFileUploading(file, formData);  // Upload each file
    });
});

// Function to create the file item HTML
const createFileItemHTML = (file, uniqueIdentifier) => {
    const { name, size } = file;
    const extension = name.split(".").pop();
    const formattedFileSize = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / 1024).toFixed(2)} KB`;

    return `<li class="file-item" id="file-item-${uniqueIdentifier}">
                <div class="file-extension">${extension}</div>
                <div class="file-content-wrapper">
                    <div class="file-content">
                        <div class="file-details">
                            <h5 class="file-name">${name}</h5>
                            <div class="file-info">
                                <small class="file-size">0 MB / ${formattedFileSize}</small>
                                <small class="file-divider">•</small>
                                <small class="file-status">Uploading...</small> <!-- Ensure this element exists -->
                            </div>
                        </div>
                        <button class="cancel-button">
                            <i class="bx bx-x"></i>
                        </button>
                    </div>
                    <div class="file-progress-bar">
                        <div class="file-progress"></div>
                    </div>
                </div>
            </li>`;
};

// Event listeners for drag-and-drop and browse button
const fileBrowseInput = document.querySelector('.file-browse-input');
const fileBrowseButton = document.querySelector('.file-browse-button');
fileBrowseInput.addEventListener("change", (e) => {
    const files = e.target.files;
    Array.from(files).forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        handleFileUploading(file, formData);  // Call the correct function
    });
});

fileBrowseButton.addEventListener("click", () => fileBrowseInput.click());*/
// Get the form, file input, file list container, and browse button elements
// Get the form, file input, file list container, and browse button elements









let createTaskForm = document.getElementById("create-task-form");
const fileInput = document.querySelector('.file-browse-input');
const fileList = document.querySelector('.file-list');
const fileBrowseButton = document.querySelector('.file-browse-button');

// Global array to store selected files
let selectedFiles = [];

// Listen for file selection changes and update the global array and UI
if (fileInput && fileList) {
    fileInput.addEventListener("change", (event) => {
        // Get newly selected files
        const newFiles = Array.from(fileInput.files);
        // Add each new file if it isn't already in the list (check by name and size)
        newFiles.forEach(file => {
            if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        });
        // Clear the file input value so that the same file can be selected again if needed
        fileInput.value = "";
        updateFileListUI();
    });
}

// Function to update the file list UI
function updateFileListUI() {
    // Clear the current list
    fileList.innerHTML = "";
    // Loop through all selected files and create a list item for each
    selectedFiles.forEach((file, index) => {
        const li = document.createElement("li");
        li.textContent = file.name;
        // Create a "Remove" button for each file
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", () => {
            // Remove the file from the array and update the UI
            selectedFiles.splice(index, 1);
            updateFileListUI();
        });
        li.appendChild(removeBtn);
        fileList.appendChild(li);
    });
}

// File browse button triggers the hidden file input click event
if (fileBrowseButton && fileInput) {
    fileBrowseButton.addEventListener("click", () => fileInput.click());
}

// Form submission event handler
if (createTaskForm) {
    createTaskForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        // Create FormData from the form (this includes non-file inputs)
        let formData = new FormData(this);

        // Convert datetime-local format to Django's expected format if needed
        let startTaskOn = document.getElementById("startTaskOn").value;
        if (startTaskOn) {
            formData.set("start_task_on", startTaskOn.replace("T", " ") + ":00");
        }

        // Append the selected files from our global array
        selectedFiles.forEach(file => {
            formData.append("file", file);
        });

        // Handle the task creation (including file uploads) via fetch
        await handleTaskCreation(formData);
    });
}

// Function to handle task creation via fetch (remains unchanged)
async function handleTaskCreation(formData) {
    try {
        const response = await fetch("/createtask", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
            }
        });

        const data = await response.json();

        if (data.id) {
            alert("Task Created Successfully!");
            window.location.href = "/";  // Redirect on success
        } else {
            alert("Error: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the task.");
    }
}




/*
let fileInput = document.querySelector('.file-browse-input');
let fileList = document.querySelector('.file-list');
let fileBrowseButton = document.querySelector('.file-browse-button');

// Global array to store selected files
let selectedFiles = [];

// Listen for file selection changes and update the global array and UI
if (fileInput && fileList) {
    fileInput.addEventListener("change", (event) => {
        const newFiles = Array.from(fileInput.files);
        newFiles.forEach(file => {
            if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        });
        fileInput.value = "";
        updateFileListUI();
    });
}

// Function to update the file list UI
function updateFileListUI() {
    fileList.innerHTML = "";
    selectedFiles.forEach((file, index) => {
        const li = document.createElement("li");
        li.textContent = file.name;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", () => {
            selectedFiles.splice(index, 1);
            updateFileListUI();
        });
        li.appendChild(removeBtn);
        fileList.appendChild(li);
    });
}

// File browse button triggers the hidden file input click event
if (fileBrowseButton && fileInput) {
    fileBrowseButton.addEventListener("click", () => fileInput.click());
}

// ---------- Form Submission Handlers ---------- //
document.addEventListener("DOMContentLoaded", function() {
  // Handler for the normal create task form
  const normalForm = document.getElementById("normal-task-form");
  if (normalForm) {
    normalForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      let formData = new FormData(this);
      
      // Convert datetime-local format if needed
      const startTaskOnElem = document.getElementById("startTaskOn");
      if (startTaskOnElem && startTaskOnElem.value) {
          formData.set("start_task_on", startTaskOnElem.value.replace("T", " ") + ":00");
      }
      
      // Append selected files from the global array
      selectedFiles.forEach(file => {
          formData.append("file", file);
      });
      
      await handleTaskCreation(formData);
    });
  }
  
  // Handler for the editor create task form
  const editorForm = document.getElementById("editor-task-form");
  if (editorForm) {
    // Ensure that the editor content is saved in sessionStorage when changed
    const textInput = document.getElementById("text-input");
    if (textInput) {
      textInput.addEventListener("input", function() {
        sessionStorage.setItem("editorContent", textInput.innerHTML);
      });
    }
    
    // On page load, update the hidden field with content from sessionStorage.
    const docField = document.getElementById("document_content");
    if (docField) {
      docField.value = sessionStorage.getItem("editorContent") || "";
    }
    
    editorForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      // Update hidden field with the latest editor content
      if (docField) {
        docField.value = sessionStorage.getItem("editorContent") || "";
      }
      
      let formData = new FormData(this);
      
      const startTaskOnElem = document.getElementById("startTaskOn");
      if (startTaskOnElem && startTaskOnElem.value) {
          formData.set("start_task_on", startTaskOnElem.value.replace("T", " ") + ":00");
      }
      
      // Append selected files from global array if any
      selectedFiles.forEach(file => {
          formData.append("file", file);
      });
      
      await handleTaskCreation(formData);
    });
  }
});

// Function to handle task creation via fetch
async function handleTaskCreation(formData) {
    try {
        const response = await fetch("/createtask", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
            }
        });
        const data = await response.json();
        if (data.id) {
            alert("Task Created Successfully!");
            window.location.href = "/";  // Redirect on success
        } else {
            alert("Error: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the task.");
    }
}

/* Code for displaying tasks, modals, toggling task completion, etc., remains unchanged. */


// Other code for modals, task details, and toggling task completion remains unchanged.*/









/* Code for displaying tasks, modals, and toggling task completion remains unchanged */


/* Existing code for displaying created tasks remains unchanged */

// Function to open the modal and display task details

/*
function viewTask(event) {
    const taskId = event.target.getAttribute('data-task-id');
    console.log("Viewing task with ID:", taskId);

    fetch(`/task/${taskId}/details/`)
        .then(response => response.json())
        .then(data => {
            const task = data.task;
            console.log('Fetched task details:', task);

            document.getElementById("modalTaskName").innerText = task.name;

            let taskDetails = `
                <p><strong>Description:</strong> ${task.description}</p>
                <p><strong>Assignee:</strong> ${task.assignee || 'Unassigned'}</p>
                <p><strong>Start Date:</strong> ${task.start_task_on}</p>
                <p><strong>Finish Date:</strong> ${task.finish_date}</p>
                <p><strong>Tags:</strong> ${task.tags.join(', ')}</p>
            `;
            document.getElementById("taskDetails").innerHTML = taskDetails;

            let filesHTML = '';
            if (task.files && task.files.length > 0) {
                filesHTML += '<ul>';
                task.files.forEach(file => {
                    filesHTML += `<li><a href="${file.url}" target="_blank">${file.name}</a>`;
                    if (file.url.endsWith('.jpg') || file.url.endsWith('.png')) {
                        filesHTML += `<img class="file-preview" src="${file.url}" alt="Image Preview">`;
                    } else if (file.url.endsWith('.pdf')) {
                        filesHTML += `<iframe class="file-preview" src="${file.url}" width="200" height="200"></iframe>`;
                    } else {
                        filesHTML += `<p>Preview unavailable. <a href="${file.url}" target="_blank">Download</a></p>`;
                    }
                    filesHTML += '</li>';
                });
                filesHTML += '</ul>';
            } else {
                filesHTML = '<p>No files uploaded for this task.</p>';
            }

            document.getElementById("taskDetails").innerHTML += filesHTML;

            document.getElementById("taskModal").style.display = "block";
        })
        .catch(error => console.error('Error:', error));
}

// Function to close the modal
function closeModal() {
    document.getElementById("taskModal").style.display = "none";
}

// Function to toggle task completion status
function toggleTaskCompletion(event) {
    const taskId = event.target.getAttribute('data-task-id');
    const isChecked = event.target.checked;
    
    console.log("Task ID:", taskId, "Marked as completed:", isChecked);

    fetch(`/task/${taskId}/complete/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector("[name=csrfmiddlewaretoken]").value
        },
        body: JSON.stringify({ completed: isChecked })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task completion status updated:', data);
    })
    .catch(error => console.error('Error updating task completion status:', error));
}

*/














































/*This is  for logout
document.addEventListener("DOMContentLoaded", function() {
    var accountMenu = document.getElementById('account-menu');
    var dropdown = document.getElementById('account-dropdown');
    
    // Toggle the dropdown visibility on account div click
    accountMenu.addEventListener('click', function(event) {
        // Prevent event from propagating if needed
        event.stopPropagation();
        if (dropdown.style.display === 'none' || dropdown.style.display === '') {
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });
    
    // Optional: Hide the dropdown if the user clicks outside of the account area
    document.addEventListener('click', function(event) {
        if (!accountMenu.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
});*/

// script.js

// script.js

// This function applies text formatting (bold, italic, underline)
/*function formatText(command) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
  
    if (!selectedText) {
      alert("Please select some text first.");
      return;
    }
  
    const span = document.createElement('span');
    span.style.fontWeight = command === 'bold' ? 'bold' : 'normal';
    span.style.fontStyle = command === 'italic' ? 'italic' : 'normal';
    span.style.textDecoration = command === 'underline' ? 'underline' : 'none';
    
    range.deleteContents();
    range.insertNode(span);
    span.appendChild(document.createTextNode(selectedText));
}

  
function addLink() {
    const url = prompt("Enter the URL:", "http://");
    if (url) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.textContent = selection.toString();
      
      range.deleteContents();
      range.insertNode(link);
    }
}
  
function insertImage() {
    const url = prompt("Enter image URL:", "");
    if (url) {
      const img = document.createElement('img');
      img.setAttribute('src', url);
      img.setAttribute('alt', 'Inserted Image');
      img.style.maxWidth = "100%";
      
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
    }
}

  
function saveContent() {
    const content = document.getElementById("editor").innerHTML;
    console.log(content);  // You can send this to a server or store it
}


// script.js

// Insert image into the editor from the user's computer
function uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.setAttribute('src', e.target.result); // Set the uploaded image as the source
      img.style.maxWidth = "100%"; // Optional styling
      img.style.margin = "10px 0";
  
      // Insert the image at the current cursor position
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
    };
  
    if (file) {
      reader.readAsDataURL(file); // Read the image file as a Data URL
    }
  }


  function saveContentAsWord() {
    const content = document.getElementById('editor').innerHTML;
  
    const header = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<w:wordDocument xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:body>';
  
    const footer = '</w:body></w:wordDocument>';
  
    const blob = new Blob([header + content + footer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content.docx';
    link.click();
  }
*/




  /*Status bar using checklist*/
// Global array to hold checklist items
// Get references to the checklist container, hidden input, and buttons/input
const checklistContainer = document.getElementById("checklistItems");
const checklistInput = document.getElementById("checklistInput");
const showChecklistInputButton = document.getElementById("showChecklistInput");
const newChecklistItemContainer = document.getElementById("newChecklistItemContainer");
const newChecklistItemInput = document.getElementById("newChecklistItem");
const saveChecklistItemButton = document.getElementById("saveChecklistItem");

// Global array to store checklist items
let checklistData = [];

// Function to update the checklist UI and the hidden input value
function updateChecklistUI() {
  // Clear the current checklist display
  checklistContainer.innerHTML = "";
  
  // Loop through the checklistData array and create elements for each item
  checklistData.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "checklist-item-display";
    itemDiv.style.display = "flex";
    itemDiv.style.alignItems = "center";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.marginBottom = "0.5rem";

    // Element to show the checklist item text
    const itemText = document.createElement("span");
    itemText.textContent = item;

    // Create a remove button for this checklist item
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-checklist-btn";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.padding = "0.3rem 0.6rem";
    removeBtn.style.backgroundColor = "#dc3545";
    removeBtn.style.color = "#fff";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "4px";
    removeBtn.style.cursor = "pointer";
    removeBtn.addEventListener("click", () => {
      // Remove the item from the array and update the UI
      checklistData.splice(index, 1);
      updateChecklistUI();
    });

    itemDiv.appendChild(itemText);
    itemDiv.appendChild(removeBtn);
    checklistContainer.appendChild(itemDiv);
  });
  
  // Update the hidden input field with the JSON string of checklist data
  checklistInput.value = JSON.stringify(checklistData);
}

// When the "Add Checklist Item" button is clicked, show the inline input field
showChecklistInputButton.addEventListener("click", () => {
  newChecklistItemContainer.style.display = "block";
  newChecklistItemInput.focus();
});

// When the "Add" button is clicked, add the new checklist item and hide the input field
saveChecklistItemButton.addEventListener("click", () => {
  const newItem = newChecklistItemInput.value.trim();
  if (newItem !== "") {
    checklistData.push(newItem);
    updateChecklistUI();
    newChecklistItemInput.value = "";
  }
  newChecklistItemContainer.style.display = "none";
});

// Allow pressing Enter to add the checklist item
newChecklistItemInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    saveChecklistItemButton.click();
  }
});














  /*Rich Text Editor*/
  let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

//List of fontlist
let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

//Initial Settings
const initializer = () => {
  //function calls for highlighting buttons
  //No highlights for link, unlink,lists, undo,redo since they are one time operations
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  //create options for font names
  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  //fontSize allows only till 7
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  //default size
  fontSizeRef.value = 3;
};

//main logic
const modifyText = (command, defaultUi, value) => {
  //execCommand executes command on selected text
  document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value parameter
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

//options that require value parameter (e.g colors, fonts)
advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

//link
linkButton.addEventListener("click", () => {
  let userLink = prompt("Enter a URL");
  //if link has http then pass directly else add https
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = "http://" + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      //needsRemoval = true means only one button should be highlight and other would be normal
      if (needsRemoval) {
        let alreadyActive = false;

        //If currently clicked button is already active
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }

        //Remove highlight from other buttons
        highlighterRemover(className);
        if (!alreadyActive) {
          //highlight clicked button
          button.classList.add("active");
        }
      } else {
        //if other buttons can be highlighted
        button.classList.toggle("active");
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

window.onload = initializer();








/*


document.addEventListener("DOMContentLoaded", function() {
    // Request notification permission if not already granted.
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
    
    // Function to fetch notifications as JSON.
    async function fetchNotifications() {
        try {
            const response = await fetch("{% url 'get_notifications' %}", {
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                }
            });
            const data = await response.json();
            return data.notifications;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    }
    
    // Function to display a browser notification.
    function showBrowserNotification(title, body, url) {
        if (Notification.permission === "granted") {
            const options = { body: body };
            const notif = new Notification(title, options);
            notif.onclick = function(event) {
                event.preventDefault();
                window.open(url, '_blank');
            };
        }
    }
    
    // Function to process notifications and display them.
    async function processNotifications() {
        const notifs = await fetchNotifications();
        notifs.forEach(notif => {
            const url = `/task/${notif.task_id}/`;
            showBrowserNotification(notif.title, notif.body, url);
        });
    }
    
    // Poll for notifications every minute.
    setInterval(processNotifications, 60000);
    
    // Optionally, run on page load:
    processNotifications();
});

*/






function markAsCompleted(taskId, button) {
    console.log(taskId);
    location.reload();

    fetch(`/task/${taskId}/complete/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Success");
        }
    })
    .catch(error => console.error("Error marking task as completed:", error));
}







































/*


document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        const container = document.getElementById('whiteboard-container');
        canvas.width = container.clientWidth - 40;
        canvas.height = container.clientHeight - 100;
        redrawCanvas();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Drawing state
    let isDrawing = false;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let startX, startY;
    let elements = initialData.elements || [];
    
    // Tools selection
    document.getElementById('pencil').addEventListener('click', () => currentTool = 'pencil');
    document.getElementById('rectangle').addEventListener('click', () => currentTool = 'rectangle');
    document.getElementById('line').addEventListener('click', () => currentTool = 'line');
    document.getElementById('text').addEventListener('click', () => currentTool = 'text');
    document.getElementById('color-picker').addEventListener('input', (e) => currentColor = e.target.value);
    
    // Clear button
    document.getElementById('clear').addEventListener('click', () => {
        if (confirm('Clear the entire whiteboard?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            elements = [];
            sendClearToServer();
        }
    });
    
    // Save button
    document.getElementById('save')?.addEventListener('click', () => {
        saveToServer();
    });
    
    // WebSocket connection
    const roomName = '{{ room_name }}';
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(
        `${wsProtocol}//${window.location.host}/ws/whiteboard/${roomName}/`
    );
    
    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        
        if (data.action === 'draw') {
            elements = data.elements;
            redrawCanvas();
        } else if (data.action === 'clear') {
            elements = [];
            redrawCanvas();
        }
    };
    
    // Drawing functions
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
        
        if (currentTool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                const newElement = {
                    type: 'text',
                    x: startX,
                    y: startY,
                    text: text,
                    color: currentColor
                };
                elements.push(newElement);
                redrawCanvas();
                sendToServer();
            }
            isDrawing = false;
        } else {
            // Create a temporary element for the current drawing
            elements.push({
                type: currentTool,
                startX: startX,
                startY: startY,
                endX: startX,
                endY: startY,
                color: currentColor
            });
        }
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        // Update the last element (the one being drawn)
        const currentElement = elements[elements.length - 1];
        currentElement.endX = e.offsetX;
        currentElement.endY = e.offsetY;
        
        redrawCanvas();
    }
    
    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        
        // Only send to server when drawing is complete
        sendToServer();
    }
    
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        elements.forEach(element => {
            ctx.strokeStyle = element.color;
            ctx.fillStyle = element.color;
            ctx.lineWidth = 2;
            
            switch(element.type) {
                case 'pencil':
                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(element.startX, element.startY);
                    ctx.lineTo(element.endX, element.endY);
                    ctx.stroke();
                    break;
                    
                case 'rectangle':
                    const width = element.endX - element.startX;
                    const height = element.endY - element.startY;
                    ctx.strokeRect(element.startX, element.startY, width, height);
                    break;
                    
                case 'text':
                    ctx.font = '16px Arial';
                    ctx.fillText(element.text, element.x, element.y);
                    break;
            }
        });
    }
    
    function sendToServer() {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'draw',
                elements: elements
            }));
        }
    }
    
    function sendClearToServer() {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'clear'
            }));
        }
    }
    
    function saveToServer() {
        fetch(`/whiteboard/{{ room_name }}/save/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({elements: elements})
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Whiteboard saved successfully!');
            }
        });
    }
    
    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});




*/





document.addEventListener('DOMContentLoaded', function() {
    // Initialize whiteboard canvas if on a whiteboard page
    const canvas = document.getElementById('whiteboard-canvas');
    if (canvas) {
        initializeWhiteboard(canvas);
    }

    // Set up all form confirmations
    setupFormConfirmations();

    // Initialize share modal functionality
    setupShareModal();

    // Set up alert system
    setupAlertSystem();
});

/* Whiteboard Canvas Functionality */
function initializeWhiteboard(canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let startX, startY;
    let elements = typeof initialData !== 'undefined' ? initialData.elements || [] : [];

    // Set initial canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
    }

    // Tool selection handler
    function setActiveTool(toolId) {
        document.querySelectorAll('.toolbar .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(toolId)?.classList.add('active');
    }

    // Redraw all elements on canvas
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        elements.forEach(element => {
            ctx.strokeStyle = element.color;
            ctx.fillStyle = element.color;
            ctx.lineWidth = 2;
            
            switch(element.type) {
                case 'pencil':
                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(element.startX, element.startY);
                    ctx.lineTo(element.endX, element.endY);
                    ctx.stroke();
                    break;
                    
                case 'rectangle':
                    const width = element.endX - element.startX;
                    const height = element.endY - element.startY;
                    ctx.strokeRect(element.startX, element.startY, width, height);
                    break;
                    
                case 'text':
                    ctx.font = '16px Arial';
                    ctx.fillText(element.text, element.x, element.y);
                    break;
            }
        });
    }

    // Drawing event handlers
    function startDrawing(e) {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
        
        if (currentTool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                elements.push({
                    type: 'text',
                    x: startX,
                    y: startY,
                    text: text,
                    color: currentColor
                });
                redrawCanvas();
            }
            isDrawing = false;
        } else {
            elements.push({
                type: currentTool,
                startX: startX,
                startY: startY,
                endX: startX,
                endY: startY,
                color: currentColor
            });
        }
    }

    function draw(e) {
        if (!isDrawing) return;
        const currentElement = elements[elements.length - 1];
        currentElement.endX = e.offsetX;
        currentElement.endY = e.offsetY;
        redrawCanvas();
    }

    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
    }

    // Save to server
    function saveToServer() {
        if (typeof saveUrl === 'undefined') return;
        
        fetch(saveUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({elements: elements})
        })
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                showAlert('Whiteboard saved successfully!', 'success');
            } else {
                throw new Error(data.message || 'Save failed');
            }
        })
        .catch(error => {
            showAlert(error.message, 'danger');
        });
    }

    // Set up event listeners
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Tool selection
    document.getElementById('pencil')?.addEventListener('click', () => {
        currentTool = 'pencil';
        setActiveTool('pencil');
    });
    document.getElementById('rectangle')?.addEventListener('click', () => {
        currentTool = 'rectangle';
        setActiveTool('rectangle');
    });
    document.getElementById('line')?.addEventListener('click', () => {
        currentTool = 'line';
        setActiveTool('line');
    });
    document.getElementById('text')?.addEventListener('click', () => {
        currentTool = 'text';
        setActiveTool('text');
    });
    
    // Color picker
    document.getElementById('color-picker')?.addEventListener('input', (e) => {
        currentColor = e.target.value;
    });
    
    // Clear button
    document.getElementById('clear')?.addEventListener('click', () => {
        if (confirm('Clear the entire whiteboard?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            elements = [];
        }
    });
    
    // Save button
    document.getElementById('save')?.addEventListener('click', saveToServer);

    // Drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}

/* Form Confirmation Handlers */
function setupFormConfirmations() {
    // Delete confirmation
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Are you sure you want to delete this whiteboard?')) {
                e.preventDefault();
            }
        });
    });

    // Remove shared confirmation
    document.querySelectorAll('.remove-shared-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Remove this whiteboard from your shared list?')) {
                e.preventDefault();
            }
        });
    });
}

/* Share Modal Functionality */
function setupShareModal() {
    const shareModal = document.getElementById('shareModal');
    if (!shareModal) return;

    // When modal opens
    shareModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const whiteboardId = button.getAttribute('data-id');
        const form = document.getElementById('shareForm');
        
        // Update form action and hidden field
        form.action = `/whiteboard/${whiteboardId}/share/`;
        document.getElementById('shareWhiteboardId').value = whiteboardId;
        
        // Clear any previous messages
        const alert = form.querySelector('.alert');
        if (alert) alert.remove();
    });

    // Form submission
    const shareForm = document.getElementById('shareForm');
    if (shareForm) {
        shareForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sharing...';
            
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    }
                });

                const data = await response.json();
                
                if (data.status === 'success') {
                    showAlert(data.message, 'success');
                    
                    // Close modal after delay
                    setTimeout(() => {
                        $('#shareModal').modal('hide');
                    }, 1500);
                    
                    // Reset form
                    this.reset();
                } else {
                    showFormAlert(this, data.message || 'Sharing failed', 'danger');
                }
            } catch (error) {
                showFormAlert(this, 'Network error - please try again', 'danger');
                console.error('Sharing error:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Share';
            }
        });
    }
}

/* Alert System */
function setupAlertSystem() {
    // Global alert function
    window.showAlert = function(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        
        const container = document.querySelector('.container') || document.body;
        const alertElement = document.createElement('div');
        alertElement.innerHTML = alertHtml;
        container.prepend(alertElement.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            $(alertElement).alert('close');
        }, 5000);
    };
    
    // Form-specific alerts
    window.showFormAlert = function(form, message, type) {
        // Remove existing alerts
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        const alertHtml = `
            <div class="alert alert-${type} mt-3">
                ${message}
            </div>
        `;
        
        form.insertAdjacentHTML('beforeend', alertHtml);
    };
}

/* Helper Functions */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}