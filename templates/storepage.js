const APILINK = 'http://127.0.0.1:5000/items';

regionSelected = 'eu';

async function getItems(){
    
    const submitBtn = document.getElementById("submitButton")
    submitBtn.disabled = true

    const response = await fetch(APILINK,
        {
            method: "POST",
            body: JSON.stringify({
                'username' : document.getElementById("username").value,
                'password' : document.getElementById("password").value,
                'region' : regionSelected,
            })
        }
        )

    if(!response.ok){
        err = await response.json()
        if(err === "credError"){
            username = document.getElementById("username")
            password = document.getElementById("password")
            username.style = "border:2px solid red"
            password.style = "border:2px solid red"
            document.getElementById("err").innerHTML = "Wrong credentials"
        }
        else{
            document.getElementById("err").innerHTML = "2FA not supported"
        }
        submitBtn.disabled = false
    }else{
        skins = await response.json()
        loadShop(skins)
    }
    
   
    
}

function selectRegion(region){
    if(region.id === 'eu'){
        region.src = "../resources/1.gif"
        region.style = "display: inline-block; background-color: #444444;padding: 5px;border-radius: 20%; border: 2px solid #333;"
        var deselectedRegion = document.getElementById('na');
        deselectedRegion.src = "../resources/2deselected.png"
        deselectedRegion.style = "border:none"
        regionSelected = region.id
    }else{
        region.src="../resources/2.gif"
        region.style = "display: inline-block; background-color: #444444;padding: 5px;border-radius: 20%; border: 2px solid #333;"
        var deselectedRegion = document.getElementById('eu');
        deselectedRegion.src = "../resources/1deselected.png"
        deselectedRegion.style = "border:none"
        regionSelected = region.id
    }


}

function loadShop(skins){
    formContainer = document.getElementById("formContainer");
    formContainer.classList.remove('fadeIn')
    formContainer.classList.add('fadeOut')

    const shopContainer = document.createElement('div');

    shopContainer.className='shopContainer'
  
    skins.forEach((skin) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'imageWrapper'
        const card = document.createElement('div');
        card.className = 'card'
        const img = document.createElement('img')
        if(skin['displayIcon'] === null){
            img.src = skin['chromas'][0].displayIcon;
        }else{
            img.src = skin['displayIcon'];
        }
        const skinName = document.createElement('div');
        skinName.className = 'skinName';
        skinName.textContent = skin['displayName'] + " " +skin['price'];
        imageWrapper.appendChild(img)
        card.appendChild(imageWrapper)
        card.appendChild(skinName)
        shopContainer.appendChild(card)
    });
    document.body.appendChild(shopContainer);
}
