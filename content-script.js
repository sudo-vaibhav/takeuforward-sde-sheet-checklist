console.log("content script loaded");
const sdeSheetURL = "strivers-sde-sheet-top-coding-interview-problems"
const uniqueMarker = "sde-sheet-marker"
const version = "v0"

const getMarker = () => {
    return uniqueMarker + "-" + version
}

const getProgressObject = () => {
    return JSON.parse(window.localStorage.getItem(getMarker())) || {}
}

const saveSheetProgress = (solvedProblemsObject) => {
    window.localStorage.setItem(getMarker(), JSON.stringify(solvedProblemsObject))
}

const getProblemId = (problemElement) => {
    return problemElement.textContent.trim()
}

const getProblemCell = (problem) => {
    return problem.querySelector("td")
}

const renderProgress = (problemsProgress) => {
    const questionCategories = document.querySelectorAll("details")
    let totalProblems = 0;
    let solvedProblems = 0;
    questionCategories.forEach(category => {
        const categoryHeading = category.querySelector("summary")
        const categoryProblems = category.querySelectorAll("table tr:not(:first-child)")
        let solvedInCategoryCount = 0
        categoryProblems.forEach(problem => {
            problemId = getProblemId(getProblemCell(problem))
            console.log("category problem id", problemId)
            if (problemsProgress[problemId] === true) {
                solvedInCategoryCount++;
            }
        })

        totalProblems += categoryProblems.length;
        solvedProblems += solvedInCategoryCount;
        solvedText = ` (Solved ${solvedInCategoryCount}/${categoryProblems.length} )`
        if (categoryHeading.querySelector(".solved-problems-count")) {
            categoryHeading.querySelector(".solved-problems-count").innerHTML = solvedText
        }
        else {

            categoryHeading.insertAdjacentHTML("beforeend",
                `<span class="solved-problems-count">${solvedText}</span>`
            )
        }
    })

    document.querySelector("#overall-progress")?.remove()
    const overallProgressDiv = `
        <div id="overall-progress" style="font-weight:bold;position:fixed;top:25vh;right:10vw; background:#ed4d33;color:white; padding:2rem;">
            Overall Solved ${solvedProblems}/${totalProblems}
        </div>
    `
    document.querySelector("#secondary").insertAdjacentHTML("beforeend", overallProgressDiv)
}
if (window.location.href.includes(sdeSheetURL)) {
    console.log("sde sheet page loaded")
    const problemsProgress = getProgressObject()
    renderProgress(problemsProgress)


    const problems = document.querySelectorAll("details table tr:not(:nth-child(1))")
    problems.forEach(problem => {
        const problemCell = getProblemCell(problem)
        const problemId = getProblemId(problemCell)
        const checkBoxHtml = `
            <input type="checkbox" id="${problemId}" ${problemsProgress[problemId] == true ? "checked" : ""}/>
        `
        problemCell.insertAdjacentHTML("afterbegin", checkBoxHtml)

        problem.querySelector("input").addEventListener("change", (e) => {
            let problemDone = false
            if (e.target.checked) {
                problemDone = true
            }

            solvedProblems = getProgressObject()
            solvedProblems[problemId] = problemDone
            renderProgress(solvedProblems)
            saveSheetProgress(solvedProblems)


        })
    })
}