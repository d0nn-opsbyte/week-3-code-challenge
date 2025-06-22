document.addEventListener('DOMContentLoaded', () => {
  const postList = document.getElementById('post-list');
  const addPostBtn = document.getElementById('add-post-btn');
  const addForm = document.getElementById('add-form');
  const submitBtn = document.getElementById('submit-post');

  const baseURL = 'http://localhost:3000/posts';

   function loadPosts() {
    fetch(baseURL)
      .then(res => res.json())
      .then(posts => {
        postList.innerHTML = '';
        posts.forEach(post => renderPost(post));
      });
  }

  function renderPost(post) {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${post.title}</strong> by ${post.author}
      <button onclick="editPost(${post.id})">Edit</button>
      <button onclick="deletePost(${post.id})">Delete</button>
    `;
    postList.appendChild(li);
  }

  
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const newPost = {
      title: document.getElementById('new-title').value,
      author: document.getElementById('new-author').value,
      url: document.getElementById('new-url').value,
      content: document.getElementById('new-content').value
    };

    fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(post => {
      renderPost(post);
      addForm.reset();
      addForm.classList.add('hidden');
    });
  });

  
  window.deletePost = function(id) {
    fetch(`${baseURL}/${id}`, {
      method: 'DELETE'
    }).then(() => loadPosts());
  };

  
  window.editPost = function(id) {
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
      fetch(`${baseURL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      }).then(() => loadPosts());
    }
  };

  
  addPostBtn.addEventListener('click', () => {
    addForm.classList.toggle('hidden');
  });

  loadPosts();
});