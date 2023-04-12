const APILINK = 'http://127.0.0.1:5000/items';

regionSelected = 'eu';

async function getItems(){ 


    const response = await fetch(APILINK,
        {
            method: "POST",
            body: JSON.stringify({
                'username' : document.getElementById("username").value,
                'password' : document.getElementById("password").value,
                'region' : regionSelected,
            })
        }
        );
    
    if(!response.ok){
        const div = document.createElement('div');
        const text = document.createElement('h1');
        text.append("tutto scassato");
        div.appendChild(text)
        document.body.appendChild(div)
    }else{
        formContainer = document.getElementById("formContainer");
        formContainer.classList.remove('fadeIn')
        formContainer.classList.add('fadeOut')
    }

    const skins = await response.json();
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
        skinName.textContent = skin['displayName'];
        imageWrapper.appendChild(img)
        card.appendChild(imageWrapper)
        card.appendChild(skinName)
        shopContainer.appendChild(card)
    });
    document.body.appendChild(shopContainer);
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
