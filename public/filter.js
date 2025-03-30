let groupCounter = 1;
function addConditionGroup(){
    groupCounter++;
    const filterContainer = document.getElementById('filter-container');
    
    // Create new group operator (AND/OR) before the new group
    const groupOperator = document.createElement('div');
    groupOperator.className = 'group-operator';
    groupOperator.innerHTML = `
        <select class="group-logic-select">
            <option value="OR">OR</option>
            <option value="AND">AND</option>
        </select>
    `;
    const newGroup = document.createElement('div');
    newGroup.className = 'condition-group';
    newGroup.id = `group-${groupCounter}`;
    newGroup.innerHTML = `
        <h3>Condition Group ${groupCounter}</h3>
        <div class="condition">
            <select class="attribute-select">
                <option value="TypeName">TypeName</option>
                <option value="Ability">Ability</option>
                <option value="Weakness">Weakness</option>
                <option value="Strength">Strength</option>
            </select>

            <select class="operator-select">
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
            </select>

            <input type="text" class="value-input" placeholder="Enter value">

            <button class="smallbutton" onclick="removeCondition(this)">Remove</button>
        </div>
    `;
    // Insert the new elements before the add buttons div
    const addButtonsDiv = document.querySelector('.add-buttons');
    filterContainer.insertBefore(groupOperator, addButtonsDiv);
    filterContainer.insertBefore(newGroup, addButtonsDiv);
}

//remove a condition
function removeCondition(button) {
    const condition = button.parentElement;
    const group = condition.parentElement;
    
    // If this is the last condition in the group, remove the entire group
    if (group.querySelectorAll('.condition').length === 1) {
        removeGroup(group);
    } else {
        // Otherwise just remove the individual condition
        condition.remove();
    }
}

// Function to remove an entire condition group
function removeGroup(group) {
    // Don't remove if this is the last group
    const allGroups = document.querySelectorAll('.condition-group');
    if (allGroups.length === 1) {
        return; // Keep at least one group
    }

    // Find and remove the group operator that precedes this group
    const groupOperator = group.previousElementSibling;
    if (groupOperator && groupOperator.className === 'group-operator') {
        groupOperator.remove();
    }

    // Remove the group itself
    group.remove();
}

function buildWhereClause() {
    const group = document.querySelectorAll('.condition-group');
    let whereClause = [];
    group.forEach((group, groupIndex)=>{
    const conditions = group.querySelectorAll('.condition');
    let groupClause = [];
    conditions.forEach((condition, conditionIndex)=>{
        const attribute = group.querySelector('.attribute-select').value;
        const operator = group.querySelector('.operator-select').value;
        const value = group.querySelector('.value-input').value;
        console.log("GGGGG", attribute, operator, value)

        if(value.trim()){
            groupClause.push(`${attribute} ${operator} ${value}`);
            console.log("groupClause", groupClause)
            whereClause.push(groupClause);
        }
        console.log("whereClause", whereClause)
    });
});
    let finalResult = '';
    if(whereClause.length > 0){
        const groupOperator = document.querySelectorAll('.group-logic-select');
        console.log("YYYYYYYYY", groupOperator)
        finalResult = whereClause[0]
        for(let i = 1; i < whereClause.length; i++){
            const operator = groupOperator[i-1].value;
            finalResult += ` ${operator} ${whereClause[i]}`;
        }
    }
    console.log("finalResult", finalResult)
    return finalResult;
}




function getProjectionAttribute(){
    //input = target <input> tags only
    //[name="projectionAttributes"] = only inputs with that specific name
    //:checked = only if the box is currently ticked
    const checkboxes = document.querySelectorAll('input[name="projectionAttributes"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function displayResult(){
return [];
}

async function performSearch(){
    const whereClause = buildWhereClause();
    const projectionAttribute = getProjectionAttribute();
    console.log("WWWWWWWWWW", whereClause)
    try{
        const response = await fetch('/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attribute: projectionAttribute,
                whereClause: whereClause
            })
        });

        const responseData = await response.json();
    
        if(responseData.success) {
            displayResult(responseData.data, projectionAttribute);
        }else {
           alert('Error performing search. Please try again.')
        }  
    } catch(error){
        console.error('Error:', error);
        alert('An error occured while searching. Please try again.')
    }
}