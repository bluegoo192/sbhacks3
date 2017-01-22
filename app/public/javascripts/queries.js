//A UserQuery is an object representing what the user wants.  its check() and assess() functions assign value to a house
//qualifier: object containing a list of boolean functions(qualifiers), and the # of expressions required for a target to pass(required)
//sortingPriorities: list of functions that take the target as a parameter
//the function returns a number from 0-10 based on the targeted attribute(s).  Higher number is better
function UserQuery(qualifier, sortingPriorities) {
  this.qualifier = qualifier;
  this.sortingPriorities = sortingPriorities;
  this.check = function(target) {
    var criteriaMet = 0;
    for (var i = 0; i<this.qualifier.qualifiers.length; i++) {
      if (this.qualifier.qualifiers[i](target)) { criteriaMet += 1; }
    }

    return (criteriaMet >= this.qualifier.required);
  };
  this.assess = function(target) {
    if (!this.check(target)) return 0;//if the house doesn't meet our criteria, automatically reject
    var cumulativeScore = 0;
    for (var i=0; i<this.sortingPriorities.length; i++) {
      cumulativeScore += this.sortingPriorities[i](target);
    }
    var averageScore = cumulativeScore / this.sortingPriorities.length;
    return averageScore;
  };
}

var lowStandardsQualifier = {
  required: 0,
  qualifiers: [
    function (target) {
      return true;
    }
  ]
};
var pricePriority = [
  function (target) {
    return (target.attributes.price / 350);//any large number will do, we just need the normalizedPrice to be less than 10
  }
];
