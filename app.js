/* =====================================================
   AMBUAFRICA V2
   FRONTEND PROTOTYPE
===================================================== */


/* =====================================================
   DEMO USERS
===================================================== */

const demoUsers = {

    patient: {

        email: "patient@demo.com",

        password: "password123",

        name: "John Doe",

        role: "patient"

    },

    hospital: {

        email: "hospital@demo.com",

        password: "password123",

        name: "MedCare Hospital",

        role: "hospital"

    },

    admin: {

        email: "admin@demo.com",

        password: "password123",

        name: "System Administrator",

        role: "admin"

    }

};


/* =====================================================
   APPLICATION STATE
===================================================== */

let currentUser = null;

let currentPage = "dashboard";

let currentEmergency = null;


/* =====================================================
   DEMO DATA
===================================================== */

const ambulances = [

    {
        id: "A-101",
        hospital: "MedCare Hospital",
        type: "Advanced Life Support",
        driver: "David Johnson",
        status: "Available"
    },

    {
        id: "A-102",
        hospital: "MedCare Hospital",
        type: "Basic Ambulance",
        driver: "Samuel Peter",
        status: "Available"
    },

    {
        id: "A-103",
        hospital: "Lagos General Hospital",
        type: "ICU / Mobile ICU",
        driver: "Michael Ade",
        status: "Busy"
    },

    {
        id: "A-104",
        hospital: "Lagos General Hospital",
        type: "Maternity",
        driver: "James Cole",
        status: "Maintenance"
    },

    {
        id: "A-105",
        hospital: "City Medical Centre",
        type: "Basic Ambulance",
        driver: "Daniel Paul",
        status: "Available"
    }

];


const emergencyHistory = [

    {
        id: "AMB-00091",
        patient: "John Doe",
        emergency: "Breathing Difficulty",
        hospital: "MedCare Hospital",
        ambulance: "A-101",
        date: "18 Aug 2026",
        status: "Completed",
        amount: 18500
    },

    {
        id: "AMB-00082",
        patient: "Sarah James",
        emergency: "Road Accident",
        hospital: "Lagos General Hospital",
        ambulance: "A-103",
        date: "17 Aug 2026",
        status: "Completed",
        amount: 27000
    },

    {
        id: "AMB-00075",
        patient: "Michael Cole",
        emergency: "Pregnancy Emergency",
        hospital: "MedCare Hospital",
        ambulance: "A-102",
        date: "15 Aug 2026",
        status: "Completed",
        amount: 22000
    }

];


const notifications = [

    {
        title: "Emergency request completed",

        text: "Your recent ambulance request has been completed.",

        time: "10 minutes ago",

        type: "success"

    },

    {
        title: "Ambulance available",

        text: "A-102 is currently available near your location.",

        time: "25 minutes ago",

        type: "info"

    },

    {
        title: "Profile reminder",

        text: "Add an emergency contact to your profile.",

        time: "1 hour ago",

        type: "warning"

    }

];


/* =====================================================
   AUTH
===================================================== */

function fillDemo(type) {

    const user = demoUsers[type];

    document.getElementById("loginEmail").value =
        user.email;

    document.getElementById("loginPassword").value =
        user.password;

}


function login() {

    const email =
        document.getElementById("loginEmail")
        .value
        .trim();

    const password =
        document.getElementById("loginPassword")
        .value
        .trim();


    if (!email || !password) {

        showToast(
            "Please enter your email and password.",
            "error"
        );

        return;
    }


    const user = Object.values(demoUsers).find(
        account =>
            account.email === email &&
            account.password === password
    );


    if (!user) {

        showToast(
            "Invalid demo credentials.",
            "error"
        );

        return;
    }


    currentUser = { ...user };


    startApplication();

}


function signup() {

    const name =
        document.getElementById("signupName")
        .value
        .trim();

    const email =
        document.getElementById("signupEmail")
        .value
        .trim();

    const phone =
        document.getElementById("signupPhone")
        .value
        .trim();

    const password =
        document.getElementById("signupPassword")
        .value;

    const role =
        document.getElementById("signupRole")
        .value;


    if (!name || !email || !phone || !password) {

        showToast(
            "Please complete all fields.",
            "error"
        );

        return;
    }


    currentUser = {

        name,

        email,

        phone,

        password,

        role

    };


    showToast(
        "Account created successfully."
    );


    setTimeout(() => {

        startApplication();

    }, 700);

}


