// =============================================
// SUPABASE CLIENT INITIALIZATION
// =============================================
const supabaseUrl = "https://rktktyyfrnomnpvadoaj.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdGt0eXlmcm5vbW5wdmFkb2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzQzNjQsImV4cCI6MjA4MDA1MDM2NH0.tn9SnhiCVcaXHtt9jr-OuvciIB4lsQkR5TVOs4TT2H8";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Store questions globally
let surveyQuestions = [];

// =============================================
// PAGE INITIALIZATION
// =============================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded, current page:", window.location.pathname);

    const path = window.location.pathname;

    // SIGNUP PAGE
    if (path.includes("index.html") || path.endsWith("/")) {
        console.log("Initializing Signup Page");
        handleSignupPage();
    }

    // LOGIN PAGE
    if (path.includes("login.html")) {
        console.log("Initializing Login Page");
        handleLoginPage();
    }

    // SURVEY PAGE
    if (path.includes("survey.html") || path.includes("startSurvey.html")) {
        console.log("Initializing Survey Page");
        // loadSurveyQuestions();
    }

    // ADMIN DASHBOARD
    if (path.includes("adminDashboard.html")) {
        console.log("Initializing Admin Dashboard");
        handleAdminSurveyCreation();
    }
});

// =============================================
// SIGNUP FUNCTIONALITY
// =============================================
function handleSignupPage() {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");

    if (!form) {
        console.log("Signup form not found");
        return;
    }

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

        // ADMIN HARD-CODED SIGNUP
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
            return;
        }

        // NORMAL USER SIGNUP
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                },
            });

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Signup Successful!",
                text: "Redirecting to Survey page...",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                window.location.href = "startSurvey.html";
            });
        } catch (error) {
            console.error("Signup error:", error);
            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text: error.message,
            });
        }
    });
}

// =============================================
// LOGIN FUNCTIONALITY
// =============================================
function handleLoginPage() {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");

    if (!form) {
        console.log("Login form not found");
        return;
    }

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

        // ADMIN HARD-CODED LOGIN
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
            return;
        }

        // NORMAL USER LOGIN
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                text: "Redirecting to Survey page...",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                window.location.href = "startSurvey.html";
            });
        } catch (error) {
            console.error("Login error:", error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message,
            });
        }
    });
}

// =============================================
// ADMIN: ADD OPTIONS FOR DROPDOWN/CHECKBOX
// =============================================
function addDropdownOption() {
    const container = document.getElementById("dropdownOptions");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "option-item d-flex mb-2";
    div.innerHTML = `
        <input type="text" class="form-control dropdown-option" placeholder="Option text">
        <button class="btn btn-danger btn-sm ms-2" type="button" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(div);
}

function addCheckboxOption() {
    const container = document.getElementById("checkboxOptions");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "option-item d-flex mb-2";
    div.innerHTML = `
        <input type="text" class="form-control checkbox-option" placeholder="Option text">
        <button class="btn btn-danger btn-sm ms-2" type="button" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(div);
}
/// =====================================================
// ADMIN: CREATE SURVEY — NO VALIDATION — WITH REDIRECT
// =====================================================
function handleAdminSurveyCreation() {
    const surveyForm = document.getElementById("surveyForm");
    if (!surveyForm) return;

    surveyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Collect Values
        const email = document.getElementById("adminEmail").value.trim();

        const ques1 = document.getElementById("question1").value.trim();
        const ques2 = document.getElementById("question2").value.trim();
        const ques3 = document.getElementById("question3").value.trim();
        const ques4 = document.getElementById("question4").value.trim();

        const req1 = document.getElementById("required1").checked;
        const req2 = document.getElementById("required2").checked;
        const req3 = document.getElementById("required3").checked;
        const req4 = document.getElementById("required4").checked;

        const dropdownOptions = [...document.querySelectorAll(".dropdown-option")]
            .map(i => i.value.trim())
            .filter(v => v !== "");

        const checkboxOptions = [...document.querySelectorAll(".checkbox-option")]
            .map(i => i.value.trim())
            .filter(v => v !== "");

        // Insert survey into Supabase
        const { data, error } = await supabaseClient
            .from("surveys")
            .insert([{
                email,
                ques1,
                ques2,
                ques3,
                ques4,
                ques2_options: dropdownOptions,
                ques3_options: checkboxOptions,
                req1,
                req2,
                req3,
                req4
            }])
            .select();   // important (returns inserted row)

        if (error) {
            console.error(error);
            return Swal.fire("Error", "Failed to create survey!", "error");
        }

        // Success
        Swal.fire({
            icon: "success",
            title: "Survey Created!",
            timer: 1500,
            showConfirmButton: false
        });

        // Redirect to user survey page
        setTimeout(() => {
            window.location.href = `survey.html?id=${data[0].id}`;
        }, 1500);
    });
}

// =========================================================
// USER PAGE: LOAD SURVEY + RENDER QUESTIONS + VALIDATION
// =========================================================

