var app = new Vue({
  el: '#app',
  data: {
    queryString: 'price'
  },
  computed: {
    activeQuery: function () {
      switch(this.queryString) {
        case 'price':
          return priceQuery;
          break;
        case 'deposit':
          return depositQuery;
          break;
        case 'bedrooms':
          return bedQuery;
          break;
        case 'bathrooms':
          return bathQuery;
          break;
        case 'maxoccupants':
          return occupancyQuery;
          break;
        case 'rating':
          return ratingQuery;
          break;
        default:
          console.log("wtf just happened")
      }
    }
  }
})

console.log('reached')
