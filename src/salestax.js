var baskets = [
    [ { product: 'book', quantity: 1, price: 12.49, type: 'book'},
      { product: 'music CD' , quantity: 1, price: 14.99  },
      { product: 'chocolate bar', quantity: 1 , price: 0.85 , type: 'food'}
    ],
    [ { product: 'box of chocolates', quantity: 1, price: 10.00, imported: true, type: 'food'},
      { product: 'bottle of perfume' , quantity: 1, price: 47.50, imported: true}
    ],
    [ { product: 'bottle of perfume' , quantity: 1, price: 27.99, imported: true },
      { product: 'bottle of perfume' , quantity: 1, price: 18.99 },
      { product: 'packet of headache pills' , quantity: 1, price: 9.75,
        type: 'medical product' },
      { product: 'box of chocolates', quantity: 1, price: 11.25, imported: true, type: 'food' }
    ]
] 
  
var exempt = ['book', 'food', 'medical product'];

function roundUp(p) {
    
    return p;
};
  
function calculate(baskets) {
    return baskets.map(function(basket) {
        var list = basket.map(function(item) {
            var taxRate =
                (exempt.indexOf(item.type) === -1 ? 0.1 : 0) +
                (item.imported ? .05 : 0 )
            item.salesTax = roundUp(taxRate * item.price);
            return [item.quantity + (item.imported ? ' imported' : ''),
                    item.product + ':', item.price + item.salesTax].join(' ');
        });
        var salesTax = basket.reduce(function(p1, p2) {
            return p2.salesTax + p1;
        }, 0);
        list.push('Sales Taxes: ' + salesTax);
        var total = basket.reduce(function(p1, p2) {
            return p2.price + p2.salesTax + p1;
        }, 0);
        list.push('Total: ' + total);
        return list;
    });
    
}

var result = calculate(baskets);
  
console.log('OUTPUT');
result.forEach(function(basket, i) {
    console.log('Output ' + (i+1) + ':');
    basket.forEach(function(item) {
        console.log(item);
    })
    console.log();
})

// Basic sales tax is applicable at a rate of 10% on all goods, except books, food,  
// and medical products that are exempt. Import duty is an additional sales tax
// applicable on all imported goods at a rate of 5%, with no exemptions.

// When I purchase items I receive a receipt which lists the name of all the items
// and their price (including tax), finishing with the total cost of the items,
// and the total amounts of sales taxes paid.  The rounding rules for sales tax are
// that for a tax rate of n%, a shelf price of p contains (np/100 rounded up to
// the nearest 0.05) amount of sales tax.

// Write an application that prints out the receipt details for these shopping baskets...
// INPUT:
// Input 1:
// 1 book at 12.49
// 1 music CD at 14.99
// 1 chocolate bar at 0.85

// Input 2:
// 1 imported box of chocolates at 10.00
// 1 imported bottle of perfume at 47.50

// Input 3:
// 1 imported bottle of perfume at 27.99
// 1 bottle of perfume at 18.99
// 1 packet of headache pills at 9.75
// 1 box of imported chocolates at 11.25

// OUTPUT
// Output 1:
// 1 book: 12.49
// 1 music CD: 16.49
// 1 chocolate bar: 0.85
// Sales Taxes: 1.50
// Total: 29.83

// Output 2:
// 1 imported box of chocolates: 10.50
// 1 imported bottle of perfume: 54.65
// Sales Taxes: 7.65
// Total: 65.15

// Output 3:
// 1 imported bottle of perfume: 32.19
// 1 bottle of perfume: 20.89
// 1 packet of headache pills: 9.75
// 1 imported box of chocolates: 11.85
// Sales Taxes: 6.70
// Total: 74.68
  
