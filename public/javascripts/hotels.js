const addHotelForm = document.querySelector('#add-hotel-form');
const messageBox = document.querySelector('#hotel-message');
const deleteButtons = document.querySelectorAll('.delete-hotel');

function showError(message) {
  messageBox.textContent = message;
  messageBox.className = 'alert alert-danger';
  messageBox.hidden = false;
}

addHotelForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const submitButton = addHotelForm.querySelector(
    'button[type="submit"]'
  );

  const name = addHotelForm.elements.Name.value.trim();
  const hotelLocation =
    addHotelForm.elements.Location.value.trim();

  try {
    submitButton.disabled = true;

    const response = await fetch('/hotels', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        Name: name,
        Location: hotelLocation
      })
    });

    if (!response.ok) {
      throw new Error(
        `Could not create the hotel (${response.status}).`
      );
    }

    window.location.reload();
  } catch (error) {
    showError(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

deleteButtons.forEach(function (button) {
  button.addEventListener('click', async function () {
    const hotelId = button.dataset.hotelId;
    const hotelName = button.dataset.hotelName;

    const confirmed = window.confirm(
      `Delete ${hotelName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      button.disabled = true;

      const response = await fetch('/hotels', {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          id: hotelId
        })
      });

      if (!response.ok) {
        throw new Error(
          `Could not delete the hotel (${response.status}).`
        );
      }

      window.location.reload();
    } catch (error) {
      showError(error.message);
      button.disabled = false;
    }
  });
});