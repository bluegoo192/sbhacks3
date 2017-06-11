var app = new Vue({
  el: '#app',
  data: {
    queryString: 'price',
    areaToolLabel: 'Area'
  },
  methods: {
    resetSort: function () {
      globals.initLayer.setDefinitionExpression("");
    }
  },
  computed: {
    activeQuery: function () {
      return queries[this.queryString];
    }
  }
})

console.log('reached')
