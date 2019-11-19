<template>
    <section class="section is-paddingless">
        <div class="container is-fluid is-paddingless">
            <nav class="navbar navbar--bordered navbar--centered" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a class="navbar-item" href="#">
                        <span class="logo">D.O.</span>
                    </a>
                </div>
                <div class="navbar-menu is-active">
                    <div class="navbar-start">
                        <div class="field is-grouped">
                            <div class="level">
                                <div class="level-item">
                                    <p class="control is-expanded">
                                        <label for="search" class="label is-hidden">Search Query</label>
                                        <input id="search"
                                               type="text"
                                               class="input is-small is-rounded search"
                                               placeholder="e.g. Ramen"
                                               v-model="query"
                                               @keyup.enter="$emit('search', query)">
                                    </p>
                                    <p class="control">
                                        <button class="button is-primary is-small is-rounded search-button">
                                            <span class="search-button__text"
                                                  @click="$emit('search', query)">Search</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <img alt="profile image" src="../assets/profilepic.jpg" class="profile__img">
                        </div>
                    </div>
                </div>
            </nav>
            <nav class="navbar navbar--bordered navbar--centered level" role="navigation" aria-label="sub navigation">
                <ul class="level-item has-text-centered">
                    <li class="navbar__list-item">
                        <a href="#"
                           class="navbar__link"
                           :class="isRestaurantSearch || isTextSearch ? 'navbar__link--active' : ''"
                           @click="$emit('restaurantSearch')">All</a>
                    </li>
                    <li class="navbar__list-item">
                        <a href="#"
                           class="navbar__link"
                           :class="isNearbySearch ? 'navbar__link--active' : ''"
                           @click="$emit('nearbySearch')">Nearby</a>
                    </li>
                    <li class="navbar__list-item">
                        <a href="#" class="navbar__link"
                           :class="isHistorySearch ? 'navbar__link--active' : ''"
                           @click="$emit('fetchHistory')">History</a>
                    </li>
                </ul>
            </nav>
        </div>
    </section>
</template>

<script>
  import constants from '../constants';

  export default {
    name: 'nav-bar',
    data: function() {
      return {
        query: ''
      };
    },
    props: {
      searchType: String
    },
    computed: {
      isTextSearch() {
        return this.searchType === constants.SEARCH_TYPE_TEXT;
      },
      isRestaurantSearch() {
        return this.searchType === constants.SEARCH_TYPE_RESTAURANT;
      },
      isNearbySearch() {
        return this.searchType === constants.SEARCH_TYPE_NEARBY;
      },
      isHistorySearch() {
        return this.searchType === constants.SEARCH_TYPE_HISTORY;
      }
    }
  };
</script>

<style scoped>
    .logo {
        font-weight: bolder;
        color: #222;
        font-size: 33px;
    }

    .search {
        margin-left: 31px;
        margin-right: 17px;
        width: 261px;
        height: 28px;
        border: 1px solid #CBD2D9;
    }

    .search-button {
        background-color: #F7D070 !important;
        color: #3B3B3B !important;
        width: 70px;
        height: 26px;
    }

    .search-button__text {
        margin-top: -2px;
    }

    .navbar--bordered {
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    }

    .navbar--centered {
        padding-left: 32px;
        padding-right: 32px;
    }

    .navbar__list-item {
        margin-right: 12px;
        font-size: 14px;
    }

    .navbar__link {
        text-decoration: underline;
        color: #222;
    }

    .navbar__link--active {
        font-weight: bold;
    }

    .navbar__link--active::before {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #F7D070;
        margin: -8px auto 0 auto;
    }

    .profile__img {
        border-radius: 16px;
    }
</style>
