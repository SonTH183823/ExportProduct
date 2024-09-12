function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollingAll() {
    const allMatch = document.getElementsByClassName('match-container')
    const a = allMatch[0]
    a.scrollTop = a.scrollHeight
    console.log('aaaaa', a.scrollHeight);
}

function clickOneMatch(e, index) {
    e.click()
    setTimeout(() => {
        console.log('click', index);
    }, 4000)
}

async function pauseExecution() {
    console.log("Start");
    await sleep(1000);
    const allMatch = document.getElementsByClassName('match-item-box')
    for (let i = 0; i < allMatch.length; i++) {
        await sleep(1000);
        allMatch[i].click()
        // allMatch[i].style.background = 'red'
        await sleep(1000)
        const allGames = document.getElementsByClassName('el-tabs__item is-top')
        for (let j = 0; j < allGames.length; j++) {
            const label = allGames[j].innerHTML
            if (label.includes('Ván')) {
                allGames[j].click()
                // allGames[j].style.background = 'red'
                await sleep(1000);
            }
        }
    }
    console.log("End after 3 seconds");
}

pauseExecution();
