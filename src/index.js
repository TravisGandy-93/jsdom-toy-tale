let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //initial fetch request to get all toys
  getToys = () => {
    fetch(fetchAPIURL)
    .then(res => res.json())
    .then(resObj => {
      //resObj is the data you're getting back from toys
      resObj.forEach(createToyCard)
    })
  }
  

  //toy collection div
  const toyList = document.querySelector("#toy-collection")

  //like button event listener function
  const toyButtonEvent = (event) => {
    const pLikes = event.target.previousElementSibling
    const likes = parseInt(pLikes.innerText) + 1
    const id = event.target.dataset.id
    increaseLikes(id, pLikes, likes)
  }

  function increaseLikes(id, pLikes, likes){
    // debugger
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: likes
      })
    })
    .then(resp => resp.json())
    .then(id => {
      pLikes.innerText = id.likes
    })
  
  }

    //delete button event listener
  deleteToyButton = (event) => {
    const id = event.target.dataset.id
    const toyDiv = event.target.closest("div.card")


    fetch(`http://localhost:3000/toys/${id}`, {
      method: "DELETE"
    })
    .then(toyDiv.remove())
    //pessimistically removing toyDiv
  }

  //closure
  createToyCard = (toyObj) => {
    const cardDiv = document.createElement("div")
    cardDiv.className = "card"

    const cardH2 = document.createElement("h2")
    cardH2.textContent = toyObj.name

    const toyImg = document.createElement("img")
    toyImg.src = toyObj.image
    toyImg.setAttribute("class", "toy-avatar")

    const toyP = document.createElement("p")
    toyP.innerText = `${toyObj.likes} Likes`

    //like button
    const toyButton = document.createElement("button")
    toyButton.className = "like-btn"
    toyButton.textContent = "Like <3"
    toyButton.dataset.id = toyObj.id

    toyButton.addEventListener("click", toyButtonEvent)

    //delete button
    const deleteButton = document.createElement("button")
    deleteButton.className = "delete-btn"
    deleteButton.textContent = "Delete Toy :("
    deleteButton.dataset.id = toyObj.id

    deleteButton.addEventListener("click", deleteToyButton)

    cardDiv.append(cardH2, toyImg, toyP, toyButton, deleteButton)
    toyList.append(cardDiv)
  }

  //getting toy form dom element
  const toyForm = document.querySelector(".add-toy-form")

  //getting form data
  toyFormEvent = (event) => {
    event.preventDefault()
    let formData = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    }
    postNewToy(formData)
  }

  postNewToy = (newToy) => {
    //making fetch body into an object
    const configObj = {
      method: "POST",
      headers: 
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    }

    //calling fetch
    fetch("http://localhost:3000/toys", configObj)
    .then(response => response.json())
    .then(serverToy => createToyCard(serverToy))
    .then(toyForm.reset())

  }

  //adding event listener to toy form
  toyForm.addEventListener("submit", toyFormEvent)
 

  // calling initial fetch function
  getToys()
});
