const dataCsv = [['BO', 'Tournament Name', 'Team 1', 'Team 2', 'Date', 'Game', 'TenKeo', 'TenKeoDoi1', 'RateTeam1', 'RateTeam2', 'TenKeoDoi2']]
let game = ''
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getTextEBClass(e, cl, index = 0, isText = true) {
    const items = e.getElementsByClassName(cl)
    if (items && items[index]) {
        return isText ? items[index]?.textContent?.trim() : items[index]
    } else {
        console.log('co loi xay ra TEXT', e, cl);
        return ''
    }
}

function getInfoMatch(e) {
    const item = getTextEBClass(e, 'match-item', 0, false)
    const boType = getTextEBClass(item, 'BO')
    const nameMatch = getTextEBClass(item, 'tournament_name').replaceAll('\n        ', ' ')
    const date = getTextEBClass(item, 'start_time years')
    const team1 = getTextEBClass(item, 'item-name')
    const team2 = getTextEBClass(item, 'item-name', 1)
    return { boType, nameMatch, date, team1, team2 }
}


function getAllKeo(oneLine) {
    const allKeos = document.getElementsByClassName('list-item-page')
    for (let a = 0; a < allKeos.length; a++) {
        const curGame = getTextEBClass(allKeos[a], 'roundTitle')
        if (curGame && curGame !== game) {
            return
        }
        const items = allKeos[a].getElementsByClassName('list-item')
        for (let b = 0; b < items.length; b++) {
            const keo = getTextEBClass(items[b], 'status-title')
            const containL = items[b].getElementsByClassName('contain-left')[0]
            const containR = items[b].getElementsByClassName('contain-right')
            const listContainInL = containL.getElementsByClassName('contain')
            let listContainInR
            let hasRight = false
            if(containR && containR.length) {
                hasRight = true
                listContainInR = containR[0].getElementsByClassName('contain')
            }
            for (let c = 0; c < listContainInL.length; c++) {
                const team1keo = getTextEBClass(listContainInL[c], 'item-name') ? getTextEBClass(listContainInL[c], 'item-name') : getTextEBClass(listContainInL[c], 'item_name')
                const rate1 = getTextEBClass(listContainInL[c], 'odds DIN normal')
                const rate2 = hasRight ? getTextEBClass(listContainInR[c], 'odds DIN normal') : ''
                const team2keo = hasRight ? getTextEBClass(listContainInR[c], 'item-name') ? getTextEBClass(listContainInR[c], 'item-name') : getTextEBClass(listContainInR[c], 'item_name') ? getTextEBClass(listContainInR[c], 'item_name') : '' : ''
                const ol = [...oneLine, game, keo, team1keo.replace('-', ':'), rate1, rate2, team2keo.replace('-', ':')]
                dataCsv.push(ol)
                console.log('Kêt quả', keo, team1keo, rate1, rate2, team2keo);
            }
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
        const element = allMatch[i]
        element.click()
        element.style.background = 'red'
        const { boType, nameMatch, date, team1, team2 } = getInfoMatch(element)
        const oneLine = [boType, nameMatch, team1, team2, date]
        await sleep(1000)
        const allGames = document.getElementsByClassName('el-tabs__item is-top')
        for (let j = 0; j < allGames.length; j++) {
            const label = allGames[j].textContent.trim()
            if (label.includes('Cả trận') || label.includes('Ván')) {
                game = label
                allGames[j].click()
                allGames[j].style.background = 'red'
                await sleep(1000);
                getAllKeo(oneLine)
            }
        }
        await sleep(1000);
    }
    downloadCSV(dataCsv)
    console.log("End after 3 seconds");
}

pauseExecution();
