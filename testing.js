// =====================================================================================
// SUPABASE INITIALIZATION
// You must replace these with your actual Supabase URL and Public Key
// =====================================================================================
const SUPABASE_URL = 'https://rktktyyfrnomnpvadoaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdGt0eXlmcm5vbW5wdmFkb2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzQzNjQsImV4cCI6MjA4MDA1MDM2NH0.tn9SnhiCVcaXHtt9jr-OuvciIB4lsQkR5TVOs4TT2H8';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SURVEY_TABLE = 'surveys'; // Name of your table as shown in the image

// =====================================================================================
// HELPER FUNCTIONS FOR ADMIN DASHBOARD (adminDashboard.html)
// =====================================================================================

// Function to add a new text input for dropdown options
window.addDropdownOption = function () {
    const optionsContainer = document.getElementById('dropdownOptions');
    optionsContainer.insertAdjacentHTML('beforeend', createOptionInput('ques2_option'));
};

// Function to add a new text input for checkbox options
window.addCheckboxOption = function () {
    const optionsContainer = document.getElementById('checkboxOptions');
    optionsContainer.insertAdjacentHTML('beforeend', createOptionInput('ques3_option'));
};

function createOptionInput(className) {
    // Generate a unique ID for the input group
    const id = Date.now();
    return `
        <div class="input-group mb-2 option-item" id="option-${id}">
            <input type="text" class="form-control ${className}" placeholder="Option text" required>
            <button class="btn btn-danger" type="button" onclick="document.getElementById('option-${id}').remove()">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// Function to handle the admin form submission (Creating the Survey Questions)
async function handleAdminFormSubmission(event) {
    event.preventDefault();

    const form = document.getElementById('surveyForm');

    // 1. Gather all data from the admin form
    const ques1 = form.querySelector('#question1').value.trim();
    const ques2 = form.querySelector('#question2').value.trim();
    const ques3 = form.querySelector('#question3').value.trim();
    const ques4 = form.querySelector('#question4').value.trim();

    const req1 = form.querySelector('#required1').checked;
    const req2 = form.querySelector('#required2').checked;
    const req3 = form.querySelector('#required3').checked;
    const req4 = form.querySelector('#required4').checked;

    // Helper to get all options from dynamic inputs
    const getOptions = (className) => {
        const options = [];
        form.querySelectorAll(`.${className}`).forEach(input => {
            const val = input.value.trim();
            if (val) {
                options.push(val);
            }
        });
        return options;
    };

    const ques2_options_array = getOptions('ques2_option');
    const ques3_options_array = getOptions('ques3_option');

    // Supabase stores JSONB as a JSON object, so convert array to JSON string/object
    const ques2_options = ques2_options_array.length > 0 ? JSON.stringify(ques2_options_array) : null;
    const ques3_options = ques3_options_array.length > 0 ? JSON.stringify(ques3_options_array) : null;

    const dataToInsert = {
        ques1,
        ques2,
        ques3,
        ques4,
        ques2_options,
        ques3_options,
        req1,
        req2,
        req3,
        req4,
        email: 'admin_survey_questions' // Use a static value to easily identify the question row
        // created_at and id will be handled by Supabase
    };

    try {
        // First, check if a row for questions already exists
        let { data: existingData, error: fetchError } = await supabase
            .from(SURVEY_TABLE)
            .select('*')
            .eq('email', 'admin_survey_questions')
            .limit(1);

        if (fetchError) throw fetchError;

        let result;
        if (existingData.length > 0) {
            // Row exists, UPDATE it (This prevents multiple question rows)
            result = await supabase
                .from(SURVEY_TABLE)
                .update(dataToInsert)
                .eq('email', 'admin_survey_questions');
        } else {
            // Row doesn't exist, INSERT it
            result = await supabase
                .from(SURVEY_TABLE)
                .insert([dataToInsert]);
        }

        if (result.error) throw result.error;

        // --- START REDIRECTION LOGIC ---

        // 1. Show the success message using SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Survey Created/Updated!',
            text: 'The survey questions have been successfully saved. Redirecting to survey page...',
            timer: 2000, // Optional: auto-close after 2 seconds
            showConfirmButton: false
        }).then(() => {
            // 2. Redirect to survey.html after the alert closes (or immediately if timer is used)
            window.location.href = 'survey.html';
        });

        // --- END REDIRECTION LOGIC ---


    } catch (error) {
        console.error('Submission Error:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: `Could not save survey questions: ${error.message}`,
        });
    }
}

// =====================================================================================
// FUNCTIONS FOR USER SURVEY PAGE (survey.html)
// (No changes needed here, as the fetch logic is already correct)
// =====================================================================================

// Fetches the single row containing the survey questions
async function fetchSurveyQuestions() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const form = document.getElementById('surveyResponseForm');
    const noQuestionsMessage = document.getElementById('noQuestionsMessage');

    loadingSpinner.style.display = 'block';
    form.style.display = 'none';
    noQuestionsMessage.style.display = 'none';

    try {
        const { data, error } = await supabase
            .from(SURVEY_TABLE)
            .select('*')
            .eq('email', 'admin_survey_questions')
            .single();

        loadingSpinner.style.display = 'none';

        if (error) throw error;

        if (data && data.ques1) {
            renderSurveyForm(data);
            form.style.display = 'block';
        } else {
            noQuestionsMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Fetch Error:', error.message);
        loadingSpinner.style.display = 'none';
        noQuestionsMessage.style.display = 'block';
        Swal.fire({
            icon: 'error',
            title: 'Loading Failed',
            text: `Could not load survey questions: ${error.message}`,
        });
    }
}

// Dynamically renders the survey form based on the fetched questions
function renderSurveyForm(questions) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    // 1. Question 1: Text Input
    // ... (rest of the createQuestionHtml calls remain the same)
    let html = '';
    html += createQuestionHtml(1, questions.ques1, 'text', questions.req1);

    const dropdownOptions = Array.isArray(questions.ques2_options) ? questions.ques2_options : JSON.parse(questions.ques2_options || '[]');
    html += createQuestionHtml(2, questions.ques2, 'select', questions.req2, dropdownOptions);

    const checkboxOptions = Array.isArray(questions.ques3_options) ? questions.ques3_options : JSON.parse(questions.ques3_options || '[]');
    html += createQuestionHtml(3, questions.ques3, 'checkbox', questions.req3, checkboxOptions);

    html += createQuestionHtml(4, questions.ques4, 'textarea', questions.req4);

    container.innerHTML = html;
}

// Generates the HTML for a single question
function createQuestionHtml(num, text, type, isRequired, options = []) {
    const requiredHtml = isRequired ? '<span class="required-badge">Required</span>' : '';
    let inputHtml = '';
    const name = `user_ques${num}`; // Unique name for form submission

    if (type === 'text') {
        inputHtml = `<input type="text" class="form-control" name="${name}" id="${name}" ${isRequired ? 'required' : ''}>`;
    } else if (type === 'textarea') {
        inputHtml = `<textarea class="form-control" name="${name}" id="${name}" ${isRequired ? 'required' : ''}></textarea>`;
    } else if (type === 'select') {
        inputHtml = `<select class="form-select" name="${name}" id="${name}" ${isRequired ? 'required' : ''}>
            <option value="" disabled selected>Select an option</option>
            ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>`;
    } else if (type === 'checkbox') {
        inputHtml = options.map((opt, index) => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="${name}" value="${opt}" id="${name}-${index}" 
                    ${isRequired && index === 0 ? 'data-required-group="true"' : ''} 
                    ${isRequired && index === options.length - 1 ? 'onchange="validateCheckboxGroup(this)"' : ''}>
                <label class="form-check-label" for="${name}-${index}">${opt}</label>
            </div>
        `).join('');
    }

    // Wrap the question in the card structure
    return `
        <div class="question-card">
            <div class="d-flex align-items-center mb-3">
                <div class="question-number me-3">${num}</div>
                <div class="question-text mb-0">${text} ${requiredHtml}</div>
            </div>
            ${inputHtml}
        </div>
    `;
}

