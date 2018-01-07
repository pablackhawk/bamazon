// Dependencies
let inquirer = require('inquirer')
let mysql = require('mysql')

//MySql connection
let connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazon',
})

function managerAction() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'Select an option:',
        choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product',
        ],
        filter: function(val) {
          switch (val) {
            case 'View Products for Sale':
              return 'sale'
              break

            case 'View Low Inventory':
              return 'lowInventory'
              break

            case 'Add to Inventory':
              return 'addInventory'
              break

            case 'Add New Product':
              return 'newProduct'
              break

            default:
              console.log('ERROR: Unsupported Operation')
              exit(1)
          }
        },
      },
    ])
    .then(function(input) {
      switch (input.option) {
        case 'sale':
          displayInventory()
          break

        case 'lowInventory':
          displayLowInventory()
          break

        case 'addInventory':
          addInventory()
          break

        case 'newProduct':
          createNewProduct()
          break
      }
    })
}

// Retrieves current inventory from database
function displayInventory() {
  queryStr = 'SELECT * FROM products'

  connection.query(queryStr, function(err, data) {
    if (err) throw err
    console.log(
      'Existing Inventory: \n----------------------------------------\n'
    )

    let res = ''
    for (let i = 0; i < data.length; i++) {
      res = ''
      res += 'Item ID: ' + data[i].item_id + '\n'
      res += 'Product Name: ' + data[i].product_name + '\n'
      res += 'Department: ' + data[i].department + '\n'
      res += 'Price: $' + parseFloat(data[i].price).toFixed(2) + '\n'
      console.log(res + '\n----------------------------------------\n')
      connection.end()
    }
  })
}