function logout() {

    currentUser = null;

    currentPage = "dashboard";

    document.getElementById("app")
        .classList.add("hidden");

    document.getElementById("authScreen")
        .classList.remove("hidden");

    showLogin();

}


/* =====================================================
   AUTH SCREENS
===================================================== */

function showSignup() {

    document
        .getElementById("loginForm")
        .classList.add("hidden");

    document
        .getElementById("signupForm")
        .classList.remove("hidden");

}


function showLogin() {

    document
        .getElementById("signupForm")
        .classList.add("hidden");

    document
        .getElementById("loginForm")
        .classList.remove("hidden");

}


function togglePassword(id) {

    const input =
        document.getElementById(id);

    input.type =
        input.type === "password"
            ? "text"
            : "password";

}


/* =====================================================
   START APPLICATION
===================================================== */

function startApplication() {

    document
        .getElementById("authScreen")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    updateUserInformation();

    buildNavigation();

    showPage("dashboard");

}


function updateUserInformation() {

    const name =
        currentUser.name || "User";


    document
        .getElementById("topUserName")
        .textContent = name;


    document
        .getElementById("topUserRole")
        .textContent =
            formatRole(currentUser.role);


    document
        .getElementById("topAvatar")
        .textContent =
            getInitials(name);

}


function formatRole(role) {

    const roles = {

        patient: "Patient",

        hospital: "Hospital",

        admin: "Administrator"

    };

    return roles[role] || role;

}


function getInitials(name) {

    return name

        .split(" ")

        .map(word => word[0])

        .slice(0, 2)

        .join("")
        .toUpperCase();

}


/* =====================================================
   NAVIGATION
===================================================== */

function buildNavigation() {

    const nav =
        document.getElementById("sidebarNav");


    let items = [];


    if (currentUser.role === "patient") {

        items = [

            ["dashboard", "fa-house", "Dashboard"],

            ["request", "fa-truck-medical", "Request Ambulance"],

            ["history", "fa-clock-rotate-left", "My History"],

            ["notifications", "fa-bell", "Notifications"],

            ["profile", "fa-user", "Profile"]

        ];

    }


    if (currentUser.role === "hospital") {

        items = [

            ["dashboard", "fa-chart-line", "Dashboard"],

            ["requests", "fa-triangle-exclamation", "Emergency Requests"],

            ["ambulances", "fa-truck-medical", "Ambulances"],

            ["tracking", "fa-map-location-dot", "Live Tracking"],

            ["history", "fa-clock-rotate-left", "History"],

            ["notifications", "fa-bell", "Notifications"],

            ["profile", "fa-hospital", "Hospital Profile"]

        ];

    }


    if (currentUser.role === "admin") {

        items = [

            ["dashboard", "fa-gauge-high", "Dashboard"],

            ["emergencies", "fa-triangle-exclamation", "Emergencies"],

            ["users", "fa-users", "Users"],

            ["hospitals", "fa-hospital", "Hospitals"],

            ["ambulances", "fa-truck-medical", "Ambulances"],

            ["payments", "fa-credit-card", "Payments"],

            ["notifications", "fa-bell", "Notifications"],

            ["profile", "fa-user-shield", "Admin Profile"]

        ];

    }


    nav.innerHTML = items.map(item => `

        <button
            class="nav-item"
            data-page="${item[0]}"
            onclick="showPage('${item[0]}')"
        >

            <i class="fa-solid ${item[1]}"></i>

            <span>${item[2]}</span>

        </button>

    `).join("");

}


/* =====================================================
   PAGE ROUTER
===================================================== */

function showPage(page) {

    currentPage = page;


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page === page
            );

        });


    const titles = {

        dashboard: [
            "Dashboard",
            "Your AmbuAfrica overview"
        ],

        request: [
            "Request Ambulance",
            "Get emergency assistance"
        ],

        history: [
            "History",
            "View previous ambulance requests"
        ],

        notifications: [
            "Notifications",
            "Stay updated with your emergency activity"
        ],

        profile: [
            "Profile",
            "Manage your account"
        ],

        requests: [
            "Emergency Requests",
            "Manage incoming emergency calls"
        ],

        ambulances: [
            "Ambulances",
            "Manage your ambulance fleet"
        ],

        tracking: [
            "Live Tracking",
            "Monitor active ambulance missions"
        ],

        emergencies: [
            "Emergencies",
            "Monitor platform emergencies"
        ],

        users: [
            "Users",
            "Manage AmbuAfrica users"
        ],

        hospitals: [
            "Hospitals",
            "Manage healthcare providers"
        ],

        payments: [
            "Payments",
            "Monitor transactions"
        ]

    };


    document
        .getElementById("pageTitle")
        .textContent =
            titles[page]?.[0] || "AmbuAfrica";


    document
        .getElementById("pageSubtitle")
        .textContent =
            titles[page]?.[1] || "";


    renderPage(page);

}


