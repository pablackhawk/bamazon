// Dependencies
let inquirer = require('inquirer')
let mysql = require('mysql')

// MySQL server parameters
let connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazon',
})

// Validating inputs are only positive integers
function validateInput(value) {
  let integer = Number.isInteger(parseFloat(value))
  let sign = Math.sign(value)
  if (integer && sign === 1) {
    return true
  } else {
    return 'Please enter a whole non-zero number.'
  }
}

function promptUserPurchase() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'item_id',
        message:
          'Please enter the Item ID number of the product you like to purchase.',
        validate: validateInput,
        filter: Number,
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to purchase?',
        validate: validateInput,
        filter: Number,
      },
    ])
    .then(function(input) {
      let item = input.item_id
      let quantity = input.quantity

      // Querys database to confirm given item ID exists with enough desired quantity
      let queryStr = 'SELECT * FROM products WHERE ?'

      connection.query(queryStr, { item_id: item }, function(err, data) {
        if (err) throw err

        if (data.length === 0) {
          console.log('ERROR: Invalid Item ID. Please select a valid Item ID.')
          displayInventory()
        } else {
          let productData = data[0]
          // Item in stock
          if (quantity <= productData.stock_quantity) {
            console.log('In Stock. Placing order now...')
            let updateQueryStr =
              'UPDATE products SET stock_quantity = ' +
              (productData.stock_quantity - quantity) +
              ' WHERE item_id = ' +
              item
            //Inventory update
            connection.query(updateQueryStr, function(err, data) {
              if (err) throw err
              console.log(
                'Your order has been placed! Your total is $' +
                  productData.price * quantity +
                  '\nThank you for shopping with Bamazon!\n----------------------------------------\n'
              )
              connection.end()
            })
          } else {
            console.log(
              "We're sorry. The quantity you have requested is unavailable.\nPlease modify your order.\n----------------------------------------\n"
            )
            displayInventory()
          }
        }
      })
    })
}

function displayInventory() {
  queryStr = 'SELECT * FROM products'
  connection.query(queryStr, function(err, data) {
    if (err) throw err
    let res = ''
    for (let i = 0; i < data.length; i++) {
      res = ''
      res += 'Item ID: ' + data[i].item_id + '\n'
      res += 'Product Name: ' + data[i].product_name + '\n'
      res += 'Department: ' + data[i].department + '\n'
      res += 'Price: $' + parseFloat(data[i].price).toFixed(2) + '\n'
      console.log(res + '\n----------------------------------------\n')
    }
    promptUserPurchase()
  })
}
// Initializes app
function runBamazon() {
  displayInventory()
}

runBamazon()
