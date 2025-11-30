// Initialize Supabase client
const supabaseUrl = "https://rktktyyfrnomnpvadoaj.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdGt0eXlmcm5vbW5wdmFkb2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzQzNjQsImV4cCI6MjA4MDA1MDM2NH0.tn9SnhiCVcaXHtt9jr-OuvciIB4lsQkR5TVOs4TT2H8";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    // =====================
    // SIGNUP FUNCTIONALITY
    // =====================
    if (path.includes("index.html")) {
        const form = document.querySelector("form");
        const nameInput = document.getElementById("nameInput");
        const emailInput = document.getElementById("emailInput");
        const passwordInput = document.getElementById("passwordInput");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            let name = nameInput.value.trim();
            let email = emailInput.value.trim();
            let password = passwordInput.value;

            if (!name || !email || !password) {
                Swal.fire({
                    icon: "warning",
                    title: "Missing Fields",
                    text: "Please fill all fields before signing up.",
                });
                return;
            }

            // =====================
            // ADMIN DEFAULT CREDENTIALS
            // =====================
            if (email === "hina@yahoo.com" && password === "123456") {
                name = "hina"; // Force admin name
            }

            // =====================
            // SIGNUP USER
            // =====================
            const isAdmin = email === "hina@yahoo.com" && password === "123456";

            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name, is_admin: isAdmin },
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
                    text: "Redirecting...",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    if (isAdmin) {
                        window.location.href = "adminDashboard.html";
                    } else {
                        window.location.href = "startSurvey.html";
                    }
                });
            }
        });
    }

    // =====================
    // LOGIN FUNCTIONALITY
    // =====================
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

            // =====================
            // ADMIN LOGIN CHECK
            // =====================
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
                return; // Stop normal login
            }

            // =====================
            // NORMAL USER LOGIN
            // =====================
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
