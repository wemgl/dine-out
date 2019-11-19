/**
 * A wrapper class around the API endpoints exposed by the backend server. It handles making
 * the actual API request, error handling, and formatting the JSON response that's returned
 * for use by the Vue components.
 */
class GoogleMapsClient {
  /**
   * Placeholder image when a restaurant has no photo
   * @type {string}
   */
  placeholder = 'https://via.placeholder.com/200x236/7E7E7E/F9DA8B?text=Dine+Out';

  /**
   * Retrieves the set of restaurants which match the user's search query.
   * @param {string} query The search query.
   * @param {string} pageToken The token that references another page of search results.
   * @returns {Promise<{nextPageToken: *, searchResults: *}>} An object consisting of
   * either an error or the search results and the token to retrieve another page of results, if any.
   */
  async textSearch(query, pageToken = '') {
    const cleanQuery = query.trim();
    if(cleanQuery.length > 0) {
      const input = encodeURIComponent(cleanQuery);
      const url = `/api/restaurants?q=${input}&pagetoken=${encodeURIComponent(pageToken)}`;
      const response = await fetch(url);
      const json = await response.json();
      if(response.ok) {
        return {
          searchResults: json.results,
          nextPageToken: json['next_page_token']
        };
      } else {
        throw response;
      }
    }
  }

  /**
   * Retrieves restaurant search results within the area located around the user's IP address
   * @param {string} pageToken The token that references another page of search results.
   * @returns {Promise<{error: string}|{nextPageToken: *, searchResults: *}>} An object consisting of
   * either an error or the search results and the token to retrieve another page of results, if any.
   */
  async restaurantSearch(pageToken = '') {
    const url = `/api/restaurants?pagetoken=${encodeURIComponent(pageToken)}`;
    const response = await fetch(url);
    const json = await response.json();
    if(response.ok) {
      return {
        searchResults: json.results,
        nextPageToken: json['next_page_token']
      };
    } else {
      throw response;
    }
  }

  /**
   * Performs a search specifically for restaurants within the user's location using their current
   * latitude and longitude.
   * @param {string} pageToken The token that references another page of search results.
   * @returns {Promise<{nextPageToken: *, searchResults: *}>} An object consisting of
   * either an error or the search results and the token to retrieve another page of results, if any.
   */
  async nearbySearch(pageToken = '') {
    const url = `/api/restaurants/nearby?pagetoken=${encodeURIComponent(pageToken)}`;
    const response = await fetch(url);
    const json = await response.json();
    if(response.ok) {
      return {
        searchResults: json.results,
        nextPageToken: json['next_page_token']
      };
    } else {
      throw response;
    }
  }

  /**
   * Creates a request that retrieves a restaurant's photo using its photo reference.
   * @param {string} photoReference The photo reference of the restaurant photo.
   * @returns {Promise<string>} A URL to the photo referenced by photoReference.
   */
  async placePhoto(photoReference) {
    try {
      const url = `/api/photos?photoreference=${encodeURIComponent(photoReference)}&maxwidth=200`;
      const response = await fetch(url);
      const json = await response.json();
      return decodeURIComponent(json.photoUrl);
    } catch(error) {
      return this.placeholder;
    }
  }

  /**
   * Performs a request that saves the restaurant and its thumb rating to the database.
   * @param restaurant The restaurant being rated.
   * @param rating The thumb up or down rating.
   * @returns {Promise<any>}
   */
  async saveToHistory(restaurant, rating) {
    const url = `/api/restaurants/thumb-rating`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: restaurant,
        thumbRating: rating
      })
    });
    return response.json();
  }

  /**
   * Retrieves the history of restaurants the user has rated.
   * @returns {Promise<any>} A Promise that wraps the list of restaurants
   * the user has rated.
   */
  async fetchHistory() {
    try {
      const url = `/api/restaurants/history`;
      const response = await fetch(url);
      return await response.json();
    } catch(error) {
      throw error;
    }
  }

  /**
   * Requests the average sentiment score for the given place.
   * @param {string} placeId The place to get the sentiment score for.
   * @returns {Promise<any>} A Promise that wraps the average sentiment
   * score of the restaurant associated with placeId.
   */
  async fetchSentiment(placeId) {
    try {
      const url = `/api/restaurants/sentiment?placeid=${placeId}`;
      const response = await fetch(url);
      return await response.json();
    } catch(error) {
      throw error;
    }
  }
}

export default GoogleMapsClient;
