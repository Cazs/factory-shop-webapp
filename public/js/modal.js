console.log('init modal controller');

let msg = getQueryVariable('msg');
let modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

if(msg)//if message param is set, show modal
{
    console.log('showing modal');
    document.getElementById('modal-msg').innerText = decodeURIComponent(msg);
    modal.style.display = "block";
} else modal.style.display = "none";//else hide it

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++)
       {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function()
{
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event)
{
    if (event.target == modal)
    {
        modal.style.display = "none";
    }
}