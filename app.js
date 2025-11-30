//Initialize Supabase client
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
                    text: "Redirecting to Post page...",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    window.location.href = "startSurvey.html";
                });
            }
        });
    }

    // ✨ GOOGLE SIGN-IN FUNCTIONALITY
    // const googleBtn = document.getElementById("googleSignUp");
    // if (googleBtn) {
    //     googleBtn.addEventListener("click", async () => {
    //         const { data, error } = await supabaseClient.auth.signInWithOAuth({
    //             provider: "google",
    //             options: {
    //                 redirectTo: `${window.location.origin}/startSurvey.html`,
    //                 queryParams: {
    //                     access_type: "offline",
    //                     prompt: "consent",
    //                 },
    //             },
    //         });

    //         if (error) {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Google Login Failed",
    //                 text: error.message,
    //             });
    //         }
    //     });
    // }

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
                text: "Redirecting to Post page...",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                window.location.href = "startSurvey.html";
            });
        }
    });
}

}); // ← This closing brace and parenthesis were missing!