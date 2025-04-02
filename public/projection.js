function displayResult(data, projectionAttribute){
    const resultsContainer = document.getElementById('resultsContainer');
    if(!data || data.length === 0) {
        resultsContainer.textContent = 'No results found.';
        resultsContainer.style.display = 'block';
        return;
    }
    const headerNames = projectionAttribute.map(attribute => attribute.split('.')[1]);
    let resultText = headerNames.join(' | ') + '\n';
    resultText += '-'.repeat(resultText.length) + '\n';
    
    data.forEach(row => {
        resultText += row.join(' | ') + '\n';
    });
    resultsContainer.textContent = resultText;
    resultsContainer.style.display = 'block';
}

async function performSearch() {
    const checkboxes = document.querySelectorAll('input[name="projectionAttributes"]:checked');
    if (checkboxes.length == 0) {
        alert("Please select at least one attribute.");
        return;
    }

    const selectedValues = Array.from(checkboxes).map(checkboxes => checkboxes.value);

    try {
        const response = await fetch('/projection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ attribute: selectedValues })
        });
        
        const data = await response.json();
        if (data.success) {
            displayResult(data.data, selectedValues);
        } else {
            alert("ERROR");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("ERROR");
    }
}