export function postRequest(url, command, data) {
  return fetch(`${url}${
    new URLSearchParams({command}).toString()
  }`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      data
    })
  });
}

export function getRequest(url, command, data) {
  return fetch(`${url}${
    new URLSearchParams({
      data: JSON.stringify(data),
      command
    }).toString()
  }`, {
    method: 'GET'
  });
}

