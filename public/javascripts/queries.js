//WHEN YOU MAKE A NEW QUERY, MAKE SURE ANY ATTRIBUTES IT USES ARE LISTED IN 'OUTFIELDS' IN CALLBACKERINO

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
    if (!this.check(target)) {
      console.log('failed check');
      return 0;//if the house doesn't meet our criteria, automatically reject
    }
    var cumulativeScore = 0;
    for (var i=0; i<this.sortingPriorities.length; i++) {
      cumulativeScore += this.sortingPriorities[i](target);
    }
    var averageScore = cumulativeScore / this.sortingPriorities.length;
    return averageScore;
  };
}

//use this whenever you *don't* want to filter results
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
    return (target.attributes.price / 1800);//any large number will do, we just need the normalizedPrice to be less than 10
  }
];
var depositPriority = [
  function (target) {
    return (target.attributes.deposit / 3330);//any large number will do, we just need the normalizedPrice to be less than 10
  }
];
var bedPriority = [
  function (target) {
    return (target.attributes.bedrooms * 1.25);//any large number will do, we just need the normalizedPrice to be less than 10
  }
];
var bathPriority = [
  function (target) {
    return (target.attributes.bathrooms * 1.25);//any large number will do, we just need the normalizedPrice to be less than 10
  }
];
var occupancyPriority = [
  function (target) {
    return (target.attributes.occupants * 0.66);//any large number will do, we just need the normalizedPrice to be less than 10
  }
];
var ratingPriority = [
  function (target) {
    //onsole.log(target.attributes.userrating);
    return (target.attributes.userrating);//any large number will do, we just need the normalizedPrice to be less than 10
  }
];

var queries = {
    price: new UserQuery(lowStandardsQualifier, pricePriority),
    deposit: new UserQuery(lowStandardsQualifier, depositPriority),
    bedrooms: new UserQuery(lowStandardsQualifier, bedPriority),
    bathrooms: new UserQuery(lowStandardsQualifier, bathPriority),
    maxoccupants: new UserQuery(lowStandardsQualifier, occupancyPriority),
    rating: new UserQuery(lowStandardsQualifier, ratingPriority)
}
