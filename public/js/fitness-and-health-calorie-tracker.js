window.addEventListener("load", solve);

function solve(){
    const aHrefItems = document.querySelectorAll('.breakfast-container a');

    aHrefItems.forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            aHrefItems.forEach(a => {
                a.style.pointerEvents = 'none';
            })

            document.querySelector('.food-search-bar').style.display = 'flex';
        });
    })

    const clearButton = document.querySelector('#clear-food-button');

    clearButton.addEventListener('click', e => {
        e.preventDefault();

        aHrefItems.forEach(a => {
            a.style.pointerEvents = 'auto';
        })

        document.querySelector('.food-search-bar').style.display = 'none';

    })

    const inputSearchBar = document.querySelector('#food-search-form');

    inputSearchBar.addEventListener('submit', e => {
        e.preventDefault();
        console.log('here');
        const queryFood = inputSearchBar.querySelector('#search-food').value.toLowerCase();
        console.log(queryFood);
        fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
            method: "POST",
            headers: {
              "x-app-id": "675f6da4",
              "x-app-key": "3a5ac1dac796868fcd9bad6931c53da8",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              query: queryFood,
              timezone: "US/Eastern"
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.foods && data.foods.length > 0) {
              console.log("Nutrition info for 1 boiled egg:", data.foods[0]);
            } else {
              console.error("No food data returned:", data);
            }

            const chosenQuantity = +document.querySelector('#quantity').value;
            console.log(chosenQuantity);
            const servingQnty = document.querySelector("#serving-qnty");
            const calorieQnty = document.querySelector("#calories-qnty");
            const carbohydratesQnty = document.querySelector("#carbohydrates-qnty");
            const proteinsQnty =  document.querySelector("#proteins-qnty");
            const fatsQnty = document.querySelector("#fats-qnty");
            const sodiumsQnty = document.querySelector("#sodiums-qnty");
            const sugarsQnty = document.querySelector("#sugars-qnty");

            const food = data.foods[0];

            const perGramCalories = food.nf_calories / food.serving_weight_grams;
            const perGramCarbs = food.nf_total_carbohydrate / food.serving_weight_grams;
            const perGramFats = food.nf_total_fat / food.serving_weight_grams;
            const perGramProtein = food.nf_protein / food.serving_weight_grams;
            const perGramSodium = food.nf_sodium / food.serving_weight_grams;
            const perGramSugars = food.nf_sugars / food.serving_weight_grams;

            calorieQnty.textContent      = (perGramCalories * chosenQuantity).toFixed(2);
            carbohydratesQnty.textContent = (perGramCarbs * chosenQuantity).toFixed(2);
            fatsQnty.textContent          = (perGramFats * chosenQuantity).toFixed(2);
            proteinsQnty.textContent      = (perGramProtein * chosenQuantity).toFixed(2);
            sodiumsQnty.textContent       = (perGramSodium * chosenQuantity).toFixed(2);
            sugarsQnty.textContent        = (perGramSugars * chosenQuantity).toFixed(2);

            servingQnty.textContent = chosenQuantity;


            if(servingQnty.textContent == ""){
              servingQnty.textContent = "0";
            }
            if(calorieQnty.textContent == ""){
              calorieQnty.textContent = "0";
            }
            if(carbohydratesQnty.textContent == ""){
              carbohydratesQnty.textContent = "0";
            }
            if(fatsQnty.textContent == ""){
              fatsQnty.textContent == "0";
            }
            if(proteinsQnty.textContent == ""){
              proteinsQnty.textContent == "0";
            }
            if(sodiumsQnty.textContent == ""){
              sodiumsQnty.textContent == "0";
            }
            if(sugarsQnty.textContent == ""){
              sugarsQnty.textContent = "0";
            }
          })
          .catch(err => {
            console.error("API error:", err);
          });
          

    });
      const infoCircle = document.querySelector('.fa-circle-info');
      const infoText = document.querySelector('.info-text');
      console.log(infoText)
      infoCircle.addEventListener('mouseenter', e => {
        infoText.style.display = 'block';
        console.log(infoText.display);
      });

      infoCircle.addEventListener('mouseleave', e => {
        infoText.style.display = 'none';
        console.log(infoText.display);
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


    const addFoodBtn = document.querySelector('#add-food-button');

    addFoodBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const calories = document.querySelector("#calories-qnty").textContent || 0;
      const carbohydrates = document.querySelector("#carbohydrates-qnty").textContent || 0;
      const fats = document.querySelector("#fats-qnty").textContent || 0;
      const proteins = document.querySelector("#proteins-qnty").textContent || 0;
      const sodiums = document.querySelector("#sodiums-qnty").textContent || 0;
      const sugars = document.querySelector("#sugars-qnty").textContent || 0;

      try {
          const response = await fetch('/add-food', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include', // important for session
              body: JSON.stringify({ calories, carbohydrates, fats, proteins, sodiums, sugars })
          });

          const data = await response.json();
          if (data.message) {
              alert(`Храната е добавена. Оставащи калории: ${data.remainingCalories}`);
          }
      } catch (err) {
          console.error('Error adding food:', err);
      }

    }

    
  );


}