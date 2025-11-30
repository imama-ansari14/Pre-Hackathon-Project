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
        loadSurveyQuestions();
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








