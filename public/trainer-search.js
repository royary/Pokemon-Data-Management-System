document.getElementById('trainerSearchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const trainerId = document.getElementById('trainerID').value;
    const resultTable = document.getElementById('resultsTable');
    const tableBody = resultTable.querySelector('tbody');
    const searchResultMsg = document.getElementById('searchResultMsg');

    try {
        const response = await fetch(`/trainer-search/${trainerId}`, {
            method: 'GET'
        });
        const data = await response.json();
        console.log("DATAAAAAAA", data)
        if(data.success && data.data.length > 0) {
            tableBody.innerHTML = '';
            data.data.forEach(([TrainerID, TrainerName, PokemonID, PokemonName])=> {
                const row = document.createElement('tr');
                const TrainerIDCell = document.createElement('td');
                const TrainerNameCell = document.createElement('td');
                const PokemonIDCell = document.createElement('td');
                const PokemonNameCell = document.createElement('td');
                TrainerIDCell.textContent = TrainerID;
                TrainerNameCell.textContent = TrainerName;
                PokemonIDCell.textContent = PokemonID;
                PokemonNameCell.textContent = PokemonName;

                row.appendChild(TrainerIDCell);
                row.appendChild(TrainerNameCell);
                row.appendChild(PokemonIDCell);
                row.appendChild(PokemonNameCell);
                tableBody.appendChild(row);
            });
            resultTable.style.display = 'table';
            searchResultMsg.textContent = '';
            } else {
                resultTable.style.display = 'none';
                searchResultMsg.textContent = 'No Pokémon found for this trainer.';
            }
            } catch (error) {
                console.error('Error:', error);
                resultTable.style.display = 'none';
                alert('Error fetching all Categories Trainers Table data');
            }
});
