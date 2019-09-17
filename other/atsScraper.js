// scraper for https://applyingtoschool.com/forms/ComCol-State.aspx, inject jquery first
function scrapeAllElements() {
    // mark the main <tr> with id main-tr
    var mainTr = $('#main-tr');
    var firstColumn = $(mainTr).children('td')[0];
    var secondColumn = $(mainTr).children('td')[2];
    iterateColumn(firstColumn);
    iterateColumn(secondColumn);
}

function iterateColumn(column) {
    var sectionHeaders = $(column).children('h2');
    var sections = $(column).children('.box2');

    for(let i = 0; i < sectionHeaders.length; i++) {
        if (sectionHeaders[i]) {
            let state = sectionHeaders[i].id;
            let stateFull = sectionHeaders[i].innerText;

            iterateSection(state, stateFull, sections);
        }
    }
}

function iterateSection(state, stateFull, sections) {
    let subSection = $(sections).children('ul');
    let allListItem = subSection.children('li');

    for (let item of allListItem) {
        let font = $(item).children('font');
        let anchors = $(item).find('a');
        if (anchors.length < 1) {
            return;
        } else if (anchors.length === 1) {
            let anchor = anchors[0];
            logTheCollege(state, stateFull, anchor.innerText, anchor.href);
        } else { // this one has different campuses
            let fontAnchors = font.find('a');
            if (fontAnchors.length < 1) { //header campus does not have url
                handleCampusColleges(font[0].innerText, anchors, state, stateFull);
                console.log('Exception: college name ', font[0].innerText);
            } else {
                let collegeTitle = fontAnchors[0].innerText;
                handleCampusColleges(collegeTitle, anchors, state, stateFull);
            }
        }
    }
}

function handleCampusColleges(collegeTitle, anchors, state, stateFull) {
    for (let anchor of anchors) {
        let listName = anchor.innerText;
        let url = anchor.href;

        if (listName.indexOf('college') > -1 || listName.indexOf('College') > -1) {
            // consider it college
            logTheCollege(state, stateFull, listName, url);
        } else {
            // consider it campuses
            logTheCollege(state, stateFull, collegeTitle + ', ' + listName + ' Campus', url);
        }
    }
}

function logTheCollege(state, stateFull, collegeName, url) {
    console.log('State: ', state, ' stateFull: ', stateFull, ' name: ', collegeName, ' url: ', url);
}