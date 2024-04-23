// index.js
const baseUrl = "http://localhost:3000/ramens";

const handleClick = (ramen) => {
  const img = document.querySelector("#ramen-detail > .detail-image");
  const name = document.querySelector("#ramen-detail > .name");
  const restaurant = document.querySelector("#ramen-detail > .restaurant");
  const rating = document.getElementById("rating-display");
  const comment = document.getElementById("comment-display");
  const editForm = document.getElementById("edit-ramen");
  const editRamenId = document.getElementById("edit-ramen-id");

  img.src = ramen.image;
  img.alt = ramen.image;
  name.innerText = ramen.name;
  restaurant.innerText = ramen.restaurant;
  rating.innerText = ramen.rating;
  comment.innerText = ramen.comment;
  editRamenId.value = ramen.id; // Set the ID of the ramen in the hidden input field
};

const addSubmitListeners = () => {
  const addRamenForm = document.querySelector("#new-ramen");
  const editRamenForm = document.querySelector("#edit-ramen");

  if (addRamenForm) {
    addRamenForm.addEventListener("submit", handleSubmitAddRamen);
  }

  if (editRamenForm) {
    editRamenForm.addEventListener("submit", handleSubmitEditRamen);
  }
};

const handleSubmitAddRamen = (e) => {
  e.preventDefault();
  const name = e.target['new-name'].value;
  const restaurant = e.target.restaurant.value;
  const image = e.target.image.value;
  const rating = e.target.rating.value;
  const comment = e.target['new-comment'].value;
  const newRamen = { name, restaurant, image, rating, comment };

  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRamen),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to add new ramen');
    }
    // If the new ramen is added successfully, display the updated list of ramens
    displayRamens();
  })
  .catch(error => {
    console.error('Error adding new ramen:', error);
  });

  e.target.reset();
};

const handleSubmitEditRamen = (e) => {
  e.preventDefault();
  const rating = e.target.rating.value;
  const comment = e.target['new-comment'].value;
  const ramenId = e.target.ramenId.value; // Retrieve the ID of the ramen being updated

  // Update the ramen's rating and comment on the server
  fetch(`${baseUrl}/${ramenId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating, comment }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update ramen');
    }
    // If the ramen is updated successfully, display the updated details
    displayRamenDetails(ramenId);
  })
  .catch(error => {
    console.error('Error updating ramen:', error);
  });

  e.target.reset();
};

const handleDeleteRamen = (ramenId) => {
  // Delete the ramen from the server
  fetch(`${baseUrl}/${ramenId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete ramen');
    }
    // If the ramen is deleted successfully, remove it from the UI
    const ramenElement = document.querySelector(`[data-ramen-id="${ramenId}"]`);
    if (ramenElement) {
      ramenElement.remove();
    }
    // If the deleted ramen is currently displayed in the ramen-detail div, clear its details
    const displayedRamenId = document.querySelector("#edit-ramen-id").value;
    if (displayedRamenId === ramenId) {
      clearRamenDetails();
    }
  })
  .catch(error => {
    console.error('Error deleting ramen:', error);
  });
};

const clearRamenDetails = () => {
  const img = document.querySelector("#ramen-detail > .detail-image");
  const name = document.querySelector("#ramen-detail > .name");
  const restaurant = document.querySelector("#ramen-detail > .restaurant");
  const rating = document.getElementById("rating-display");
  const comment = document.getElementById("comment-display");
  const editForm = document.getElementById("edit-ramen");
  const editRamenId = document.getElementById("edit-ramen-id");

  img.src = "./assets/image-placeholder.jpg";
  img.alt = "Insert Name Here";
  name.innerText = "Insert Name Here";
  restaurant.innerText = "Insert Restaurant Here";
  rating.innerText = "Insert rating here";
  comment.innerText = "Insert comment here";
  editRamenId.value = ""; // Clear the ID of the ramen in the hidden input field
};

const displayRamens = () => {
  fetch(baseUrl)
    .then(res => res.json())
    .then(food => {
      const menu = document.getElementById("ramen-menu");
      menu.innerHTML = ""; // Clear previous content
      food.forEach(ramen => {
        const img = document.createElement("img");
        img.src = ramen.image;
        img.setAttribute("data-ramen-id", ramen.id); // Set data attribute for ramen ID
        img.addEventListener("click", () => handleClick(ramen));
        
        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent the click event from bubbling up to the image
          handleDeleteRamen(ramen.id);
        });
        
        const ramenContainer = document.createElement("div");
        ramenContainer.appendChild(img);
        ramenContainer.appendChild(deleteButton);
        menu.appendChild(ramenContainer);
      });
      // Check if there are any ramens
      if (food.length > 0) {
        // Display details of the first ramen
        handleClick(food[0]);
      } else {
        // If there are no ramens, clear the details
        clearRamenDetails();
      }
    })
    .catch(error => console.error("Error fetching ramen data:", error));
};

const displayRamenDetails = (ramenId) => {
  fetch(`${baseUrl}/${ramenId}`)
    .then(res => res.json())
    .then(ramen => {
      // Display details of the specified ramen
      handleClick(ramen);
    })
    .catch(error => console.error("Error fetching ramen details:", error));
};

const main = () => {
  displayRamens();
  addSubmitListeners();
};

main();

// Export functions for testing
export {
  displayRamens,
  displayRamen,
  addSubmitListener,
  handleSubmit,
  handleClick,
  main,
};