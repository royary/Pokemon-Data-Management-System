

const form = document.getElementById('insertDemotable');

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
    }else {
        messageElement.textContent = "Error inserting Data";
    }

}



form.addEventListener("submit", insertDemotable);


const showFormButton = document.getElementById('showFormButton');
showFormButton.addEventListener('click', function() {
    if(form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
})