const foodFactory = food => {
    return `
    <div id="${food.name}">
        ${element("h1", food.name, "foodName")}
        ${element("section", `${food.ethnicity} ${food.category}`, "basicFoodInfo")}
        ${element("section", food.ingredients, "ingredients")}
        ${element("section", food.countries, "countries")}
        ${element("section", `Calories: ${food.calories}`, "calories")}
        ${element("section", `Fats: ${food.fats}`, "fats")}
        ${element("section", `Sugars: ${food.sugars}`, "sugars")}
    </div>`
}

const element = (comp, text, classes) => `
    <${comp} class="${classes}">${text}</${comp}>
`

const foodContainer = document.querySelector("#container")
const addFoodToDom = (foodAsHTML) => foodContainer.innerHTML += foodAsHTML

fetch("http://localhost:8088/food")
    .then(response => response.json())
    .then(myParsedFoods => {
        myParsedFoods.forEach(food => {
            console.log(food) // Should have a `barcode` property

            // Now fetch the food from the Food API
            fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`)
                .then(response => response.json())
                .then(productInfo => {
                    if (productInfo.product.ingredients_text) {
                      food.ingredients = productInfo.product.ingredients_text
                    } else {
                      food.ingredients = "no ingredients listed"
                    }
                    if (productInfo.product.countries){
                        food.countries = productInfo.product.countries
                    } else {
                        food.countries = "no countries listed"
                    }
                    if (productInfo.product.nutriments["energy-kcal_value"]) {
                        food.calories = productInfo.product.nutriments["energy-kcal_value"]
                    } else {
                        food.calories = "not found"
                    }
                    if (productInfo.product.nutriments.fat_serving) {
                        food.fats = productInfo.product.nutriments.fat_serving
                    } else {
                        food.fats = "not found"
                    }
                    if (productInfo.product.nutriments.sugars_serving) {
                        food.sugars = productInfo.product.nutriments.sugars_serving
                    } else {
                        food.sugars = "not found"
                    }

                    // Produce HTML representation
                    const foodAsHTML = foodFactory(food)

                    // Add representaiton to DOM
                    addFoodToDom(foodAsHTML)
                })
        })
    })
