
// fetch data from json file 
let api = await fetch("js/inf.json");
let data = await api.json();
// seperate the endpoints into arrays 
let customers = data.customers;
let transactions = data.transactions;

//create the table to show after page is loaded
createTable(customers, transactions);

//get the value from the input field
let input = document.querySelector('input');
input.addEventListener('input', function (e) {
    if (chart) {
        destroyChart();
    }
    searchData(this.value.toLowerCase());
});

//search the value that comes from the input 
function searchData(val) {
    let c = []
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].name.toLowerCase().includes(val)) {
            c.push(customers[i].id)
        }
    }
    if (c.length == 0) {
        document.querySelector('.not-found').classList.add('show');
    } else {
        document.querySelector('.not-found').classList.remove('show');
    }
    filterDataById(c)
}

//filter the data by its ID to search for value based on 'id: value'
function filterDataById(arr) {
    let customersID = customers.filter(customer => arr.includes(customer.id));
    let transactionsID = transactions.filter(transaction => arr.includes(transaction.id));
    createTable(customersID, transactionsID)
}

//create table on HTML page
function createTable(val1, val2) {
    let box = `<thead>
        <tr>
            <th>name</th>
            <th>Total Transaction Amount</th>
            <th>Transactions per day</th>
            </tr>
        </thead>`
    for (let i = 0; i < val1.length; i++) {
        box += `
            <tr>
                <td>${val1[i].name}</td>
                <td>${eval(val2[i].amount.join('+'))}</td>
                <td><button class="table-btn" data-userID="${val1[i].id}">view</button></td>
            </tr>`
    }
    document.querySelector('tbody').innerHTML = box;
    clickBtnEvent()
}

//click event on buttons in the table
function clickBtnEvent() {
    let btn = document.querySelectorAll('.table-btn');
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', function (e) {
            getIdOfData(this.getAttribute('data-userID'));
        })
    }
}

//global variable for chart.js inestance
let chart;
// create chart.js graph
function getChart(date, amount) {
    let ctx = document.querySelector('#linechar').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date.map(e => e),
            datasets: [{
                label: 'transactions',
                data: amount.map(e => e),
                borderWidth: 1,
                borderColor: [
                    'rgb(78, 76, 184)',
                    'rgb(125, 124, 167)'
                ],
                backgroundColor: [
                    'rgb(60, 58, 172)',
                    'rgb(129, 129, 150)'
                ],
            }]
        },
        options: {
            responsive: true,
        }
    });
}

//get the ID keys of data
function getIdOfData(val) {
    transactions.forEach(element => {
        if (element.id == val) {
            if (chart) {
                destroyChart()
            }
            getChart(element.date, element.amount)
        }
    });
}

//add event on input to show placeholder after focusout
document.querySelector('input').addEventListener('focusout', function (e) {
    this.value = ''
    this.setAttribute('placeholder', 'search by name')
})

//distroy the chart canvas if its in use
function destroyChart() {
    chart.destroy();
}