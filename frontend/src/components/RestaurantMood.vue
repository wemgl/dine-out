<template>
    <span id="restaurant-mood" class="is-inline-block">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-mood-happy" v-if="isHappy">
            <circle cx="12" cy="12" r="10" class="primary primary--happy" />
            <path class="secondary secondary--happy"
                  d="M6.8 14h10.4a1 1 0 0 1 .86 1.5 7 7 0 0 1-12.12 0A1 1 0 0 1 6.8 14zm1.7-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-mood-neutral" v-if="isNeutral">
            <circle cx="12" cy="12" r="10" class="primary primary--neutral" />
            <path class="secondary secondary--neutral"
                  d="M8 15h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm.5-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-mood-sad" v-if="isSad">
            <circle cx="12" cy="12" r="10" class="primary primary--sad" />
            <path class="secondary secondary--sad"
                  d="M16.47 18H7.53a1 1 0 0 1-.75-1.67 6.98 6.98 0 0 1 10.44 0 1 1 0 0 1-.75 1.67zM8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
    </span>
</template>

<script>
  export default {
    name: 'restaurant-mood',
    props: {
      sentiment: {
        type: Number,
        default: 0
      },
    },
    computed: {
      isHappy() {
        return this.sentiment > 0;
      },
      isNeutral() {
        return this.sentiment === 0;
      },
      isSad() {
        return this.sentiment < 0;
      }
    },
  };
</script>

<style scoped>
    #restaurant-mood {
        /*z-index: 1;*/
        /*position: absolute;*/
        /*top: 7px;*/
        /*left: 7px;*/
    }

    .primary--happy {
        fill: #FCEFC7;
    }

    .secondary--happy {
        fill: #F7D070;
    }

    .primary--neutral {
        fill: #E1E1E1;
    }

    .secondary--neutral {
        fill: #3B3B3B;
    }

    .primary--sad {
        fill: #F29B9B;
    }

    .secondary--sad {
        fill: #E66A6A;
    }
</style>
