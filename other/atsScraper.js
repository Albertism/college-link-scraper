// scraper for https://applyingtoschool.com/forms/ComCol-State.aspx, inject jquery first
var collegeArray = [];

function scrapeAllElements() {
    // before executing: mark the main <tr> with id main-tr
    var mainTr = $('#main-tr');
    var firstColumn = $(mainTr).children('td')[0];
    var secondColumn = $(mainTr).children('td')[2];
    iterateColumn(firstColumn);
    iterateColumn(secondColumn);
    let encodedCSV = arrayToCSV(collegeArray);
    downloadCSV(encodedCSV)
}

function arrayToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return array.reduce((str, next) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
        return str;
    }, str);
}

function downloadCSV(csv) {
    console.log('csv: ', csv);
    let link = document.createElement('a');
    link.id = 'download-csv';
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', 'community_college_master_list.csv');
    document.body.appendChild(link);
    document.querySelector('#download-csv').click();
}


function iterateColumn(column) {
    var sectionHeaders = $(column).children('h2');
    var sections = $(column).children('.box2');

    for(let i = 0; i < sectionHeaders.length; i++) {
        if (sectionHeaders[i]) {
            let state = sectionHeaders[i].id;
            let stateFull = sectionHeaders[i].innerText;
            console.log('STATE ', state, ' : SECTION', sections[i]);

            iterateSection(state, stateFull, sections, i);
        }
    }
}

function iterateSection(state, stateFull, sections, sectionIndex) {
    let subSection = $($(sections[sectionIndex]).children('ul'));
    let allListItem = subSection.children('li');

    for (let item of allListItem) {
        let font = $(item).children('font');
        let anchors = $(item).find('a');
        if (anchors.length < 1) {
            return;
        } else if (anchors.length === 1) {
            let anchor = anchors[0];
            logCollege(state, stateFull, anchor.innerText, anchor.href);
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
            logCollege(state, stateFull, listName, url);
        } else {
            // consider it campuses
            logCollege(state, stateFull, collegeTitle + ', ' + listName + ' Campus', url);
        }
    }
}

function logCollege(state, stateFull, collegeName, url) {
    let collegeObject = {
        state: state,
        stateFull: stateFull,
        name: collegeName,
        url: url
    };
    collegeArray.push(collegeObject);
}