async function sendRequest(url = "") {
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token"))
    .split("=")[1];

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}

export const queryArtist = (artistName) => {
  return sendRequest(
    `https://api.spotify.com/v1/search?q=${artistName}&type=artist`
  );
};

export const queryTracks = (artistId) => {
  return sendRequest(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`
  );
};
