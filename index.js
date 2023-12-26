// Check if the user is logged in (you can use more secure methods for this in a real application)
var isLoggedIn = false;

function checkLogin() {
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    if (email.value === '' || password.value === '') {
        return false
    }
    else {
        return true
    }

}

function login() {
    // Perform login logic (you can add your authentication logic here)

    // For demonstration purposes, set isLoggedIn to true
    isLoggedIn = true;

    //since login elements are hidden we need to clear them
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    email.value = '';
    password.value = '';
    // Update the UI based on the login status
    updateUI();

}

function logout() {
    // Perform logout logic

    // For demonstration purposes, set isLoggedIn to false
    isLoggedIn = false;

    // Update the UI based on the login status
    updateUI();
}

function updateUI() {
    var loginContainer = document.getElementById('login-container');
    var contentContainer = document.getElementById('content-container');
    // var content = document.getElementById('main')

    // Show or hide elements based on the login status
    if (isLoggedIn) {
        loginContainer.style.display = 'none';
        contentContainer.style.display = 'block';
    } else {
        loginContainer.style.display = 'block';
        contentContainer.style.display = 'none';
        // Clear content when logging out
        const body = document.querySelector('body');
        const main = document.querySelector('main');
        body.removeChild(main);
        localStorage.removeItem('jwt_token');
    }
}

function displayProfileInfo(id, username, attributes) {
    const profileInfoContainer = document.createElement('article')
    const userInfoWrapper = document.createElement('ul')

    const uId = document.createElement('li')
    uId.innerText = `Student id: ${id}`
    userInfoWrapper.appendChild(uId)
    const uName = document.createElement('li')
    uName.innerText = `Username: ${username}`
    userInfoWrapper.appendChild(uName)

    for (const [key, value] of Object.entries(attributes)) {
        switch (key) {
            default:
                continue
                break;
            case 'firstName':
                const firstName = document.createElement('li')
                firstName.innerText = `First name: ${value}`
                userInfoWrapper.appendChild(firstName)
                break;
            case 'lastName':
                const lastName = document.createElement('li')
                lastName.innerText = `Last name: ${value}`
                userInfoWrapper.appendChild(lastName)
                break;
            case 'country':
                const country = document.createElement('li')
                country.innerText = `Country: ${value}`
                userInfoWrapper.appendChild(country)
                break;
            case 'email':
                const email = document.createElement('li')
                email.innerText = `Email: ${value}`
                userInfoWrapper.appendChild(email)
                break;
            case 'nationality':
                const nationality = document.createElement('li')
                nationality.innerText = `Nationality: ${value}`
                userInfoWrapper.appendChild(nationality)
                break;
        }
    }

    profileInfoContainer.appendChild(userInfoWrapper)
    profileInfoContainer.classList.add('userInfo')
    return profileInfoContainer
}

//creates skills element
function displayStudentSkills(data) {
    const wrapper = document.createElement('article')
    let skills = []
    let skillNames = new Set()
    let skillProgress = new Map
    //store transactions related to skills and names of skills
    for (const [key, value] of Object.entries(data.transactions)) {
        if (value.type.includes('skill')) {
            skills.push(value)
            skillNames.add(value.type.split('skill_')[1])
        }
    }

    //save only highest values in respective skills
    for (const [key, value] of Object.entries(skills)) {
        const skillName = value.type.split('skill_')[1]
        const skillProgression = value.amount
        if (skillNames.has(skillName)) {
            if (skillProgress.has(skillName) && skillProgress.get(skillName) < skillProgression) {
                skillProgress.set(skillName, skillProgression)
            } else if (!skillProgress.has(skillName)) {
                skillProgress.set(skillName, skillProgression)
            }
        }
    }

    //Started working on a circle with lines for 12 different skills
    const ns = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', ' 0 0 100 100')
    svg.setAttribute('style', 'overflow: visible')
    // svg.classList.add("skills")
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('fill', 'none')
    circle.setAttribute('stroke', 'rgb(0, 0, 0)')
    circle.setAttribute('stroke-width', '0.75')
    circle.setAttribute('cx', '50')
    circle.setAttribute('cy', '50')
    circle.setAttribute('r', '50')
    console.log(skillProgress)

}

function displayAuditRatio(auditXpDown, auditXpUp) {
    const wrapper = document.createElement('article')
    wrapper.classList.add('auditRatio')
    const ratio = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(auditXpUp / auditXpDown)
    const heading = document.createElement('h1')
    heading.innerText = 'Audits ratio'
    wrapper.appendChild(heading)
    let roundedXpUp
    let roundedXPDown

    //rounding xp into readable format
    if (auditXpUp.toString().length >= 6) {
        roundedXpUp = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(parseInt(auditXpUp))
    } else {
        roundedXpUp = Intl.NumberFormat("en", { notation: "compact", maximumSignificantDigits: 3 }).format(parseInt(auditXpUp))
    }
    if (auditXpDown.toString().length >= 6) {
        roundedXPDown = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(parseInt(auditXpDown))
    } else {
        roundedXPDown = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(parseInt(auditXpDown))
    }

    const done = document.createElement('p')
    done.innerText = `Done ${roundedXpUp}`
    wrapper.appendChild(done)
    const recieved = document.createElement('p')
    recieved.innerText = `Received ${roundedXPDown}`
    wrapper.appendChild(recieved)

    const displayRatio = document.createElement('p')
    displayRatio.innerText = `Your audit ratio: ${ratio}`
    wrapper.appendChild(displayRatio)

    return wrapper
}

function displayUserData(data) {
    //entire page
    const page = document.querySelector('body')
    //container containing all info which is divided in 3 parts
    const studentInfo = document.createElement('main')
    studentInfo.classList.add('parent')
    page.appendChild(studentInfo)
    //contains student profile info
    const profile = displayProfileInfo(data.id, data.login, data.attrs)
    studentInfo.appendChild(profile)

    const audit = displayAuditRatio(data.totalDown, data.totalUp)
    studentInfo.appendChild(audit)
    //contains sutdent skills
    const skills = displayStudentSkills(data)
    studentInfo.appendChild(skills)
    if (isLoggedIn === false) {
        studentInfo.remove()
    }
}

async function fetchServerData() {
    const query = `
                    query {
                        user {
                            id
                            login
                            attrs
                            totalUp
                            totalDown
                            createdAt
                            updatedAt
                            transactions(order_by: { createdAt: asc }) {
                                id
                                userId
                                type
                                amount
                                createdAt
                                path
                            }
                        }
                    }`;

    await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ query })
    }).then(response => {
        if (!response.ok) {
            console.log('query problem', response)
        } else {
            return response.json()
        }
    }).then(data => {
        console.log(data)
        console.log(data.data.user)
        displayUserData(data.data.user[0])
    }).catch(error => {
        console.log(error)
    })
};

document.getElementById('login-submit').addEventListener('click', async (e) => {
    e.preventDefault()

    if (checkLogin()) {
        await fetch('https://01.kood.tech/api/auth/signin', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${document.getElementById('login-email').value}:${document.getElementById('login-password').value}`)}`
            }
        }).then(response => {
            if (response.status != 200) {
                console.log(response)
                throw new Error('Trouble logging in. Please try again.')
            } else {
                return response.json()
            }
        }).then(token => {
            //update login form UI after successful fetch
            login()
            localStorage.setItem('jwt_token', token)
            fetchServerData()
        }).catch(error => {
            alert(error.message)
        })
    } else {
        alert('Invalid login credentials. Please try logging again.')
    }
});