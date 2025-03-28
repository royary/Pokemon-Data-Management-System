


async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const response = await fetch('/check-db-connection', {
        method: "GET"
    }); 
}



window.onload = function() {
    checkDbConnection();
}