// Dark mode toggle
const themeToggle = document.getElementById("theme-toggle")
const body = document.body

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode")
  const icon = themeToggle.querySelector("i")
  if (body.classList.contains("dark-mode")) {
    icon.classList.replace("fa-moon", "fa-sun")
  } else {
    icon.classList.replace("fa-sun", "fa-moon")
  }
})

// GitHub Repositories
const reposContainer = document.getElementById("repos-container")
const prevPageBtn = document.getElementById("prev-page")
const nextPageBtn = document.getElementById("next-page")
const pageInfo = document.getElementById("page-info")
const username = "esubaalew"
const perPage = 6
let currentPage = 1

async function fetchRepos(page) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`)
    const repos = await response.json()
    const totalCount = Number.parseInt(response.headers.get("X-Total-Count"), 10)
    return { repos, totalCount }
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error)
    return { repos: [], totalCount: 0 }
  }
}

function displayRepos(repos) {
  reposContainer.innerHTML = ""
  repos.forEach((repo) => {
    const repoCard = document.createElement("div")
    repoCard.className = "project-card"

    repoCard.innerHTML = `
            <div class="project-image" style="background-image: url('https://opengraph.githubassets.com/1/${username}/${repo.name}')"></div>
            <div class="project-info">
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description available."}</p>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
            </div>
        `

    reposContainer.appendChild(repoCard)
  })
}

async function updatePage(page) {
  const { repos, totalCount } = await fetchRepos(page)
  displayRepos(repos)

  const totalPages = Math.ceil(totalCount / perPage)
  pageInfo.textContent = `Page ${page} of ${totalPages}`

  prevPageBtn.disabled = page === 1
  nextPageBtn.disabled = page === totalPages

  currentPage = page
}

prevPageBtn.addEventListener("click", () => updatePage(currentPage - 1))
nextPageBtn.addEventListener("click", () => updatePage(currentPage + 1))

// Initial load
updatePage(1)

// Intersection Observer for fade-in animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
      }
    })
  },
  { threshold: 0.1 },
)

document.querySelectorAll("section").forEach((section) => {
  observer.observe(section)
})

