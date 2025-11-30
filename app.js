// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
// Initialize Supabase client
const supabaseUrl = "https://rktktyyfrnomnpvadoaj.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdGt0eXlmcm5vbW5wdmFkb2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzQzNjQsImV4cCI6MjA4MDA1MDM2NH0.tn9SnhiCVcaXHtt9jr-OuvciIB4lsQkR5TVOs4TT2H8";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    //✨ SIGNUP FUNCTIONALITY
    if (path.includes("index.html")) {
        const form = document.querySelector("form");
        const nameInput = document.getElementById("nameInput");
        const emailInput = document.getElementById("emailInput");
        const passwordInput = document.getElementById("passwordInput");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!name || !email || !password) {
                Swal.fire({
                    icon: "warning",
                    title: "Missing Fields",
                    text: "Please fill all fields before signing up.",
                });
                return;
            }

            // 🔥 HARD-CODED ADMIN SIGNUP
            if (email === "hina@yahoo.com" && password === "123456" && name.toLowerCase() === "hina") {
                Swal.fire({
                    icon: "success",
                    title: "Admin Signup Successful!",
                    text: "Redirecting to Admin Dashboard...",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    window.location.href = "adminDashboard.html";
                });
                return; // stop normal signup
            }

            // ==========================
            // NORMAL USER SIGNUP (Supabase)
            // ==========================
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                },
            });

            if (error) {
                Swal.fire({
                    icon: "error",
                    title: "Signup Failed",
                    text: error.message,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Signup Successful!",
                    text: "Redirecting to Survey page...",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    window.location.href = "startSurvey.html";
                });
            }
        });
    }

    // ✨ LOGIN FUNCTIONALITY
    if (path.includes("login.html")) {
        const form = document.querySelector("form");
        const emailInput = document.getElementById("emailInput");
        const passwordInput = document.getElementById("passwordInput");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                Swal.fire({
                    icon: "warning",
                    title: "Missing Fields",
                    text: "Please enter both email and password.",
                });
                return;
            }

            // 🔥 HARD-CODED ADMIN LOGIN
            if (email === "hina@yahoo.com" && password === "123456") {
                Swal.fire({
                    icon: "success",
                    title: "Admin Login Successful!",
                    text: "Redirecting to Admin Dashboard...",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    window.location.href = "adminDashboard.html";
                });
                return; // stop normal login
            }

            // ==========================
            // NORMAL USER LOGIN (Supabase)
            // ==========================
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: error.message,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: "Redirecting to Survey page...",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    window.location.href = "startSurvey.html";
                });
            }
        });
    }
});

// ========== ADMIN: ADD DROPDOWN OPTION ==========
function addDropdownOption() {
    const container = document.getElementById("dropdownOptions");

    const div = document.createElement("div");
    div.className = "option-item d-flex mb-2";

    div.innerHTML = `
        <input type="text" class="form-control" placeholder="Option text">
        <button class="btn btn-danger btn-sm ms-2" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;

    container.appendChild(div);
}

// ========== ADMIN: ADD CHECKBOX OPTION ==========
function addCheckboxOption() {
    const container = document.getElementById("checkboxOptions");

    const div = document.createElement("div");
    div.className = "option-item d-flex mb-2";

    div.innerHTML = `
        <input type="text" class="form-control" placeholder="Option text">
        <button class="btn btn-danger btn-sm ms-2" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;

    container.appendChild(div);
}

// ========== ADMIN: CREATE SURVEY QUESTIONS ==========
const surveyForm = document.getElementById("surveyForm");

