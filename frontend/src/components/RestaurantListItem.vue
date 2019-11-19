<template>
    <div class="column is-narrow">
        <article class="media restaurant">
            <figure class="media-left">
                <p class="image">
                    <img alt="restaurant image" :src="photoUrl" class="restaurant__img">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <p>
                        <span class="restaurant__heading is-inline-block">{{name}}</span>
                        <restaurant-mood :sentiment="avgSentiment" class="icon-mood"></restaurant-mood>
                        <span class="restaurant__address is-block has-text-weight-light is-italic">{{address}}</span>
                        <span class="restaurant__prompt is-block">Have you been here? Let us know what you thought.</span>
                    </p>
                    <p>
                        <a href="#"
                           class="is-inline-block icon is-small restaurant__thumbs"
                           :class="thumbsUpClass"
                           @mouseenter="thumbsUpHoverState = !thumbsUpHoverState"
                           @mouseleave="thumbsUpHoverState = !thumbsUpHoverState"
                           @click.prevent.stop="$parent.$emit('history', restaurant, 'thumbsUp')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 class="icon icon-thumbs-up icon-thumbs-up icon-thumbs--inverted">
                                <path class="primary"
                                      d="M13 4.8l2.92 6.8a1 1 0 0 1 .08.4v8a2 2 0 0 1-2 2H8a4.28 4.28 0 0 1-3.7-2.45L2.07 14.4A1 1 0 0 1 2 14v-2a3 3 0 0 1 3-3h4V5a3 3 0 0 1 3-3 1 1 0 0 1 1 1v1.8z" />
                                <rect width="4" height="11" x="18" y="11" class="secondary" rx="1" />
                            </svg>
                        </a>
                        <a href="#"
                           class="is-inline-block icon is-small restaurant__thumbs"
                           :class="thumbsDownClass"
                           @mouseenter="thumbsDownHoverState = !thumbsDownHoverState"
                           @mouseleave="thumbsDownHoverState = !thumbsDownHoverState"
                           @click.prevent.stop="$parent.$emit('history', restaurant, 'thumbsDown')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 class="icon icon-thumbs-down icon-thumbs--inverted">
                                <path class="primary"
                                      d="M11 19.2l-2.92-6.8A1 1 0 0 1 8 12V4c0-1.1.9-2 2-2h6c1.5 0 3.11 1.06 3.7 2.45l2.22 5.16A1 1 0 0 1 22 10v2a3 3 0 0 1-3 3h-4v4a3 3 0 0 1-3 3 1 1 0 0 1-1-1v-1.8z" />
                                <rect width="4" height="11" x="2" y="2" class="secondary" rx="1"
                                      transform="rotate(180 4 7.5)" />
                            </svg>
                        </a>
                    </p>
                    <p class="restaurant__label__container">
                        <span class="restaurant__label restaurant__label--reviews">
                            Reviews:
                        </span>
                        <span>{{reviewCount}}</span>
                        <br>
                        <span class="restaurant__label restaurant__label--price">Price Level:</span>
                        <span>{{priceLevel}}</span>
                    </p>
                </div>
            </div>
            <div class="media-right">
                <span class="status-indicator is-block has-text-right"
                      :class="isOpen ? 'status-indicator--open': 'status-indicator--closed'"
                      v-if="showIsOpen">
                    {{isOpen | isOpenAsText}}
                </span>
                <span class="restaurant__rating is-block has-text-right">
                    <span class="restaurant__score">{{score}}</span>
                    <span class="restaurant__total">/5</span>
                </span>
            </div>
        </article>
    </div>
</template>

