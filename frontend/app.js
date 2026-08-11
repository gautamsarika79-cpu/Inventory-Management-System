const API_BASE = "http://localhost:4000/api";

function getToken() {
    return localStorage.getItem("trackify_token");
}

function setSession(token, user) {
    localStorage.setItem(
        "trackify_token",
        token
    );

    localStorage.setItem(
        "trackify_user",
        JSON.stringify(user)
    );
}

function getUser() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "trackify_user"
            )
        );
    } catch {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(
        "trackify_token"
    );

    localStorage.removeItem(
        "trackify_user"
    );
}

function requireAuth() {
    if (!getToken()) {
        window.location.href =
            "login.html";
    }
}

function logout() {
    clearSession();

    window.location.href =
        "login.html";
}

// ==================================================
// API REQUEST
// Supports JSON + FormData/Image Upload
// ==================================================

async function api(
    path,
    {
        method = "GET",
        body = undefined,
    } = {}
) {
    const headers = {};

    const token = getToken();

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    // ==============================================
    // IMPORTANT:
    // Do NOT manually set Content-Type for FormData.
    // Browser automatically creates multipart/form-data
    // with the correct boundary.
    // ==============================================

    let requestBody = body;

    if (
        body !== undefined &&
        !(body instanceof FormData)
    ) {
        headers["Content-Type"] =
            "application/json";

        requestBody =
            JSON.stringify(body);
    }

    const url =
        `${API_BASE}${path}`;

    console.log(
        "Trackify API request:",
        method,
        url
    );

    let response;

    try {
        response = await fetch(url, {
            method,
            headers,
            body: requestBody,
        });
    } catch (error) {
        console.error(
            "Trackify fetch failed:",
            error
        );

        throw new Error(
            "Cannot connect to Trackify server. Make sure the backend is running on http://localhost:4000"
        );
    }

    let data = {};

    try {
        data =
            await response.json();
    } catch {
        data = {};
    }

    if (response.status === 401) {
        clearSession();

        window.location.href =
            "login.html";

        throw new Error(
            "Session expired"
        );
    }

    if (!response.ok) {
        throw new Error(
            data.error ||
                data.message ||
                `Request failed (${response.status})`
        );
    }

    return data;
}

// ==================================================
// TOAST
// ==================================================

function showToast(
    message,
    type = "success"
) {
    let toast =
        document.getElementById(
            "global-toast"
        );

    if (!toast) {
        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "global-toast";

        toast.className =
            "toast";

        document.body.appendChild(
            toast
        );
    }

    toast.textContent =
        message;

    toast.className =
        `toast show ${type}`;

    clearTimeout(
        window.__toastTimer
    );

    window.__toastTimer =
        setTimeout(() => {
            toast.classList.remove(
                "show"
            );
        }, 3200);
}

// ==================================================
// MONEY
// ==================================================

function money(n) {
    return (
        "$" +
        Number(n).toLocaleString(
            undefined,
            {
                maximumFractionDigits: 0,
            }
        )
    );
}

// ==================================================
// INITIALS
// ==================================================

function initials(name) {
    return (
        (name || "?")
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
    );
}