if (surveyForm) {
    surveyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Collect Q1
        const q1 = {
            question_text: document.getElementById("question1").value,
            type: "text",
            required: document.getElementById("required1").checked
        };

        // Collect Q2
        const dropdownOptions = [...document.querySelectorAll("#dropdownOptions input")]
            .map(input => input.value);

        const q2 = {
            question_text: document.getElementById("question2").value,
            type: "dropdown",
            required: document.getElementById("required2").checked,
            options: dropdownOptions
        };

        // Collect Q3
        const checkboxOptions = [...document.querySelectorAll("#checkboxOptions input")]
            .map(input => input.value);

        const q3 = {
            question_text: document.getElementById("question3").value,
            type: "checkbox",
            required: document.getElementById("required3").checked,
            options: checkboxOptions
        };

        // Collect Q4
        const q4 = {
            question_text: document.getElementById("question4").value,
            type: "textarea",
            required: document.getElementById("required4").checked
        };

        const questions = [q1, q2, q3, q4];

        // Insert into Supabase
        const { data, error } = await supabase
            .from("survey_questions")
            .insert(questions);

        if (error) {
            console.log(error);
            Swal.fire("Error", "Could not create survey!", "error");
            return;
        }

        Swal.fire("Success!", "Survey has been created!", "success");
    });
}

// ========== LOAD QUESTIONS ON SURVEY PAGE ==========
async function loadSurveyQuestions() {
    const questionsContainer = document.getElementById("questionsContainer");
    const progressBar = document.getElementById("progressBar");

    if (!questionsContainer) return;

    const { data, error } = await supabase
        .from("survey_questions")
        .select("*");

    if (!data || data.length === 0) {
        document.getElementById("noQuestionsMessage").style.display = "block";
        return;
    }

    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("surveyResponseForm").style.display = "block";

    let total = data.length;
    let completed = 0;

    data.forEach((q, index) => {
        let html = ``;

        if (q.type === "text") {
            html = `
            <div class="question-card">
                <div class="question-number">${index + 1}</div>
                <p class="question-text">${q.question_text}</p>
                <input class="form-control" name="q${index}">
            </div>`;
        }

        if (q.type === "dropdown") {
            html = `
            <div class="question-card">
                <div class="question-number">${index + 1}</div>
                <p class="question-text">${q.question_text}</p>
                <select class="form-select" name="q${index}">
                    ${q.options.map(o => `<option>${o}</option>`).join("")}
                </select>
            </div>`;
        }

        if (q.type === "checkbox") {
            html = `
            <div class="question-card">
                <div class="question-number">${index + 1}</div>
                <p class="question-text">${q.question_text}</p>
                ${q.options
                    .map(o => `<div class="form-check">
                        <input type="checkbox" class="form-check-input" value="${o}">
                        <label class="form-check-label">${o}</label>
                    </div>`
                ).join("")}
            </div>`;
        }

        if (q.type === "textarea") {
            html = `
            <div class="question-card">
                <div class="question-number">${index + 1}</div>
                <p class="question-text">${q.question_text}</p>
                <textarea class="form-control"></textarea>
            </div>`;
        }

        questionsContainer.innerHTML += html;

        completed++;
        progressBar.style.width = (completed / total) * 100 + "%";
    });
}

loadSurveyQuestions();

// ========= SUBMIT SURVEY RESPONSE =========
const surveyResponseForm = document.getElementById("surveyResponseForm");
if (surveyResponseForm) {
    surveyResponseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        Swal.fire("Success", "Your response has been submitted!", "success");
    });
}


















// ======== ADMIN DASHBOARD: CREATE SURVEY ========
document.getElementById('surveyForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect form data
    const questions = [
        {
            question_number: 1,
            question_text: document.getElementById('question1').value,
            question_type: 'text',
            options: [],
            is_required: document.getElementById('required1').checked
        },
        {
            question_number: 2,
            question_text: document.getElementById('question2').value,
            question_type: 'dropdown',
            options: Array.from(document.querySelectorAll('#dropdownOptions input')).map(i => i.value).filter(v => v),
            is_required: document.getElementById('required2').checked
        },
        {
            question_number: 3,
            question_text: document.getElementById('question3').value,
            question_type: 'checkbox',
            options: Array.from(document.querySelectorAll('#checkboxOptions input')).map(i => i.value).filter(v => v),
            is_required: document.getElementById('required3').checked
        },
        {
            question_number: 4,
            question_text: document.getElementById('question4').value,
            question_type: 'textarea',
            options: [],
            is_required: document.getElementById('required4').checked
        }
    ];

    try {
        const { data, error } = await supabaseClient
            .from('survey_questions')
            .insert(questions);

        if (error) throw error;

        // Optional: save locally for immediate survey preview
        localStorage.setItem('latestSurvey', JSON.stringify(questions));

        Swal.fire({
            icon: 'success',
            title: 'Survey Created!',
            text: 'Redirecting to survey page...',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = 'survey.html';
        });

    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Error creating survey',
            text: err.message
        });
    }
});

