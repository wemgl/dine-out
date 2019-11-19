<template>
    <div id="app">
        <nav-bar :search-type="searchType"
                 @search="performQuery"
                 @restaurantSearch="performRestaurantSearch"
                 @nearbySearch="performNearbySearch"
                 @fetchHistory="performFetchHistoryRequest">
        </nav-bar>
        <restaurant-list
                :restaurants="searchResults"
                :show-more="nextPageToken.length > 0"
                @nextPage="performNextPageQuery"
                @history="performSaveToHistoryRequest">
        </restaurant-list>
    </div>
</template>

<script>
  import NavBar from './components/TheNavBar';
  import RestaurantList from './components/RestaurantList';
  import Client from './backend-client';
  import constants from './constants';

  export default {
    name: 'app',
    components: {
      NavBar,
      RestaurantList
    },
    data: function() {
      return {
        searchResults: [],
        restaurantHistory: [],
        error: '',
        nextPageToken: '',
        client: new Client(),
        searchType: constants.SEARCH_TYPE_TEXT,
        lastTextSearchQuery: ''
      };
    },
    methods: {
      async performQuery(query) {
        try {
          const response = await this.client.textSearch(query);
          this.updateState(response, constants.SEARCH_TYPE_TEXT, query);
        } catch(error) {
          return { error };
        }
      },
      async performRestaurantSearch() {
        try {
          const response = await this.client.restaurantSearch();
          this.updateState(response, constants.SEARCH_TYPE_RESTAURANT);
        } catch(error) {
          return { error };
        }
      },
      async performNearbySearch() {
        try {
          const response = await this.client.nearbySearch();
          this.updateState(response, constants.SEARCH_TYPE_NEARBY);
        } catch(error) {
          return { error };
        }
      },
      updateState(response, searchType, lastTextSearchQuery = '') {
        this.searchResults = response.searchResults;
        this.nextPageToken = response.nextPageToken;
        this.searchType = searchType;
        if(lastTextSearchQuery) {
          this.lastTextSearchQuery = lastTextSearchQuery;
        }
      },
      async performNextPageQuery() {
        try {
          let response;
          switch(this.searchType) {
            case constants.SEARCH_TYPE_NEARBY:
              response = await this.client.nearbySearch(this.nextPageToken);
              break;
            case constants.SEARCH_TYPE_RESTAURANT:
              response = await this.client.restaurantSearch(this.nextPageToken);
              break;
            case constants.SEARCH_TYPE_TEXT:
            default:
              response = await this.client.textSearch(this.lastTextSearchQuery, this.nextPageToken);
              break;
          }
          this.searchResults = this.searchResults.concat(response.searchResults);
          this.nextPageToken = response.nextPageToken || '';
        } catch(error) {
          return { error };
        }
      },
      async performSaveToHistoryRequest(restaurant, rating) {
        try {
          await this.client.saveToHistory(restaurant, rating);
        } catch(error) {
          return { error };
        }
      },
      async performFetchHistoryRequest() {
        try {
          this.searchResults = await this.client.fetchHistory();
          this.nextPageToken = '';
          this.searchType = constants.SEARCH_TYPE_HISTORY;
        } catch(error) {
          return { error };
        }
      }
    },
    mounted() {
      this.performRestaurantSearch();
    }
  };
</script>
