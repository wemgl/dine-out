<template>
    <section class="section">
        <div class="container">
            <div class="columns is-multiline is-centered">
                <restaurant-list-item
                        v-for="restaurant in restaurants"
                        :restaurant="restaurant"
                        :key="restaurant.id">
                </restaurant-list-item>
            </div>
            <div class="columns is-centered" v-if="showMore">
                <div class="column is-narrow">
                    <a href="#"
                       class="more-link is-block has-text-centered"
                       @click.prevent.stop="$emit('nextPage')">
                        <span class="is-block more-link__text">More</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-cheveron-down">
                            <path class="cheveron" fill-rule="evenodd"
                                  d="M15.3 10.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
  import RestaurantListItem from './RestaurantListItem';

  export default {
    name: 'RestaurantList',
    components: { RestaurantListItem },
    data: function() {
      return {};
    },
    props: {
      restaurants: Array,
      showMore: Boolean
    }
  };
</script>

<style scoped>
    .more-link {
        text-transform: uppercase;
        text-decoration: underline;
        color: #222;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 1.4px;
    }

    .more-link__text {
        margin-bottom: -5px;
    }

    .cheveron {
        fill: #222;
    }
</style>
