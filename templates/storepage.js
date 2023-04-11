const APILINK = 'http://127.0.0.1:5000/items';

async function getItems(){ 

    const response = await fetch(APILINK,
        {
            method: "POST",
            body: JSON.stringify({
                'username' : document.getElementById("username").value,
                'password' : document.getElementById("password").value,
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
        formContainer.style = "display: none"
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