// ======== SURVEY PAGE: LOAD QUESTIONS ========
async function loadSurveyQuestions() {
    const container = document.getElementById('questionsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noQuestionsMessage = document.getElementById('noQuestionsMessage');

    loadingSpinner.style.display = 'block';

    try {
        const { data, error } = await supabaseClient
            .from('survey_questions')
            .select('*')
            .order('question_number', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            loadingSpinner.style.display = 'none';
            noQuestionsMessage.style.display = 'block';
            return;
        }

        container.innerHTML = '';
        data.forEach((q, idx) => container.innerHTML += generateQuestionHTML(q, idx));

        document.getElementById('surveyResponseForm').style.display = 'block';
        loadingSpinner.style.display = 'none';
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error loading survey', text: err.message });
        loadingSpinner.style.display = 'none';
    }
}

function generateQuestionHTML(question, index) {
    const requiredAttr = question.is_required ? 'required' : '';
    let inputHTML = '';

    switch (question.question_type) {
        case 'text':
            inputHTML = `<input type="text" class="form-control" id="q_${question.id}" name="q_${question.id}" placeholder="Enter your answer" ${requiredAttr}>`;
            break;
        case 'textarea':
            inputHTML = `<textarea class="form-control" id="q_${question.id}" name="q_${question.id}" placeholder="Enter your detailed answer" ${requiredAttr}></textarea>`;
            break;
        case 'dropdown':
            inputHTML = `<select class="form-select" id="q_${question.id}" name="q_${question.id}" ${requiredAttr}>
                <option value="">Select an option</option>
                ${question.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>`;
            break;
        case 'checkbox':
            inputHTML = question.options.map((opt, i) => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="q_${question.id}_${i}" name="q_${question.id}" value="${opt}">
                    <label class="form-check-label" for="q_${question.id}_${i}">${opt}</label>
                </div>
            `).join('');
            break;
    }

    return `<div class="question-card mb-3">
        <label class="form-label"><strong>Q${index + 1}:</strong> ${question.question_text}</label>
        ${inputHTML}
    </div>`;
}

// Load questions on DOM ready
window.addEventListener('DOMContentLoaded', () => loadSurveyQuestions());

// ======== SUBMIT SURVEY RESPONSES ========
document.getElementById('surveyResponseForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const { data: userData } = await supabaseClient.auth.getUser();

    if (!userData.user) {
        Swal.fire({ icon: 'error', title: 'Login Required', text: 'Please login to submit survey' });
        return;
    }

    const responses = [];

    surveyQuestions.forEach(q => {
        if (q.question_type === 'checkbox') {
            const selected = Array.from(document.querySelectorAll(`input[name="q_${q.id}"]:checked`)).map(i => i.value);
            responses.push({
                user_id: userData.user.id,
                question_id: q.id,
                answer_array: selected
            });
        } else {
            const val = document.getElementById(`q_${q.id}`)?.value || null;
            responses.push({
                user_id: userData.user.id,
                question_id: q.id,
                answer: val
            });
        }
    });

    try {
        const { data, error } = await supabaseClient.from('survey_responses').insert(responses);
        if (error) throw error;

        Swal.fire({ icon: 'success', title: 'Survey Submitted!', showConfirmButton: false, timer: 2000 })
            .then(() => window.location.href = 'thankyou.html');

    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Submission Failed', text: err.message });
    }
});
