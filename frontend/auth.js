/* =====================================================
   TRACKIFY AUTHENTICATION
   ===================================================== */

const API_URL =
    "http://localhost:5000/api";


/* =====================================================
   ELEMENTS
   ===================================================== */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const rememberMe =
    document.getElementById("rememberMe");

const loginBtn =
    document.getElementById("loginBtn");

const loginBtnText =
    document.getElementById("loginBtnText");

const loginSpinner =
    document.getElementById("loginSpinner");

const togglePassword =
    document.getElementById("togglePassword");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");

const successMessage =
    document.getElementById("successMessage");

const successText =
    document.getElementById("successText");

const emailError =
    document.getElementById("emailError");

const passwordError =
    document.getElementById("passwordError");


/* =====================================================
   PASSWORD VISIBILITY
   ===================================================== */

togglePassword.addEventListener(
    "click",
    function () {

        const isPassword =
            passwordInput.type === "password";


        passwordInput.type =
            isPassword
                ? "text"
                : "password";


        togglePassword.textContent =
            isPassword
                ? "🙈"
                : "👁";


        togglePassword.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

    }
);


/* =====================================================
   VALIDATION
   ===================================================== */

function validateEmail() {

    const email =
        emailInput.value.trim();


    emailError.textContent = "";


    if (!email) {

        emailError.textContent =
            "Email address is required.";

        return false;

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        return false;

    }


    return true;

}


function validatePassword() {

    const password =
        passwordInput.value;


    passwordError.textContent = "";


    if (!password) {

        passwordError.textContent =
            "Password is required.";

        return false;

    }


    if (password.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        return false;

    }


    return true;

}


/* =====================================================
   CLEAR ALERTS
   ===================================================== */

function clearAlerts() {

    errorMessage.classList.add(
        "hidden"
    );

    successMessage.classList.add(
        "hidden"
    );

}


/* =====================================================
   SHOW ERROR
   ===================================================== */

function showError(message) {

    successMessage.classList.add(
        "hidden"
    );


    errorText.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );

}


/* =====================================================
   SHOW SUCCESS
   ===================================================== */

function showSuccess(message) {

    errorMessage.classList.add(
        "hidden"
    );


    successText.textContent =
        message;


    successMessage.classList.remove(
        "hidden"
    );

}


/* =====================================================
   LOADING STATE
   ===================================================== */

function setLoading(loading) {

    loginBtn.disabled =
        loading;


    if (loading) {

        loginBtnText.textContent =
            "Signing in...";

        loginSpinner.classList.remove(
            "hidden"
        );

    } else {

        loginBtnText.textContent =
            "Sign In";

        loginSpinner.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   LOGIN
   ===================================================== */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearAlerts();


        const validEmail =
            validateEmail();

        const validPassword =
            validatePassword();


        if (
            !validEmail ||
            !validPassword
        ) {

            return;

        }


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        setLoading(true);


        try {

            console.log(
                "Trackify login request..."
            );


            const response =
                await fetch(
                    `${API_URL}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            let data;


            try {

                data =
                    await response.json();

            } catch {

                data = {};

            }


            console.log(
                "Login response:",
                response.status,
                data
            );


            /* ==========================================
               LOGIN FAILED
            ========================================== */

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Invalid email or password."
                );

            }


            /* ==========================================
               GET TOKEN
            ========================================== */

            const token =
                data.token ||
                data.accessToken ||
                data.access_token;


            if (!token) {

                throw new Error(
                    "Login succeeded but the server did not return an authentication token."
                );

            }


            /* ==========================================
               GET USER
            ========================================== */

            const user =
                data.user ||
                data.admin ||
                {
                    email: email
                };


            /* ==========================================
               SAVE AUTH
            ========================================== */

            localStorage.setItem(
                "trackify_token",
                token
            );


            localStorage.setItem(
                "trackify_user",
                JSON.stringify(user)
            );


            /* ==========================================
               REMEMBER ME
            ========================================== */

            if (
                rememberMe &&
                rememberMe.checked
            ) {

                localStorage.setItem(
                    "trackify_remember",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "trackify_remember"
                );

            }


            /* ==========================================
               SUCCESS
            ========================================== */

            showSuccess(
                "Login successful. Redirecting..."
            );


            /* ==========================================
               REDIRECT
            ========================================== */

            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                700
            );


        } catch (error) {

            console.error(
                "Trackify login error:",
                error
            );


            let message =
                error.message;


            /* ==========================================
               NETWORK ERROR
            ========================================== */

            if (
                error instanceof
                TypeError
            ) {

                message =
                    "Unable to connect to the Trackify server. Make sure the backend is running on port 5000.";

            }


            showError(message);


        } finally {

            setLoading(false);

        }

    }
);


/* =====================================================
   LIVE VALIDATION
   ===================================================== */

emailInput.addEventListener(
    "blur",
    validateEmail
);


passwordInput.addEventListener(
    "blur",
    validatePassword
);


/* =====================================================
   CLEAR FIELD ERROR WHEN TYPING
   ===================================================== */

emailInput.addEventListener(
    "input",
    function () {

        emailError.textContent = "";

        errorMessage.classList.add(
            "hidden"
        );

    }
);


passwordInput.addEventListener(
    "input",
    function () {

        passwordError.textContent = "";

        errorMessage.classList.add(
            "hidden"
        );

    }
);


/* =====================================================
   FORGOT PASSWORD
   ===================================================== */

document
    .getElementById("forgotPassword")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showError(
                "Password recovery is not available yet. Please contact the system administrator."
            );

        }
    );


/* =====================================================
   REMEMBERED EMAIL
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const remembered =
            localStorage.getItem(
                "trackify_remember"
            );


        const storedUser =
            localStorage.getItem(
                "trackify_user"
            );


        if (
            remembered === "true" &&
            storedUser
        ) {

            try {

                const user =
                    JSON.parse(
                        storedUser
                    );


                if (user.email) {

                    emailInput.value =
                        user.email;

                    rememberMe.checked =
                        true;

                }

            } catch (error) {

                console.error(
                    "Unable to restore remembered user.",
                    error
                );

            }

        }

    }
);