// Detect if we are on survey.html
if (window.location.pathname.includes("survey.html")) {
    loadSurveyForUser();
}
async function loadSurveyForUser() {
    const spinner = document.getElementById("loadingSpinner");
    const container = document.getElementById("questionsContainer");
    const form = document.getElementById("surveyResponseForm");

    spinner.style.display = "block";

    const urlParams = new URLSearchParams(window.location.search);
    let surveyId = urlParams.get("id");

    let surveyData = null;

    // 🔹 CASE 1: Survey ID exists (admin redirect)
    if (surveyId) {
        const { data, error } = await supabaseClient
            .from("surveys")
            .select("*")
            .eq("id", surveyId)
            .single();

        if (!error) surveyData = data;
    }

    // 🔹 CASE 2: No ID → load latest survey for users
    if (!surveyData) {
        const { data, error } = await supabaseClient
            .from("surveys")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            spinner.style.display = "none";
            document.getElementById("noQuestionsMessage").style.display = "block";
            return;
        }

        surveyData = data;
        surveyId = data.id;
    }

    spinner.style.display = "none";

    renderSurveyQuestions(surveyData);
    form.style.display = "block";

    startTimer();
    handleUserFormSubmit(surveyId, surveyData);
}


// ===============================
// RENDER SURVEY QUESTIONS
// ===============================

function renderSurveyQuestions(survey) {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";

    let questions = [
        { text: survey.ques1, required: survey.req1, type: "text" },
        { text: survey.ques2, required: survey.req2, type: "dropdown", options: survey.ques2_options },
        { text: survey.ques3, required: survey.req3, type: "checkbox", options: survey.ques3_options },
        { text: survey.ques4, required: survey.req4, type: "text" }
    ];

    questions.forEach((q, index) => {
        if (!q.text) return; // Skip empty questions

        // 🔥 FIX: Convert string options into array
        if (q.options && typeof q.options === "string") {
            q.options = q.options.split(",").map(opt => opt.trim());
        }

        let html = `
        <div class="question-card">
            <div class="d-flex align-items-center mb-3">
                <div class="question-number">${index + 1}</div>
                <div class="ms-3 question-text">${q.text}
                    ${q.required ? `<span class="required-badge">Required</span>` : ""}
                </div>
            </div>
        `;

        // Question Types
        if (q.type === "text") {
            html += `
            <input type="text" class="form-control user-answer" 
                data-index="${index}" data-required="${q.required}">
            `;
        }

        if (q.type === "dropdown") {
            html += `
            <select class="form-select user-answer" data-index="${index}" data-required="${q.required}">
                <option value="">Select an option</option>
            `;

            if (Array.isArray(q.options)) {
                q.options.forEach(opt => {
                    html += `<option value="${opt}">${opt}</option>`;
                });
            }

            html += `</select>`;
        }

        if (q.type === "checkbox") {
            if (Array.isArray(q.options) && q.options.length > 0) {
                q.options.forEach(opt => {
                    html += `
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input user-answer-checkbox" 
                            data-index="${index}" value="${opt}">
                        <label class="form-check-label">${opt}</label>
                    </div>`;
                });
            } else {
                html += `<p class="text-muted small">No options available for this question.</p>`;
            }
        }

        html += `</div>`;
        container.innerHTML += html;
    });
}

// ===============================
// 10 MINUTE TIMER
// ===============================
function startTimer() {
    let timeLeft = 600; // 10 min = 600 sec
    const progress = document.getElementById("progressBar");
    const timeDisplay = document.getElementById("timeRemaining");

    const timer = setInterval(() => {
        timeLeft--;

        // Update progress bar
        let percent = ((600 - timeLeft) / 600) * 100;
        progress.style.width = percent + "%";

        // Update time text
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            Swal.fire("Time's up!", "Your survey was automatically submitted.", "warning");
            document.getElementById("surveyResponseForm").submit();
        }
    }, 1000);
}

// ===============================
// USER SURVEY SUBMIT + VALIDATION
// ===============================
function handleUserFormSubmit(surveyId, survey) {

    document.getElementById("surveyResponseForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const textInputs = document.querySelectorAll(".user-answer");
        const checkboxInputs = document.querySelectorAll(".user-answer-checkbox");

        let answers = {
            q1: "",
            q2: "",
            q3: [],
            q4: ""
        };

        let validationError = false;

        // Process text + dropdown
        textInputs.forEach(input => {
            const index = input.dataset.index;
            const required = input.dataset.required === "true";
            const value = input.value.trim();

            if (required && value === "") validationError = true;

            if (index == 0) answers.q1 = value;
            if (index == 1) answers.q2 = value;
            if (index == 3) answers.q4 = value;
        });

        // Process checkboxes
        checkboxInputs.forEach(input => {
            if (input.checked) answers.q3.push(input.value);
        });

        if (survey.req3 && answers.q3.length === 0) validationError = true;

        if (validationError) {
            return Swal.fire("Error", "Please fill all required fields!", "error");
        }

        // Save response
        const { error } = await supabaseClient
            .from("responses")
            .insert([{ survey_id: surveyId, answers }]);

        if (error) {
            console.error(error);
            return Swal.fire("Error", "Failed to submit survey!", "error");
        }

        Swal.fire({
            icon: "success",
            title: "Survey Submitted!",
            timer: 1500,
            showConfirmButton: false
        });

        setTimeout(() => window.location.href = "thankyou.html", 1500);
    });
}