/* =====================================================
   RENDER PAGE
===================================================== */

function renderPage(page) {

    const content =
        document.getElementById("pageContent");


    if (
        currentUser.role === "patient"
    ) {

        renderPatientPage(
            page,
            content
        );

        return;

    }


    if (
        currentUser.role === "hospital"
    ) {

        renderHospitalPage(
            page,
            content
        );

        return;

    }


    if (
        currentUser.role === "admin"
    ) {

        renderAdminPage(
            page,
            content
        );

    }

}


/* =====================================================
   PATIENT DASHBOARD
===================================================== */

function renderPatientPage(page, content) {

    if (page === "dashboard") {

        content.innerHTML = `

            <div class="page-header">

                <h1>
                    Good morning, ${currentUser.name.split(" ")[0]} 👋
                </h1>

                <p>
                    Your emergency support is always within reach.
                </p>

            </div>


            <div class="emergency-card">

                <h2>
                    Need emergency help?
                </h2>

                <p>
                    Request a nearby ambulance and get connected
                    with an available emergency provider.
                </p>


                <button
                    class="emergency-button"
                    onclick="showPage('request')"
                >

                    <i class="fa-solid fa-truck-medical"></i>

                    REQUEST AMBULANCE

                </button>

            </div>


            <div class="location-card">

                <div class="location-icon">

                    <i class="fa-solid fa-location-dot"></i>

                </div>

                <div>

                    <strong>
                        Current Location
                    </strong>

                    <span>
                        Ikeja, Lagos
                    </span>

                </div>

            </div>


            <div class="stats-grid">

                <div class="stat-card">

                    <div class="stat-card-top">

                        <span>
                            Ambulances Nearby
                        </span>

                        <div class="stat-icon">
                            <i class="fa-solid fa-truck-medical"></i>
                        </div>

                    </div>

                    <h3>6</h3>

                    <p>
                        Available around you
                    </p>

                </div>


                <div class="stat-card">

                    <div class="stat-card-top">

                        <span>
                            Requests
                        </span>

                        <div class="stat-icon">
                            <i class="fa-solid fa-file-medical"></i>
                        </div>

                    </div>

                    <h3>3</h3>

                    <p>
                        Total requests
                    </p>

                </div>


                <div class="stat-card">

                    <div class="stat-card-top">

                        <span>
                            Completed
                        </span>

                        <div class="stat-icon">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>

                    </div>

                    <h3>3</h3>

                    <p>
                        Completed trips
                    </p>

                </div>


                <div class="stat-card">

                    <div class="stat-card-top">

                        <span>
                            Emergency Contacts
                        </span>

                        <div class="stat-icon">
                            <i class="fa-solid fa-phone"></i>
                        </div>

                    </div>

                    <h3>2</h3>

                    <p>
                        Saved contacts
                    </p>

                </div>

            </div>


            <div class="card">

                <div class="card-header">

                    <h3>
                        Quick Actions
                    </h3>

                </div>


                <div class="quick-grid">

                    <button
                        class="quick-action"
                        onclick="showPage('request')"
                    >

                        <i class="fa-solid fa-truck-medical"></i>

                        <strong>
                            Request Ambulance
                        </strong>

                        <span>
                            Get emergency assistance
                        </span>

                    </button>


                    <button
                        class="quick-action"
                        onclick="showPage('history')"
                    >

                        <i class="fa-solid fa-clock-rotate-left"></i>

                        <strong>
                            Request History
                        </strong>

                        <span>
                            View previous trips
                        </span>

                    </button>


                    <button
                        class="quick-action"
                        onclick="showPage('profile')"
                    >

                        <i class="fa-solid fa-user"></i>

                        <strong>
                            My Profile
                        </strong>

                        <span>
                            Manage your information
                        </span>

                    </button>

                </div>

            </div>

        `;

        return;

    }


    if (page === "request") {

        renderRequestPage(content);

        return;

    }


    if (page === "history") {

        renderPatientHistory(content);

        return;

    }


    if (page === "notifications") {

        renderNotifications(content);

        return;

    }


    if (page === "profile") {

        renderPatientProfile(content);

    }

}


