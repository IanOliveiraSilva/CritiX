document.addEventListener('DOMContentLoaded', () => {

    const idInput = document.getElementById('listId');
    const listId = localStorage.getItem('listId');
    const idElement = document.getElementById('listId');

    if (listId) {
        idInput.value = listId;
        idElement.textContent = listId;
    }
})


const deleteListForm = document.getElementById('delete-list-form');
deleteListForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const listId = localStorage.getItem('listId');
    
    const response = await fetch(`/api/list/?id=${encodeURIComponent(listId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
      
    });
    const data = await response.json();
    if (response.ok) {
      alert(`Lista Apagada com sucesso!`);
      window.location.href = '/getAllLists';
    } else {
      alert(data.message);
    }
  });
  

