const dataCsv = [['BO', 'Tournament Name', 'Team 1', 'Team 2', 'Date', 'Game', 'TenKeo', 'TenKeoDoi1', 'RateTeam1', 'RateTeam2', 'TenKeoDoi2']]
let game = 'Cả trận'
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getEBClass(e, cl, index = 0) {
    const items = e.getElementsByClassName(cl)
    if (items && items[index]) {
        return items[index]
    } else {
        console.log('co loi xay ra ', e, cl);
        return ''
    }
}

function scrollingAll() {
    const allMatch = document.getElementsByClassName('match-container')
    const a = allMatch[0]
    a.scrollTop = a.scrollHeight
    console.log('aaaaa', a.scrollHeight);
}


function getInfoMatch(e) {
    const item = getEBClass(e, 'match-item')
    const boType = getEBClass(item, 'BO').textContent.trim()
    const nameMatch = getEBClass(item, 'tournament_name').textContent.trim().replaceAll('\n        ', ' ')
    const date = getEBClass(item, 'start_time years').textContent.trim()
    const team1 = getEBClass(item, 'item-name').textContent.trim()
    const team2 = getEBClass(item, 'item-name', 1).textContent.trim()
    return { boType, nameMatch, date, team1, team2 }
}


function getAllKeo(oneLine) {
    const allKeos = document.getElementsByClassName('list-item-page')
    for (let a = 0; a < allKeos.length; a++) {
        const curGame = getEBClass(allKeos[a], 'roundTitle')
        if (curGame && curGame !== game) game = curGame
        const items = allKeos[a].getElementsByClassName('list-item')
        for (let b = 0; b < items.length; b++) {
            const keo = getEBClass(items[b], 'status-title').textContent.trim()
            let team1keo = getEBClass(items[b], 'item-name') ? getEBClass(items[b], 'item-name') : getEBClass(items[b], 'item_name')
            team1keo = team1keo.textContent.trim()
            const rate1 = getEBClass(items[b], 'odds DIN normal')?.textContent?.trim()
            const rate2 = getEBClass(items[b], 'odds DIN normal', 1)?.textContent?.trim()
            let team2keo = getEBClass(items[b], 'item-name', 1) ? getEBClass(items[b], 'item-name', 1) : getEBClass(items[b], 'item_name', 1)
            team2keo = team2keo.textContent.trim()
            const ol = [...oneLine, game, keo, team1keo, rate1, rate2, team2keo]
            dataCsv.push(ol)
            console.log('keqa', keo, team1keo, rate1, rate2, team2keo);
        }

    }
}

function downloadCSV(csvData) {
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function pauseExecution() {
    console.log("Start");
    await sleep(1000);
    const allMatch = document.getElementsByClassName('match-item-box')
    for (let i = 0; i < allMatch.length; i++) {
        await sleep(1000);
        const element = allMatch[i]
        element.click()
        element.style.background = 'red'
        const { boType, nameMatch, date, team1, team2 } = getInfoMatch(element)
        const oneLine = [boType, nameMatch, team1, team2, date]
        await sleep(1000)
        const allGames = document.getElementsByClassName('el-tabs__item is-top')
        for (let j = 0; j < allGames.length; j++) {
            const label = allGames[j].textContent.trim()
            if (label.includes('Cả trận')) {
                allGames[j].click()
                allGames[j].style.background = 'red'
                await sleep(1000);
                getAllKeo(oneLine)
            }
        }
        return
    }
    console.log("Ready to down after 3 seconds");
    downloadCSV(dataCsv)
    
    console.log("End after 3 seconds");
}

pauseExecution();