/* =====================================================
   REQUEST PAGE
===================================================== */

function renderRequestPage(content) {

    content.innerHTML = `

        <div class="page-header">

            <h1>
                Request an Ambulance
            </h1>

            <p>
                Tell us what is happening so we can find
                the right emergency response.
            </p>

        </div>


        <div class="card">

            <div class="input-group">

                <label>
                    📍 Current Location
                </label>

                <input
                    id="requestLocation"
                    value="Ikeja, Lagos"
                    class="form-control"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid var(--border);
                        border-radius:10px;
                    "
                >

            </div>


            <div class="input-group">

                <label>
                    Emergency Type
                </label>

                <select id="emergencyType">

                    <option value="">
                        Select emergency
                    </option>

                    <option>
                        Road Accident
                    </option>

                    <option>
                        Difficulty Breathing
                    </option>

                    <option>
                        Severe Bleeding
                    </option>

                    <option>
                        Heart-related Emergency
                    </option>

                    <option>
                        Pregnancy / Maternity
                    </option>

                    <option>
                        Unconsciousness
                    </option>

                    <option>
                        Burns
                    </option>

                    <option>
                        Other
                    </option>

                </select>

            </div>


            <div class="input-group">

                <label>
                    Severity
                </label>

                <select id="severity">

                    <option>
                        Moderate
                    </option>

                    <option>
                        Serious
                    </option>

                    <option>
                        Critical
                    </option>

                </select>

            </div>


            <div class="input-group">

                <label>
                    Number of Patients
                </label>

                <input
                    id="patientCount"
                    type="number"
                    min="1"
                    value="1"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid var(--border);
                        border-radius:10px;
                    "
                >

            </div>


            <div class="input-group">

                <label>
                    Ambulance Type
                </label>

                <select id="ambulanceType">

                    <option>
                        Basic Ambulance
                    </option>

                    <option>
                        Advanced Life Support
                    </option>

                    <option>
                        ICU / Mobile ICU
                    </option>

                    <option>
                        Maternity
                    </option>

                    <option>
                        Neonatal
                    </option>

                </select>

            </div>


            <div class="input-group">

                <label>
                    Destination Hospital
                </label>

                <select id="destination">

                    <option>
                        Select destination
                    </option>

                    <option>
                        MedCare Hospital
                    </option>

                    <option>
                        Lagos General Hospital
                    </option>

                    <option>
                        City Medical Centre
                    </option>

                </select>

            </div>


            <div class="input-group">

                <label>
                    Additional Information
                </label>

                <textarea
                    id="specialRequirements"
                    placeholder="Tell the ambulance crew anything important..."
                    style="
                        width:100%;
                        min-height:100px;
                        padding:14px;
                        border:1px solid var(--border);
                        border-radius:10px;
                        resize:vertical;
                        font-family:inherit;
                    "
                ></textarea>

            </div>


            <button
                class="primary-btn"
                onclick="submitEmergency()"
            >

                <i class="fa-solid fa-truck-medical"></i>

                REQUEST AMBULANCE

            </button>

        </div>

    `;

}


/* =====================================================
   SUBMIT EMERGENCY
===================================================== */

function submitEmergency() {

    const emergency =
        document.getElementById("emergencyType")
        .value;


    if (!emergency) {

        showToast(
            "Please select the emergency type.",
            "error"
        );

        return;

    }


    currentEmergency = {

        id:
            "AMB-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            ),

        patient:
            currentUser.name,

        emergency,

        severity:
            document.getElementById("severity")
                .value,

        location:
            document.getElementById("requestLocation")
                .value,

        patients:
            document.getElementById("patientCount")
                .value,

        ambulanceType:
            document.getElementById("ambulanceType")
                .value,

        destination:
            document.getElementById("destination")
                .value,

        status:
            "Request Received",

        ambulance:
            null,

        amount:
            25000

    };


    showToast(
        "Emergency request sent."
    );


    setTimeout(() => {

        showTrackingSimulation();

    }, 700);

}


/* =====================================================
   TRACKING SIMULATION
===================================================== */

