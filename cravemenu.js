const all = document.getElementById('all');
function clickon() {
    const cartpanel = document.getElementById('cartmain');
    
    if(cartpanel.style.visibility==='visible')
    {
        cartpanel.style.visibility='hidden';
        all.style.filter='blur(0px)';
    }
    else
    {
        cartpanel.style.visibility='visible';
        all.style.filter='blur(5px)';
    }
}


const cartTable = document.getElementById('carttable');


function addToCart(itemName, itemPrice, quantity) {
   
    const row = document.createElement('tr');

   
    const itemColumn = document.createElement('td');
    itemColumn.innerHTML = itemName;

    const priceColumn = document.createElement('td');
    priceColumn.innerHTML = `&#x20b9; ${itemPrice}`;

    const quantityColumn = document.createElement('td');
    quantityColumn.innerText = quantity;

    const totalColumn = document.createElement('td');
    const total = itemPrice * quantity;
    totalColumn.innerHTML = `&#x20b9; ${total}`;

   
    row.appendChild(itemColumn);
    row.appendChild(priceColumn);
    row.appendChild(quantityColumn);
    row.appendChild(totalColumn);

    cartTable.appendChild(row);

   
    updateCartTotal();
}


function updateCartTotal() {
    let totalAmount = 0;

    
    const rows = cartTable.getElementsByTagName('tr');
    
   
    for (let i = 1; i < rows.length; i++) {
        const rowTotal = rows[i].getElementsByTagName('td')[3].innerText.replace('₹', '').trim();
        totalAmount += parseFloat(rowTotal);
        
    }


    let gstres=(totalAmount * 0.25);
    let delfee=6; 
    let billtotalprice= totalAmount+gstres+delfee;

    document.getElementById('billamount').innerHTML = `&#x20b9; ${totalAmount.toFixed(2)}`;
    document.getElementById('billdel').innerHTML=`&#x20b9; ${delfee.toFixed(2)}`;
    document.getElementById('billtax').innerHTML=`&#x20b9; ${gstres.toFixed(2)}`;
    document.getElementById('billtotal').innerHTML = `&#x20b9; ${billtotalprice.toFixed(2)}`;
}


document.getElementById('noodle').addEventListener('click', function() {
    const price = 120; 
    const quantity = document.getElementById('noodlequan').value|| 1;
    const empty= document.getElementById('empty');
    empty.innerHTML='';
    addToCart('<img src="noodles.jpg" alt="" id="noodleimg">', price, quantity);
    
});

document.getElementById('icecream').addEventListener('click', function() {
    const price = 60;
    const quantity = document.querySelector('#icequan').value|| 1;
    const empty= document.getElementById('empty');
    empty.innerHTML='';
    addToCart('<img src="icecream.jpg" alt="">', price,(quantity));
});

document.getElementById('dosa').addEventListener('click', function() {
    const price = 180;
    const quantity = document.querySelector('#dosaquan').value || 1;
    const empty= document.getElementById('empty');
    empty.innerHTML='';
    addToCart('<img src="dosadish.jpg" alt="">', price, quantity);
});

document.getElementById('pavbhaji').addEventListener('click', function() {
    const price = 150;
    const quantity = document.querySelector('#pavquan').value || 1;
    const empty= document.getElementById('empty');
    empty.innerHTML='';
    addToCart('<img src="bhaji.jpg" alt="">', price, quantity);
});

document.getElementById('potato').addEventListener('click', function() {
    const price = 100;
    const quantity = document.querySelector('#honeyquan').value || 1;
    const empty= document.getElementById('empty');
    empty.innerHTML='';
    addToCart('<img src="honeychilli.jpg" alt="">', price, quantity);
});



function go()
{
    const cartpa=document.getElementById('cartmain');
    cartpa.style.visibility='hidden';
    all.style.filter='blur(0px)';
    alert("Order Confirmed !");
    const tableclear= document.getElementById('tablereset');
    tableclear.innerHTML='<table id="carttable"><tr><th>Item</th><th>Price</th><th>Quantity</th><th>Total</th></tr>    </table><div id="empty"><b>Your Cart is Empty !</b></div>';
}

document.getElementById('close').addEventListener('click',()=>
{
    const cartclose=document.getElementById('cartmain');
    cartclose.style.visibility='hidden';
    all.style.filter='blur(0px)';
});