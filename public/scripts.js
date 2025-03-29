



async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('viewTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/viewTable', {
        method: 'GET'
    });
    const responseData = await response.json();
    const demotableContent = responseData.data;

    if(tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function resetDemotable(){
const response = await fetch('/initiate-demotable', {
    method: 'POST'
});
const responseData = await response.json();

if(responseData.success) {
    const messageElement = document.getElementById('resetResultMsg');
    messageElement.textContent = "table initiated successfully";
    fetchAndDisplayUsers();
} else {
    alert("Error initiating Table");
}
}



async function insertDemotable(event){
    event.preventDefault();
    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;
    console.log("I'm at script.js");
    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });
    console.log(response);

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if(responseData.success) {
        messageElement.textContent = "Data inserted successfully";
        fetchAndDisplayUsers();
    }else {
        messageElement.textContent = "Error inserting Data";
    }

}

async function updateTable(event){
    event.preventDefault();
    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;
    const response = await fetch('/update-table', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldname:oldNameValue,
            newname:newNameValue
        })
    });
    const responseData = await response.json();
    if(responseData.success) {
        const messageElement = document.getElementById('updateResultMsg');
        messageElement.textContent = "table update successfully";
        fetchAndDisplayUsers();
    } else {
        alert("Error update Table");
    }

}

const filterSystemButton = document.getElementById('filterSystemButton');
filterSystemButton.addEventListener('click', function() {
    window.location.href = '/filter.html';
});

const trainerSearch = document.getElementById('trainerSearch');
trainerSearch.addEventListener('click', function() {
    window.location.href = '/trainer-search.html';
});

window.onload = function() {
    fetchAndDisplayUsers();
    console.log("I'm refreshing!!!")

}


const insertDemotableForm = document.getElementById('insertDemotable');
const resetDemotableForm = document.getElementById('resetDemotable');
const updateTableForm = document.getElementById('updateTable');

resetDemotableForm.addEventListener("click", resetDemotable);
insertDemotableForm.addEventListener("submit", insertDemotable);
updateTableForm.addEventListener("submit", updateTable)

const showUpdateFormButton = document.getElementById('showUpdateFormButton');
showUpdateFormButton.addEventListener('click', function() {
    if(updateTableForm.style.display === 'none') {
        updateTableForm.style.display = 'block';
    } else {
        updateTableForm.style.display = 'none';
    }
})

const showFormButton = document.getElementById('showFormButton');
showFormButton.addEventListener('click', function() {
    if(insertDemotableForm.style.display === 'none') {
        insertDemotableForm.style.display = 'block';
    } else {
        insertDemotableForm.style.display = 'none';
    }
})