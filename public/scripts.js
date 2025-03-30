



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

async function deleteIDTable(event){
    event.preventDefault();
    const deleteValue = document.getElementById('deleteId').value;
    const response = await fetch('/deleteId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: deleteValue
        })
    });
    console.log(response);

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if(responseData.success) {
        messageElement.textContent = "Delete Pokemon by ID successfully";
        fetchAndDisplayUsers();
    }else {
        messageElement.textContent = "Error Delete Pokemon by ID";
    }

}


async function insertDemotable(event){
    event.preventDefault();
    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;
    const typeValue = document.getElementById('insertType').value;
    const genderValue = document.getElementById('insertGender').value;
    const abilityValue = document.getElementById('insertAbility').value;
    const trainerValue = document.getElementById('insertTrainer').value;
    console.log("I'm at script.js");
    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue,
            type: typeValue,
            gender: genderValue,
            ability: abilityValue,
            trainer: trainerValue
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
const deleteTableID = document.getElementById('deleteTable');
const resetDemotableForm = document.getElementById('resetDemotable');
const updateTableForm = document.getElementById('updateTable');

resetDemotableForm.addEventListener("click", resetDemotable);
insertDemotableForm.addEventListener("submit", insertDemotable);
deleteTableID.addEventListener("submit", deleteIDTable);
updateTableForm.addEventListener("submit", updateTable)

const showUpdateFormButton = document.getElementById('showUpdateFormButton');
showUpdateFormButton.addEventListener('click', function() {
    if(updateTableForm.style.display === 'none') {
        updateTableForm.style.display = 'block';
    } else {
        updateTableForm.style.display = 'none';
    }
})

const showAvgAttackButton = document.getElementById('showAvgAttackButton');
showAvgAttackButton.addEventListener('click', async function(event) {
    event.preventDefault();
    const table = document.getElementById('avgAttackTable');
    const tableBody = table.querySelector('tbody');
    if(table.style.display === 'none'){
    try {
    const response = await fetch('/avgAttackTable', {
        method: 'GET'
    });
    const data = await response.json();
    if(data.success) {
    tableBody.innerHTML = '';
    data.data.forEach(([type, avgAttach])=> {
        const tr = document.createElement('tr');
        const typeCell = document.createElement('th');
        const avgAttachCell = document.createElement('th');
        typeCell.textContent = type;
        avgAttachCell.textContent = avgAttach;
        tr.appendChild(typeCell);
        tr.appendChild(avgAttachCell);
        tableBody.appendChild(tr);
    });
    table.style.display = 'table';
    } 
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching average attack data');
    }
} else {
    table.style.display = 'none';
}
});


const showHighDefenseButton = document.getElementById('showHighDefenseButton');
showHighDefenseButton.addEventListener('click', async function(event) {
    event.preventDefault();
    const table = document.getElementById('highDefenseTable');
    const tableBody = table.querySelector('tbody');
    if(table.style.display === 'none'){
    try {
    const response = await fetch('/highDefenseTable', {
        method: 'GET'
    });
    const data = await response.json();
    if(data.success) {
    tableBody.innerHTML = '';
    data.data.forEach(([type, highDefense])=> {
        const tr = document.createElement('tr');
        const typeCell = document.createElement('th');
        const highDefenseCell = document.createElement('th');
        typeCell.textContent = type;
        highDefenseCell.textContent = highDefense;
        tr.appendChild(typeCell);
        tr.appendChild(highDefenseCell);
        tableBody.appendChild(tr);
    });
    table.style.display = 'table';
    } 
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching high defense data');
    }
} else {
    table.style.display = 'none';
}
});

const showStrongTrainersButton = document.getElementById('showStrongTrainersButton');
showStrongTrainersButton.addEventListener('click', async function(event) {
    event.preventDefault();
    const table = document.getElementById('strongTrainersTable');
    const tableBody = table.querySelector('tbody');
    if(table.style.display === 'none'){
    try {
    const response = await fetch('/strongTrainersTable', {
        method: 'GET'
    });
    const data = await response.json();
    if(data.success) {
    tableBody.innerHTML = '';
    data.data.forEach(([name, strongTrainer])=> {
        const tr = document.createElement('tr');
        const nameCell = document.createElement('th');
        const strongTrainerCell = document.createElement('th');
        nameCell.textContent = name;
        strongTrainerCell.textContent = strongTrainer;
        tr.appendChild(nameCell);
        tr.appendChild(strongTrainerCell);
        tableBody.appendChild(tr);
    });
    table.style.display = 'table';
    } 
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching strong Trainers data');
    }
} else {
    table.style.display = 'none';
}
});

const showAllCategoriesTrainersButton = document.getElementById('showAllCategoriesTrainersButton');
showAllCategoriesTrainersButton.addEventListener('click', async function(event) {
    event.preventDefault();
    const table = document.getElementById('allCategoriesTrainersTable');
    const tableBody = table.querySelector('tbody');
    if(table.style.display === 'none'){
    try {
    const response = await fetch('/allCategoriesTrainersTable', {
        method: 'GET'
    });
    const data = await response.json();
    if(data.success) {
    tableBody.innerHTML = '';
    data.data.forEach(([name])=> {
        const tr = document.createElement('tr');
        const nameCell = document.createElement('th');
        nameCell.textContent = name;
        tr.appendChild(nameCell);
        tableBody.appendChild(tr);
    });
    table.style.display = 'table';
    } 
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching all Categories Trainers Table data');
    }
} else {
    table.style.display = 'none';
}
});

const showFormButton = document.getElementById('showFormButton');
showFormButton.addEventListener('click', function() {
    if(insertDemotableForm.style.display === 'none') {
        insertDemotableForm.style.display = 'block';
    } else {
        insertDemotableForm.style.display = 'none';
    }
})


const deleteButton = document.getElementById('deleteButton');
deleteButton.addEventListener('click', function() {
    if(deleteTableID.style.display === 'none') {
        deleteTableID.style.display = 'block';
    } else {
        deleteTableID.style.display = 'none';
    }
})