function showTrackingSimulation() {

    const content =
        document.getElementById("pageContent");


    currentPage = "tracking";


    content.innerHTML = `

        <div class="page-header">

            <h1>
                Emergency Tracking
            </h1>

            <p>
                Your ambulance request is being processed.
            </p>

        </div>


        <div class="card">

            <div style="
                height:320px;
                background:#eaf3ee;
                border-radius:14px;
                display:flex;
                align-items:center;
                justify-content:center;
                position:relative;
                overflow:hidden;
            ">

                <div style="
                    font-size:50px;
                ">
                    🏥
                </div>

                <div style="
                    position:absolute;
                    left:48%;
                    top:42%;
                    font-size:35px;
                ">
                    🚑
                </div>

                <div style="
                    position:absolute;
                    right:18%;
                    bottom:25%;
                    font-size:35px;
                ">
                    📍
                </div>

                <div style="
                    position:absolute;
                    left:20%;
                    top:20%;
                    width:60%;
                    height:60%;
                    border:2px dashed #8ac9a8;
                    border-radius:50%;
                "></div>

            </div>

        </div>


        <div class="card">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:20px;
            ">

                <div>

                    <h3>
                        🚑 Ambulance A-102
                    </h3>

                    <p style="
                        color:var(--muted);
                        font-size:12px;
                        margin-top:5px;
                    ">
                        MedCare Hospital
                    </p>

                </div>

                <span class="status blue">
                    En Route
                </span>

            </div>


            <div class="stats-grid">

                <div class="stat-card">

                    <h3 style="font-size:20px;">
                        5 min
                    </h3>

                    <p>
                        Estimated arrival
                    </p>

                </div>


                <div class="stat-card">

                    <h3 style="font-size:20px;">
                        1.8 km
                    </h3>

                    <p>
                        Distance
                    </p>

                </div>

            </div>


            <button
                class="primary-btn"
                onclick="showToast('Calling ambulance A-102...')"
            >

                <i class="fa-solid fa-phone"></i>

                CALL AMBULANCE

            </button>

        </div>

    `;

}


/* =====================================================
   PATIENT HISTORY
===================================================== */

