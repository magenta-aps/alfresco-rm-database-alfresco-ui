var EditDeclaration = function () {

	return {
        findMainCharge: function () {
            return element(by.model('case.mainCharge'));
        },

        editDeclarationPage: function () {
            element.all(by.css('[ng-click="toggleEdit()"]')).click();
        },

        fillInputFields: function (discussion) {
            var mainCharge = element(by.model('case.mainCharge'));

            expect(mainCharge.getAttribute('disabled')).toBe(null);

            mainCharge.click().sendKeys('Disrupter');
		},

        finishEditing: function() {
            element.all(by.css('[ng-click="toggleEdit(); saveEdit()"]')).click();
        },
	};
};

module.exports = EditDeclaration();