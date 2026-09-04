const deleteUserButtons =
  document.querySelectorAll('.delete-user');

deleteUserButtons.forEach(function (button) {
  button.addEventListener('click', async function () {
    const userId = button.dataset.userId;
    const userName = button.dataset.userName;

    const confirmed = window.confirm(
      `Delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    button.disabled = true;

    try {
      const response = await fetch(`/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(
          `The user could not be deleted (${response.status}).`
        );
      }

      window.location.reload();
    } catch (error) {
      window.alert(error.message);
      button.disabled = false;
    }
  });
});