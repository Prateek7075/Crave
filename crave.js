const img = document.getElementById("img");
const img2 = document.getElementById("img2");

const link1=document.getElementById('link1');
const link2=document.getElementById('link2');
const link3=document.getElementById('link3');
const link4=document.getElementById('link4');
const link5=document.getElementById('link5');
const link6=document.getElementById('link6');

link1.addEventListener('click',()=>
    {
        img.src="quickdelivery.jpg";
        link1.style.borderLeft= '4px solid BLACK';
        link2.style.border='';
        link3.style.border='';
        
    })
link2.addEventListener('click',()=>
{
    img.src="cuisine.jpg";
    link2.style.borderLeft= '4px solid BLACK';
    link1.style.border='';
    link3.style.border='';
    
})
link3.addEventListener('click',()=>
    {
        img.src="ordertrack.jpg";
        link3.style.borderLeft= '4px solid BLACK';
        link1.style.border='';
        link2.style.border='';
        
    })

link4.addEventListener('click',()=>
{
    img2.src="subscription.jpg";
    link4.style.borderRight= '4px solid BLACK';
    
    link5.style.border='';
    link6.style.border='';
})

link5.addEventListener('click',()=>
    
    {
        img2.src="time.jpg";
        link5.style.borderRight= '4px solid BLACK';
        
        link4.style.border='';
        link6.style.border='';
    })


link6.addEventListener('click',()=>
        {
            img2.src="donation.jpg";
            link6.style.borderRight= '4px solid BLACK';
            link1.style.border='';
            link2.style.border='';
            link4.style.border='';
            link5.style.border='';
            link3.style.border='';
        })


const year = document.getElementById("yearly");
const month = document.getElementById("monthly");
const baseprice = document.getElementById("pricebase");
const businprice = document.getElementById("pricebusiness");
const enterprice = document.getElementById("priceenter");
year.addEventListener('click',()=>{
    year.style.backgroundColor = "#fd5e53";
    year.style.color = "white";
    month.style.backgroundColor = "white";
    month.style.color = "#fd5e53";
    baseprice.innerHTML="&#x20b9; 199/Year";
    businprice.innerHTML="&#x20b9; 599/Year";
    enterprice.innerHTML="&#x20b9; 999/Year";
});
month.addEventListener('click',()=>{
    month.style.backgroundColor = "#fd5e53";
    month.style.color = "white";
    
    year.style.backgroundColor = "white";
    year.style.color = "#fd5e53";
    baseprice.innerHTML="&#x20b9; 59/Month";
    businprice.innerHTML="&#x20b9; 119/Month";
    enterprice.innerHTML="&#x20b9; 299/Month";
});
const element = document.getElementById('loginsignup2');
const body = document.getElementById("all");

function Visibility() 
{
    element.style.visibility = 'visible';
    body.style.filter='blur(5px)';
}

const head = document.getElementById("head");
const para = document.getElementById("para");
const cover = document.getElementById("coverid");
const colorchange  = document.getElementById("colorchange");
function move()
{    

    cover.style.transform = 'translateX(0)';
    cover.style.borderTopRightRadius="100%";
    cover.style.borderBottomRightRadius="100%";
    cover.style.borderTopLeftRadius="0";
    cover.style.borderBottomLeftRadius="0";
    head.innerText = 'Hello Friend!';
    para.innerText = 'Register with your Personal Details to use all of site features.';        
}
function moveback()
{
  
    cover.style.transform = 'translateX(100%)';
    cover.style.borderTopLeftRadius="100%";
    cover.style.borderBottomLeftRadius="100%";
    cover.style.borderTopRightRadius="0";
    cover.style.borderBottomRightRadius="0";
    head.innerText = 'Welcome Back!';
    para.innerText = 'Enter your Personal Details to use all of site features.'         
}



function user()
{   
    
    element.style.visibility = 'hidden';
    const userdiv = document.getElementById("account");
    userdiv.innerHTML = '<i id="acc" class="fa-solid fa-circle-user"></i>';
    body.style.filter='blur(0px)';
    // const emailsign=document.getElementById('emailidsign').value;
    // const passsign=document.getElementById('passwordidsign').value;
    // const newuser={emailsign,passsign};
    // userpass.push(newuser);
    // localStorage.setItem(`${k}`,JSON.stringify(userpass));
    // k=k+1;
    // const store=localStorage.getItem()
}
// const drop=document.getElementById('userdrop');
// function dropvis()
// {
//     drop.style.visibility='visible';
//     alert("hi");
// }
function userlog()
{   
    element.style.visibility = 'hidden';
    const user = document.getElementById("account");
    user.innerHTML = '<i class="fa-solid fa-circle-user"></i>';
    body.style.filter='blur(0px)';
    // const emaillog=document.getElementById('emailidlog').value;
    // const passlog=document.getElementById('passwordidlog').value;
}



