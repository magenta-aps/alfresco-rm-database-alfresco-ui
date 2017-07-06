var CreateDeclaration = function () {

	return {
        goToCreateDeclarationPage: function () {
            element.all(by.css('[ng-click="createNewDeclaration($event)"]')).click();
        },

        fillInputFields: function (discussion) {
            var cpr = element(by.model('case.cprNumber'));
            var firstName = element(by.model('case.firstName'));
            var lastName = element(by.model('case.lastName'));
            var address = element(by.model('case.address'));
            var postbox = element(by.model('case.postbox'));
            var city = element(by.model('case.city'));

            cpr.click().sendKeys('1205874491');
            firstName.click().sendKeys('Jens');
            lastName.click().sendKeys('Rasmussen');
            address.click().sendKeys('Lollandsgade 16');
            postbox.click().sendKeys('8000');
            city.click().sendKeys('Aarhus');
		},

        createDeclaration: function() {
            element.all(by.css('[ng-click="submit()"]')).click();
        },

        waitForSolr: function() {
            browser.driver.sleep(15000);
            browser.refresh();
        },

        getDeclarationTitle: function() {
            return element(by.id('case-title')).getText();
        },

		// getDiscussionList: function () {
		// 	discussionList = element.all(by.css('td a.od-filebrowser-link h3'));
		// 	return discussionList.getInnerHtml();
		// },

		// getDiscussionThreadTitle: function() {
		// 	return element(by.css('h1.discussion-title'));
		// },

		// getCreatedDiscussion: function () {
		// 	return discussionName;
		// },

		// gotoDiscussionsTab: function() {
		// 	return element(by.xpath('//md-tabs/md-tabs-wrapper/md-tabs-canvas/md-pagination-wrapper/md-tab-item[2]')).click();
		// },

		// goBackToDiscussions: function() {
		// 	return element(by.css('.discussion-back')).click();
		// },

		// openCreateDiscussionDialog: function () {
		// 	return element(by.css('[aria-label="ny diskussion"]')).click();
		// },

		// createDiscussion: function () {
		// 	return element(by.css('[aria-label="New conversation"] button[type="submit"]')).click();
		// },

		// openFirstDiscussion: function () {
        //     element.all(by.css('td a.od-filebrowser-link')).first().click();
		// }
	};
};

module.exports = CreateDeclaration();