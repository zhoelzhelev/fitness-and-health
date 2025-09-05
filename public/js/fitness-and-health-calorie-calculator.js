window.addEventListener("load", solve);

function solve(){
    
    const calculateBtn = document.querySelector('#calculate');
    calculateBtn.addEventListener('click', e => {
        e.preventDefault();
        const ageEl = Number(document.querySelector('#age').value);
        const heightEl = Number(document.querySelector('#height').value);
        const weightEl = Number(document.querySelector('#weight').value);
        const activityLevelEl = document.querySelector('#activity').value;
        if(! ageEl || ! heightEl || ! weightEl || ! activityLevelEl) return;
        let multiplierFactor = 0;
        if(activityLevelEl === 'sedentary') multiplierFactor = 1.2;
        else if(activityLevelEl === 'light') multiplierFactor = 1.375;
        else if(activityLevelEl === 'moderate') multiplierFactor = 1.465;
        else if(activityLevelEl === 'active') multiplierFactor = 1.55;
        else if(activityLevelEl === 'very-active') multiplierFactor = 1.725;
        else multiplierFactor = 1.9;
        
        const genderEl = document.querySelector('input[name="sex"]:checked').value;
        let maintainingCalories = 0;
        if(genderEl === 'Male'){
            maintainingCalories = (10 * weightEl + 6.25 * heightEl - 5 * ageEl + 5) * multiplierFactor;
        }else{
            maintainingCalories = (10 * weightEl + 6.25 * heightEl - 5 * ageEl - 161) * multiplierFactor;
        }
        

        document.querySelector('.calculated-results').style.display = 'inline';
        document.querySelector('.maintaining-calories p').textContent = `${Math.round(maintainingCalories)} калории`;
        document.querySelector('.maintaining-calories .add-btn').dataset.calories = Math.round(maintainingCalories);
        document.querySelector('.mild-weight-loss p').textContent = `${Math.round(maintainingCalories - 250)} калории`;
        document.querySelector('.mild-weight-loss .add-btn').dataset.calories = Math.round(maintainingCalories - 250);
        document.querySelector('.normal-weight-loss p').textContent = `${Math.round(maintainingCalories - 500)} калории`;
        document.querySelector('.normal-weight-loss .add-btn').dataset.calories = Math.round(maintainingCalories - 500);
        document.querySelector('.extreme-weight-loss p').textContent = `${Math.round(maintainingCalories - 1000)} калории`;
        document.querySelector('.extreme-weight-loss .add-btn').dataset.calories = Math.round(maintainingCalories - 1000);
    })

    const deleteBtn = document.querySelector('#clear');
    deleteBtn.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('#age').value = '';
        document.querySelector('#height').value = '';
        document.querySelector('#weight').value = '';
        document.querySelector('#activity').value = '';
        document.querySelector('input[name="sex"]:checked').value = 'Male';
        document.querySelector('.calculated-results').style.display = 'none';
    })


    const calConverterTypeEl = document.querySelector('#fconvert');

    console.log('h1');

    calConverterTypeEl.addEventListener('input', e => {
        console.log('h2');

        const measurementName = document.querySelector('#fconvert-options').value;

        let measurementTable = new Map();

        measurementTable.set('calorie', 1);
        measurementTable.set('joules', 4.18400);
        measurementTable.set('kilojoules', 0.004184);

        const measurementNumbers = calConverterTypeEl.value;
        const measurementNumbersToCal = measurementNumbers / measurementTable.get(measurementName);

        const measurementNameAnswear = document.querySelector('#sconvert-options').value;
        
        let answear = measurementNumbersToCal * measurementTable.get(measurementNameAnswear);
        answear = answear.toFixed(3);

        document.querySelector('#answear').textContent = answear;

    });


    const usernameTag = document.querySelector('#username');
    const userInfo = document.querySelector('.profile-hidden-info');

    usernameTag.addEventListener('mouseenter', e => {

        userInfo.style.display = 'flex';
    });

    userInfo.addEventListener('mouseenter', e => {
        userInfo.style.display = 'flex';
    });

    userInfo.addEventListener('mouseleave', e => {

        userInfo.style.display = 'none';
    });


   document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault();

        const calories = button.dataset.calories;
        try {
            const response = await fetch('/set-calories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calories }),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.dailyCalories !== undefined) {
                alert(`Целта е запазена: ${data.dailyCalories} калории`);
            }
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    });
}
)}