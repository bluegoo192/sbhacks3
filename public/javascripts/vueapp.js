var app = new Vue({
  el: '#app',
  data: {
    queryString: 'price',
    areaToolLabel: 'Area'
  },
  computed: {
    activeQuery: function () {
      return queries[this.queryString];
    }
  }
})

console.log('reached')