<script>
  import Client from '../backend-client';
  import constants from '../constants';
  import RestaurantMood from './RestaurantMood';

  export default {
    name: 'restaurant-list-item',
    components: { RestaurantMood },
    data: function() {
      return {
        textPriceLevels: {
          0: 'Free',
          1: 'Inexpensive',
          2: 'Moderate',
          3: 'Expensive',
          4: 'Very Expensive',
        },
        client: new Client(),
        photoUrl: '',
        thumbsUpHoverState: false,
        thumbsDownHoverState: false,
        avgSentiment: 0
      };
    },
    props: {
      restaurant: Object,
    },
    computed: {
      name() {
        return this.restaurant.name;
      },
      priceLevel() {
        return this.priceLevelAsText(this.restaurant['price_level']);
      },
      reviewCount() {
        return this.restaurant['user_ratings_total'];
      },
      score() {
        return this.restaurant['rating'];
      },
      showIsOpen() {
        return typeof this.restaurant['opening_hours'] !== 'undefined';
      },
      isOpen() {
        return this.restaurant['opening_hours']['open_now'];
      },
      address() {
        return this.restaurant['formatted_address'] || this.restaurant['vicinity'];
      },
      thumbsUpClass() {
        const isThumbsUpRating = this.hasThumbRating() && this.restaurant['thumb_rating'] === constants.THUMBS_UP;
        return this.thumbsUpHoverState || isThumbsUpRating ? 'restaurant__thumbs--up' : '';
      },
      thumbsDownClass() {
        const isThumbsDownRating = this.hasThumbRating() && this.restaurant['thumb_rating'] === constants.THUMBS_DOWN;
        return this.thumbsDownHoverState || isThumbsDownRating ? 'restaurant__thumbs--down' : '';
      }
    },
    methods: {
      priceLevelAsText(priceLevel) {
        return this.textPriceLevels[priceLevel];
      },
      hasThumbRating() {
        return typeof this.restaurant['thumb_rating'] !== 'undefined';
      },
      async getPhotoFromReference() {
        try {
          const { photos } = this.restaurant;
          if(typeof photos === 'undefined') {
            this.photoUrl = this.client.placeholder;
            return;
          }
          const photoReference = photos[0]['photo_reference'];
          this.photoUrl = await this.client.placePhoto(photoReference);
        } catch(error) {
          this.photoUrl = this.client.placeholder;
        }
      },
      async getAverageSentiment() {
        try {
          const placeId = this.restaurant['place_id'];
          const response = await this.client.fetchSentiment(placeId);
          this.avgSentiment = response.avgSentiment;
        } catch(error) {
          this.avgSentiment = 0;
        }
      }
    },
    mounted() {
      this.getPhotoFromReference();
      this.getAverageSentiment();
    },
    filters: {
      isOpenAsText(isOpen) {
        return isOpen ? 'Open' : 'Closed';
      }
    }
  };
</script>

<style scoped>
    .restaurant__img {
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        width: 200px;
        height: 236px;
        position: relative;
        top: 0;
    }

    .restaurant {
        width: 936px;
        height: 275px;
        border-radius: 2px;
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        padding: 17px;
    }

    .restaurant__heading {
        font-weight: bold;
        font-size: 27px;
        line-height: 37px;
        word-wrap: break-word;
        margin-bottom: 5px;
    }

    .restaurant__address {
        font-size: 15px;
        line-height: 20px;
        margin-bottom: 15px;
    }

    .restaurant__prompt {
        font-size: 15px;
        line-height: 20px;
        letter-spacing: 0.23px;
    }

    .restaurant__label__container {
        position: relative;
        top: 10px;
    }

    .restaurant__label {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 14px;
        letter-spacing: 1.63px;
    }

    .restaurant__label--reviews {
        margin-right: 30px;
    }

    .restaurant__label--price {
        margin-right: 5px;
    }

    .restaurant__thumbs {
        width: 44px;
        height: 44px;
        border-radius: 22px;
        background-color: #F7F7F7;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
        text-align: center;
        padding-top: 10px;
        margin-right: 5px;
    }

    .restaurant__thumbs--up {
        background-color: #FCEFC7;
    }

    .restaurant__thumbs--down {
        background-color: #F29B9B;
    }

    .restaurant__thumbs--up .primary,
    .restaurant__thumbs--up .secondary {
        fill: #F7D070;
    }

    .restaurant__thumbs--down .primary,
    .restaurant__thumbs--down .secondary {
        fill: #E66A6A;
    }

    .restaurant__rating {
        position: relative;
        top: 155px;
    }

    .restaurant__score {
        font-weight: bold;
        font-size: 42px;
    }

    .restaurant__total {
        font-size: 22px;
    }

    .status-indicator::before {
        width: 8px;
        height: 8px;
        content: '';
        display: inline-block;
        border-radius: 4px;
        vertical-align: center;
        margin-right: 4px;
        margin-bottom: 2px;
    }

    .status-indicator--closed::before {
        background-color: #BA2525;
    }

    .status-indicator--open::before {
        background-color: #2F8132;
    }

    .icon-thumbs--inverted {
        transform: scale(-1, 1);
    }

    .icon-mood {
        margin-left: 7px;
    }

    .primary, .secondary {
        fill: #E1E1E1;
    }
</style>
