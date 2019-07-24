"use strict";
const dogBar = document.querySelector("#dog-bar");
const dogInfo = document.querySelector("#dog-info");
const SERVER_ROOT_PATH = "http://localhost:3000";
const PUPS = "pups";
const DOG_GOOD_BUTTON_CLASS_NAME = "good-bad-dog-button";

function dogsPath() {
    return `${SERVER_ROOT_PATH}/${PUPS}`;
}

function dogPath(id) {
    return `${dogsPath()}/${id}`
}

function getDogs() {
    return fetch(dogsPath()).then(response => response.json());
}

function getDog(id) {
    return fetch(dogPath(id)).then(response => response.json())
}

function dogGoodButtonText(isGoodDog) {
    return (isGoodDog ? "Good Dog!" : "Bad Dog!");
}

function binaryBoolToBool(binary) {
    if(binary === "1") {
        return true;
    }
    else if (binary === "0") {
        return false;
    }
    console.error("binary value not 1 or 0.");
    console.error(`\tvalue: ${binary}`);
    debugger;
}

function dogGoodButtonHandler(event) {
    if (event.target.className === DOG_GOOD_BUTTON_CLASS_NAME) {
        const oldDogState = (binaryBoolToBool(event.target.dataset.goodDog));
        console.log(`${event.target.innerText} was ${oldDogState ? "Good" : "Bad"}.`)
        const newDogBool = (!oldDogState);
        console.log(`${event.target.innerText} is now ${newDogBool ? "Good" : "Bad"}.`)
        fetch(dogPath(event.target.dataset.id), {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application.json'
                // 'Accept' : 'application.json'
            },
            body: JSON.stringify({
                'isGoodDog' : newDogBool

            })
        }).then(resp => resp.json()).then((response) => {
            console.log(response);
            renderDogInfo(response);
        })
    }
}

function renderDogInfo(dog) {
    dogInfo.innerHTML = "";

    const newImg = document.createElement("img");
    newImg.src = dog.image;
    dogInfo.appendChild(newImg);

    const newH2 = document.createElement("h2");
    newH2.innerText = dog.name;
    dogInfo.appendChild(newH2);

    const newButton = document.createElement("button");
    newButton.className = DOG_GOOD_BUTTON_CLASS_NAME;
    newButton.innerText = dogGoodButtonText(dog.isGoodDog);
    newButton.dataset.id = dog.id;
    newButton.dataset.goodDog = (dog.isGoodDog ? 1 : 0);
    dogInfo.appendChild(newButton);

}
function dogDivEventHandler(event) {
    console.log(event);
    // debugger;
    if (event.target.parentElement.id === "dog-bar") {
        getDog(event.target.dataset.id).then((dog) => renderDogInfo(dog));
    }
}

function renderDogs() {
    dogBar.addEventListener('click', dogDivEventHandler);
    getDogs().then(dogs => {
        for (let i = 0; i < dogs.length; i++) {
            const newDog = document.createElement("span");
            newDog.innerText = dogs[i].name;
            newDog.dataset.id = dogs[i].id;
            dogBar.appendChild(newDog);
        }
    })
}

function main() {
    renderDogs();
    dogInfo.addEventListener('click', dogGoodButtonHandler);
}

// I'm a C/C++ programmer, yo.
main();
