const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const questionContainer = document.getElementById("questionContainer");
const resultContainer = document.getElementById("resultContainer");

document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const btnRect = noBtn.getBoundingClientRect();
    const btnX = btnRect.left + btnRect.width / 2;
    const btnY = btnRect.top + btnRect.height / 2;

    const distance = Math.hypot(mouseX - btnX, mouseY - btnY);

    if (distance < 100) {
        const newX = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const newY = Math.random() * (window.innerHeight - noBtn.offsetHeight);
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
    }
});

yesBtn.addEventListener("click", () => {
    questionContainer.style.display = "none";
    resultContainer.style.display = "flex";
});