function renderPatientHistory(content) {

    content.innerHTML = `

        <div class="page-header">

            <h1>
                My History
            </h1>

            <p>
                Your previous ambulance requests.
            </p>

        </div>


        <div class="card">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>REQUEST</th>
                            <th>EMERGENCY</th>
                            <th>PROVIDER</th>
                            <th>DATE</th>
                            <th>AMOUNT</th>
                            <th>STATUS</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${emergencyHistory
                            .filter(
                                item =>
                                    item.patient ===
                                    currentUser.name ||
                                    currentUser.role === "admin"
                            )
                            .map(item => `

                                <tr>

                                    <td>
                                        <strong>
                                            ${item.id}
                                        </strong>
                                    </td>

                                    <td>
                                        ${item.emergency}
                                    </td>

                                    <td>
                                        ${item.hospital}
                                    </td>

                                    <td>
                                        ${item.date}
                                    </td>

                                    <td>
                                        ₦${item.amount.toLocaleString()}
                                    </td>

                                    <td>

                                        <span class="status green">
                                            ✓ Completed
                                        </span>

                                    </td>

                                </tr>

                            `)
                            .join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

function renderNotifications(content) {

    content.innerHTML = `

        <div class="page-header">

            <h1>
                Notifications
            </h1>

            <p>
                Important updates from AmbuAfrica.
            </p>

        </div>


        ${notifications.map(notification => `

            <div class="card">

                <div style="
                    display:flex;
                    gap:15px;
                    align-items:flex-start;
                ">

                    <div class="stat-icon">

                        <i class="fa-solid fa-bell"></i>

                    </div>

                    <div>

                        <strong>
                            ${notification.title}
                        </strong>

                        <p style="
                            color:var(--muted);
                            margin-top:5px;
                            font-size:13px;
                        ">
                            ${notification.text}
                        </p>

                        <small style="
                            color:var(--muted);
                            display:block;
                            margin-top:8px;
                        ">
                            ${notification.time}
                        </small>

                    </div>

                </div>

            </div>

        `).join("")}

    `;

}


/* =====================================================
   PATIENT PROFILE
===================================================== */

function renderPatientProfile(content) {

    content.innerHTML = `

        <div class="page-header">

            <h1>
                My Profile
            </h1>

            <p>
                Manage your personal information.
            </p>

        </div>


        <div class="card">

            <div style="
                display:flex;
                align-items:center;
                gap:15px;
                margin-bottom:25px;
            ">

                <div
                    class="avatar"
                    style="
                        width:65px;
                        height:65px;
                        font-size:18px;
                    "
                >
                    ${getInitials(currentUser.name)}
                </div>

                <div>

                    <h3>
                        ${currentUser.name}
                    </h3>

                    <p style="
                        color:var(--muted);
                        font-size:12px;
                        margin-top:4px;
                    ">
                        AmbuAfrica Patient
                    </p>

                </div>

            </div>


            <div class="input-group">

                <label>
                    Full Name
                </label>

                <input
                    value="${currentUser.name}"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid var(--border);
                        border-radius:10px;
                    "
                >

            </div>


            <div class="input-group">

                <label>
                    Email
                </label>

                <input
                    value="${currentUser.email}"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid var(--border);
                        border-radius:10px;
                    "
                >

            </div>


            <div class="input-group">

                <label>
                    Phone
                </label>

                <input
                    value="${currentUser.phone || '+234 800 000 0000'}"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid var(--border);
                        border-radius:10px;
                    "
                >

            </div>


            <button
                class="primary-btn"
                onclick="showToast('Profile updated successfully.')"
            >

                Save Changes

            </button>

        </div>


        <div class="card">

            <div class="card-header">

                <h3>
                    Emergency Contacts
                </h3>

                <button
                    class="view-btn"
                    onclick="showToast('Emergency contact form opened.')"
                >
                    + Add Contact
                </button>

            </div>


            <p>
                <strong>Mother</strong>
            </p>

            <p style="
                color:var(--muted);
                margin-top:5px;
                font-size:13px;
            ">
                +234 800 000 0000
            </p>

        </div>

    `;

}


/* =====================================================
   MODAL
===================================================== */

function openModal(html) {

    document
        .getElementById("modalContent")
        .innerHTML = html;


    document
        .getElementById("modalOverlay")
        .classList.remove("hidden");

}


function closeModal() {

    document
        .getElementById("modalOverlay")
        .classList.add("hidden");

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");


    const messageElement =
        document.getElementById("toastMessage");


    messageElement.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =====================================================
   SIDEBAR MOBILE
===================================================== */

function toggleSidebar() {

    document
        .querySelector(".sidebar")
        .classList.toggle("open");

}


/* =====================================================
   HOSPITAL PLACEHOLDER
===================================================== */

function renderHospitalPage(page, content) {

    content.innerHTML = `

        <div class="page-header">

            <h1>
                Hospital Dashboard
            </h1>

            <p>
                Hospital functionality will be loaded here.
            </p>

        </div>

        <div class="card">

            <h3>
                🏥 ${currentUser.name}
            </h3>

            <p style="
                color:var(--muted);
                margin-top:10px;
            ">
                Hospital dashboard module ready.
                The emergency request system,
                ambulance management and live tracking
                will be connected in the next module.
            </p>

        </div>

    `;

}


/* =====================================================
   ADMIN PLACEHOLDER
===================================================== */

function renderAdminPage(page, content) {

    content.innerHTML = `

        <div class="page-header">

            <h1>
                Admin Dashboard
            </h1>

            <p>
                AmbuAfrica platform management.
            </p>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-users"></i>
                </div>

                <h3>2,481</h3>

                <p>
                    Total Users
                </p>

            </div>


            <div class="stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-hospital"></i>
                </div>

                <h3>48</h3>

                <p>
                    Hospitals
                </p>

            </div>


            <div class="stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-truck-medical"></i>
                </div>

                <h3>127</h3>

                <p>
                    Ambulances
                </p>

            </div>


            <div class="stat-card">

                <div class="stat-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <h3>12</h3>

                <p>
                    Active Emergencies
                </p>

            </div>

        </div>


        <div class="card">

            <div class="card-header">

                <h3>
                    Recent Emergencies
                </h3>

            </div>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>REQUEST</th>
                            <th>PATIENT</th>
                            <th>EMERGENCY</th>
                            <th>AMBULANCE</th>
                            <th>STATUS</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                <strong>AMB-001024</strong>
                            </td>

                            <td>
                                John Doe
                            </td>

                            <td>
                                Road Accident
                            </td>

                            <td>
                                A-102
                            </td>

                            <td>

                                <span class="status blue">
                                    En Route
                                </span>

                            </td>

                        </tr>


                        <tr>

                            <td>
                                <strong>AMB-001023</strong>
                            </td>

                            <td>
                                Sarah James
                            </td>

                            <td>
                                Breathing Difficulty
                            </td>

                            <td>
                                A-044
                            </td>

                            <td>

                                <span class="status red">
                                    Critical
                                </span>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;

}
