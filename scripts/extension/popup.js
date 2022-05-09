console.log("loading popup js")
window.addEventListener("DOMContentLoaded", () => {
    console.log("popup js ready")
    document.querySelector("#sudo-vaibhav").addEventListener("click", () => {
        console.log("sudo-vaibhav clicked")
        chrome.tabs.create({ url: 'https://www.linkedin.com/in/vc2001' })
    })
})