// Function to handle the user form submission (Submitting the Response)
async function handleUserResponseSubmission(event) {
    event.preventDefault();

    // The data to be stored should map to your table columns: email, ques1, ques2, etc.
    const form = event.target;

    // Simple way to get form data (you can enhance this for better validation/data structure)
    const formData = new FormData(form);

    // Create the object to insert into Supabase
    const dataToInsert = {
        email: formData.get('user_email') || `anonymous_${Date.now()}`, // You should add an email field to survey.html
        ques1: formData.get('user_ques1'), // Text input
        // For the dropdown (select), formData.get() works fine
        ques2: formData.get('user_ques2'),
        ques4: formData.get('user_ques4'), // Text area
        // Checkboxes need special handling since they have the same name attribute
        ques3: formData.getAll('user_ques3').length > 0 ? JSON.stringify(formData.getAll('user_ques3')) : null,
    };

    // Assuming you add an email input to survey.html like:
    // <input type="email" class="form-control" name="user_email" placeholder="Your Email" required>

    try {
        const { error } = await supabase
            .from(SURVEY_TABLE)
            .insert([dataToInsert]);

        if (error) throw error;

        Swal.fire({
            icon: 'success',
            title: 'Submission Successful!',
            text: 'Thank you for completing the survey.',
        });
        form.reset(); // Clear the form

    } catch (error) {
        console.error('Response Submission Error:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: `Could not submit your response: ${error.message}`,
        });
    }
}

// =====================================================================================
// PAGE LOAD HANDLERS
// =====================================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Admin Dashboard Logic
    const adminForm = document.getElementById('surveyForm');
    if (adminForm) {
        // Initial setup for default options
        window.addDropdownOption(); // Add one default option for Q2
        window.addCheckboxOption(); // Add one default option for Q3

        // Attach the submission handler
        adminForm.addEventListener('submit', handleAdminFormSubmission);
    }

    // User Survey Page Logic
    const surveyContainer = document.getElementById('questionsContainer');
    if (surveyContainer) {
        fetchSurveyQuestions(); // Load questions when the survey page loads

        const responseForm = document.getElementById('surveyResponseForm');
        if (responseForm) {
            responseForm.addEventListener('submit', handleUserResponseSubmission);
        }
    }
});