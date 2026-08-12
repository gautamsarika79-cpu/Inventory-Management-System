"use strict";

const API_BASE = "/api";

function getToken() {
    return localStorage.getItem("trackify_token");
}

function setSession(token, user) {
    localStorage.setItem("trackify_token", token);
    localStorage.setItem("trackify_user", JSON.stringify(user));
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem("trackify_user"));
    } catch {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem("trackify_token");
    localStorage.removeItem("trackify_user");
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = "login.html";
    }
}

function logout() {
    clearSession();
    window.location.href = "login.html";
}


/* ==================================================
   MAIN API FUNCTION
   Supports JSON and FormData
================================================== */

async function api(path, options = {}) {

    const {
        method = "GET",
        body
    } = options;

    const token = getToken();

    const headers = {};

    // IMPORTANT:
    // Do NOT set Content-Type manually for FormData.
    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE}${path}`;

    console.log("====================================");
    console.log("Trackify API request");
    console.log("Method:", method);
    console.log("URL:", url);
    console.log(
        "Body type:",
        body instanceof FormData ? "FormData" : typeof body
    );
    console.log("====================================");

    let response;

    try {

        let requestBody;

        if (body !== undefined) {

            if (body instanceof FormData) {

                // Send FormData directly
                requestBody = body;

            } else {

                // Send normal JavaScript objects as JSON
                requestBody = JSON.stringify(body);
            }
        }

        response = await fetch(url, {
            method,
            headers,
            body: requestBody
        });

    } catch (error) {

        console.error("Trackify fetch failed:", error);

        throw new Error(
    "Cannot connect to Trackify server. Please try again."
);
    }

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    console.log(
        "Trackify response:",
        response.status,
        data
    );

    if (response.status === 401) {

        clearSession();

        window.location.href = "login.html";

        throw new Error("Session expired");
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


/* ==================================================
   TOAST
================================================== */

function showToast(message, type = "success") {

    let toast = document.getElementById("global-toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "global-toast";

        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.className = `toast show ${type}`;

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3200);
}


/* ==================================================
   MONEY
================================================== */

function money(n) {

    return (
        "$" +
        Number(n).toLocaleString(undefined, {
            maximumFractionDigits: 0
        })
    );
}


/* ==================================================
   INITIALS
================================================== */

function initials(name) {

    return (name || "?")
        .split(" ")
        .map(p => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}