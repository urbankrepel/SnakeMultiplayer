const submitForm = (event, form) => {
  event.preventDefault();
  const data = new FormData(form);
  const url = form.action;
  const method = form.method;
  return fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(data.entries())),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else if (data.message) {
        form.querySelector("#message").innerText = data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
