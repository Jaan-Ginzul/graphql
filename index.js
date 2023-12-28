// Check if the user is logged in (you can use more secure methods for this in a real application)
var isLoggedIn = false;
const ns = "http://www.w3.org/2000/svg"

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
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100')
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
    svg.appendChild(circle)

    //convert set of skillnames into array to iterate over it for clock hand names
    skillNames = Array.from(skillNames)
    //create a path to be drawn over skill clock
    const path = document.createElementNS(ns, 'path')
    path.setAttribute('fill', 'rgba(207, 139, 163, 0.9)')
    let constructedPath = ''
    //draws circle, clock lines and skill names
    for (let i = 0; i < 12; i++) {
        //draws a circle and a line
        let group = document.createElementNS(ns, 'g')
        group.classList.add('sector')
        let line = document.createElementNS(ns, 'line')
        let angle = (Math.PI / 6) * i
        let x = 50 + 50 * Math.cos(angle)
        let y = 50 + 50 * Math.sin(angle)
        line.setAttribute("x1", x.toString())
        line.setAttribute("y1", y.toString())
        line.setAttribute("x2", "50")
        line.setAttribute("y2", "50")
        line.setAttribute('stroke', 'rgb(0, 0, 0)')
        line.setAttribute('stroke-width', '0.75')
        group.appendChild(line)

        //draws text near lines
        let text = document.createElementNS(ns, 'text')
        text.setAttribute('x', (50 + 70 * Math.cos(angle)).toString())
        text.setAttribute('y', (50 + 70 * Math.sin(angle)).toString())
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('dominant-baseline', 'middle')
        text.innerHTML = `${skillNames[i]}`

        //generate tooltip to display skill progress with text on hover
        const tooltip = document.createElementNS(ns, 'title')
        tooltip.textContent = `Progress: ${skillProgress.get(skillNames[i])}`
        text.appendChild(tooltip)
        group.appendChild(text)

        //define a path for the current skill to draw path element
        if (i === 0) {
            constructedPath += `M ${50 + 50 * Math.cos(angle) * (skillProgress.get(skillNames[i]) / 100)} ${50 + 50 * Math.sin(angle) * (skillProgress.get(skillNames[i]) / 100)}`
        } else {
            constructedPath += ` L ${50 + 50 * Math.cos(angle) * (skillProgress.get(skillNames[i]) / 100)} ${50 + 50 * Math.sin(angle) * (skillProgress.get(skillNames[i]) / 100)}`
        }

        svg.appendChild(group)
    }
    //append constructed path to the path to be drawn
    path.setAttribute('d', constructedPath)
    svg.appendChild(path)

    wrapper.appendChild(svg)
    wrapper.classList.add('skills')
    return wrapper
}

function displayXpByProject(transactions) {
    const wrapper = document.createElement('article')

    const title = document.createElement('h1')
    title.textContent = 'XP by project'
    wrapper.appendChild(title)

    let projectTransactions = []
    let userXp = 0

    for (const [key, value] of Object.entries(transactions)) {
        if (value.type === 'xp' && !value.path.includes('piscine')) {
            projectTransactions.push(value)
            userXp += value.amount
        }
    }
    console.log(userXp)
    const svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewvBox', '0 0 100 200')

    //y is used to position rectangles on top of each other
    //heigth of each rectangle is subtracted form total heigth of svg viewbox
    //so rectangles can stack on top of each other
    let y = 100
    let height = 100 / projectTransactions.length
    //generates random colours to colour rectangels
    const randomColour = () => { return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` }
    //used to iterate over colours
    for (const [key, value] of Object.entries(projectTransactions)) {
        const group = document.createElementNS(ns, 'g')

        const rect = document.createElementNS(ns, 'rect')
        rect.setAttribute('width', '100')
        rect.setAttribute('height', `${height}`)
        rect.setAttribute('y', `${y -= height}`)
        rect.setAttribute('x', '0')
        rect.setAttribute('fill', `${randomColour()}`)
        rect.addEventListener('mouseover', () => {
            const text = document.createElementNS(ns, 'text')
            text.setAttribute('x', '100')
            text.setAttribute('y', `${rect.getAttribute('y')}`)
            text.textContent = ` - ${value.path.split('/')[3]}: ${value.amount}`
            rect.parentElement.appendChild(text)
        })
        rect.addEventListener('mouseleave', () => {
            const text = Array.from(rect.parentElement.children)
            rect.parentElement.removeChild(text[1])
        })

        const tooltip = document.createElementNS(ns, 'title')
        tooltip.textContent = `${value.path.split('/')[3]}: ${value.amount}`

        rect.appendChild(tooltip)
        group.appendChild(rect)
        svg.appendChild(group)
    }

    wrapper.appendChild(svg)
    wrapper.classList.add('xp')

    const changeColours = document.createElement('button')
    changeColours.innerText = 'Change colours'
    changeColours.addEventListener('click', () => {
        const container = document.querySelector('.xp')
        const rectangles = Array.from(container.querySelectorAll('rect'))
        for (const [key, value] of Object.entries(rectangles)) {
            value.setAttribute('fill', `${randomColour()}`)
        }
    })
    wrapper.appendChild(changeColours)

    const info = document.createElement('p')
    info.textContent = `Total user XP: ${userXp}`
    wrapper.appendChild(info)

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
    //contains sutdent skills
    const skills = displayStudentSkills(data)
    studentInfo.appendChild(skills)

    const projectXp = displayXpByProject(data.transactions)
    studentInfo.appendChild(projectXp)

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