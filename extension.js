console.log('Extension loaded');

$(() => {
    console.log('Extension Initializing..');
    $('#initButton').on('click', () => {
        console.log('Scraping started');
    })
});

function scrapeViewItems() {
    let viewItems = [];

}