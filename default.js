const webPages = ["index", "me", "chess", "quiz"];
const webPageButtons = ["Home", "My Works", "Chess", "Quiz"];
const topBar = document.createElement("div");
const sideBar = document.createElement("div");
const logo = document.createElement("img");
const inner = document.createElement("div");

logo.src = "logo.png";
logo.width = "50px";
logo.height = "50px";
logo.alt = "Logo";
logo.className = "logo";

inner.className = "inner";
topBar.className = "topbar";
sideBar.className = "sidebar";

document.body.appendChild(topBar);
document.body.appendChild(sideBar);
topBar.appendChild(inner);
topBar.appendChild(logo);

for (let webPage in webPages) {
    const link = document.createElement("a");

    link.href = webPages[webPage] + ".html";
    link.className = "topbarbutton"
    link.innerHTML = webPageButtons[webPage];

    inner.appendChild(link);
}