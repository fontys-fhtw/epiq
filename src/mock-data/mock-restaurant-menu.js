const mockMenuData = [
  {
    category: "Pizza",
    dishes: [
      {
        dishID: 1,
        dishName: "Margherita Pizza",
        description: "Classic pizza with tomato and cheese.",
        price: 12.5,
        ingredients: [
          { ingredientID: 1, ingredientName: "Tomato", quantity: "100g" },
          { ingredientID: 2, ingredientName: "Cheese", quantity: "150g" },
          { ingredientID: 3, ingredientName: "Dough", quantity: "200g" },
          { ingredientID: 1, ingredientName: "Tomato", quantity: "100g" },
        ],
      },
      {
        dishID: 3,
        dishName: "Pepperoni Pizza",
        description: "Spicy pepperoni on a classic base.",
        price: 14.0,
        ingredients: [
          { ingredientID: 1, ingredientName: "Tomato", quantity: "100g" },
          { ingredientID: 2, ingredientName: "Cheese", quantity: "150g" },
          { ingredientID: 3, ingredientName: "Dough", quantity: "200g" },
          { ingredientID: 4, ingredientName: "Pepperoni", quantity: "100g" },
        ],
      },
      {
        dishID: 5,
        dishName: "BBQ Chicken Pizza",
        description: "Grilled chicken with BBQ sauce and red onions.",
        price: 15.5,
        ingredients: [
          { ingredientID: 5, ingredientName: "Chicken", quantity: "150g" },
          { ingredientID: 6, ingredientName: "BBQ Sauce", quantity: "50g" },
          { ingredientID: 2, ingredientName: "Cheese", quantity: "150g" },
          { ingredientID: 3, ingredientName: "Dough", quantity: "200g" },
          { ingredientID: 7, ingredientName: "Red Onion", quantity: "50g" },
        ],
      },
    ],
  },
  {
    category: "Salad",
    dishes: [
      {
        dishID: 2,
        dishName: "Caesar Salad",
        description: "Fresh greens with Caesar dressing.",
        price: 8.75,
        ingredients: [
          { ingredientID: 4, ingredientName: "Lettuce", quantity: "100g" },
          { ingredientID: 5, ingredientName: "Parmesan", quantity: "50g" },
        ],
      },
      {
        dishID: 4,
        dishName: "Greek Salad",
        description: "Traditional Greek salad with feta cheese.",
        price: 9.5,
        ingredients: [
          { ingredientID: 6, ingredientName: "Tomato", quantity: "100g" },
          { ingredientID: 7, ingredientName: "Cucumber", quantity: "100g" },
          { ingredientID: 8, ingredientName: "Feta", quantity: "80g" },
          { ingredientID: 9, ingredientName: "Olives", quantity: "50g" },
        ],
      },
      {
        dishID: 6,
        dishName: "Caprese Salad",
        description:
          "Fresh mozzarella, tomatoes, and basil, drizzled with olive oil.",
        price: 10.0,
        ingredients: [
          { ingredientID: 10, ingredientName: "Mozzarella", quantity: "100g" },
          { ingredientID: 6, ingredientName: "Tomato", quantity: "100g" },
          { ingredientID: 11, ingredientName: "Basil", quantity: "5g" },
          { ingredientID: 12, ingredientName: "Olive Oil", quantity: "10ml" },
        ],
      },
    ],
  },
  {
    category: "Pasta",
    dishes: [
      {
        dishID: 7,
        dishName: "Spaghetti Bolognese",
        description: "Classic Italian pasta with beef sauce.",
        price: 13.5,
        ingredients: [
          { ingredientID: 13, ingredientName: "Spaghetti", quantity: "150g" },
          { ingredientID: 14, ingredientName: "Ground Beef", quantity: "200g" },
          {
            ingredientID: 15,
            ingredientName: "Tomato Sauce",
            quantity: "100g",
          },
          { ingredientID: 16, ingredientName: "Garlic", quantity: "10g" },
        ],
      },
      {
        dishID: 8,
        dishName: "Fettuccine Alfredo",
        description: "Creamy Alfredo sauce with parmesan and garlic.",
        price: 12.0,
        ingredients: [
          { ingredientID: 17, ingredientName: "Fettuccine", quantity: "150g" },
          { ingredientID: 18, ingredientName: "Cream", quantity: "100ml" },
          { ingredientID: 5, ingredientName: "Parmesan", quantity: "50g" },
          { ingredientID: 16, ingredientName: "Garlic", quantity: "10g" },
        ],
      },
      {
        dishID: 9,
        dishName: "Penne Arrabbiata",
        description: "Penne pasta with spicy tomato sauce.",
        price: 11.5,
        ingredients: [
          { ingredientID: 19, ingredientName: "Penne", quantity: "150g" },
          {
            ingredientID: 15,
            ingredientName: "Tomato Sauce",
            quantity: "100g",
          },
          { ingredientID: 20, ingredientName: "Chili Flakes", quantity: "5g" },
          { ingredientID: 21, ingredientName: "Olive Oil", quantity: "10ml" },
        ],
      },
    ],
  },
  {
    category: "Dessert",
    dishes: [
      {
        dishID: 10,
        dishName: "Tiramisu",
        description:
          "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
        price: 6.5,
        ingredients: [
          { ingredientID: 22, ingredientName: "Ladyfingers", quantity: "100g" },
          { ingredientID: 23, ingredientName: "Mascarpone", quantity: "150g" },
          { ingredientID: 24, ingredientName: "Coffee", quantity: "50ml" },
          { ingredientID: 25, ingredientName: "Cocoa Powder", quantity: "10g" },
        ],
      },
      {
        dishID: 11,
        dishName: "Panna Cotta",
        description: "Creamy Italian dessert topped with berry sauce.",
        price: 5.75,
        ingredients: [
          { ingredientID: 18, ingredientName: "Cream", quantity: "100ml" },
          { ingredientID: 26, ingredientName: "Sugar", quantity: "50g" },
          { ingredientID: 27, ingredientName: "Vanilla", quantity: "5g" },
          { ingredientID: 28, ingredientName: "Berry Sauce", quantity: "30ml" },
        ],
      },
    ],
  },
  {
    category: "Drinks",
    dishes: [
      {
        dishID: 12,
        dishName: "Coca-Cola",
        description: "Chilled refreshing beverage.",
        price: 2.5,
        ingredients: [
          { ingredientID: 29, ingredientName: "Coca-Cola", quantity: "330ml" },
        ],
      },
      {
        dishID: 13,
        dishName: "Lemonade",
        description: "Fresh homemade lemonade with mint.",
        price: 3.0,
        ingredients: [
          {
            ingredientID: 30,
            ingredientName: "Lemon Juice",
            quantity: "100ml",
          },
          { ingredientID: 26, ingredientName: "Sugar", quantity: "20g" },
          { ingredientID: 31, ingredientName: "Mint", quantity: "5g" },
        ],
      },
    ],
  },
];

export default mockMenuData;
