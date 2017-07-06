var SearchDeclaration = function () {

	return {
        goBack: function () {
            element(by.css('[ng-click="back()"]')).click();
        },

        fillInputFields: function (discussion) {
            var searchField = element(by.model('caseid'));

            searchField.click().sendKeys('13');
		},

        search: function() {
            element(by.css('[ng-click="search()"]')).click();
        }
	};
};

module.exports = SearchDeclaration();