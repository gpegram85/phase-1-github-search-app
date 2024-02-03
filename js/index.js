
const formSubmitBtn = document.querySelector('input[name="submit"]')
formSubmitBtn.addEventListener('click', searchUsername)

const userContainer = document.getElementById('github-container')

let isKeywordSearch = true

function searchUsername(e) {
        e.preventDefault()
        const formInput = document.getElementById('search')
        const inputValue = formInput.value

    fetch(`https://api.github.com/search/users?q=${inputValue}`, {
        method: 'GET',
        headers: {
            "Content-Type" : "application/json",
            Accept : "application/vnd.github.v3+json"
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Failed to search: ', response.statusText)
        } else {
            return response.json()
        }
    })
    .then(searchReturnData => {
        const users = searchReturnData.items

        users.forEach(user => {
            const userCard = document.createElement('div')
            userCard.classList.add('card')

            const avatarImg = document.createElement('img')
            avatarImg.src = user.avatar_url
            avatarImg.classList.add('user-avatar')
            avatarImg.alt = user.login + '\'s profile picture'            

            const userLoginName = document.createElement('h4')
            // const reposLink = user.repos_url  
            // userLoginName.innerHTML = `<a href="${reposLink}" target="_blank"> ${user.login}</a>`
            userLoginName.innerText = user.login
            userLoginName.addEventListener('click', dispRepos)

            userCard.appendChild(avatarImg)
            userCard.appendChild(userLoginName)
            userContainer.appendChild(userCard)
        });
    })
    .catch(error => {
        console.error('Error: ', error)
    })
}

function dispRepos(e) {
    const userId = e.target.innerText

    fetch(`https://api.github.com/users/${userId}/repos`, {
        method : 'GET',
        headers : {
            "Content-Type" : "application/json",
            Accept : "application/vnd.github.v3+json"
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Error retrieving repos: ', response.statusText)
        } else {
            return response.json()
        }
    })
    .then(searchReturnData => {
        userContainer.innerHTML= ''
        const ul = document.createElement('ul')

        const ownerLogin = searchReturnData[0].owner.login;
        const avatarLink = searchReturnData[0].owner.avatar_url

        console.log(searchReturnData)

        const userCard = document.createElement('div')
        userCard.classList.add('card')

        const avatarImg = document.createElement('img')
        avatarImg.src = avatarLink
        avatarImg.classList.add('user-avatar')
        avatarImg.alt = ownerLogin + '\'s profile picture'

        const userLoginName = document.createElement('h4')
        userLoginName.innerText = ownerLogin

        userCard.appendChild(avatarImg)
        userCard.appendChild(userLoginName)
        userContainer.appendChild(userCard)

        searchReturnData.forEach(datum => {
            const li = document.createElement('li')
            const repoLink = datum.html_url
            const repoName = datum.name
            li.innerHTML = `<a href=${repoLink}>${repoName}</a>`
            ul.appendChild(li)
        })

        userContainer.appendChild(ul)
        
    })
    .catch(error => {
        console.error('Error: ', error)
    })
}