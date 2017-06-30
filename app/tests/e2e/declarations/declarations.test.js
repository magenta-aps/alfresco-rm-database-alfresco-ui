var createDeclaration = require('./createDeclaration.po.js');
var editDeclaration = require('./editDeclaration.po.js');
var searchDeclaration = require('./searchDeclaration.po.js');

describe('declarations', function() {
    it('should go to create new declaration page', function() {
        createDeclaration.goToCreateDeclarationPage();
        expect(browser.getCurrentUrl()).toContain('/erklaeringer/opret');
    });

    it('should fill in basic info', function() {
        createDeclaration.fillInputFields();
        createDeclaration.createDeclaration();
        expect(browser.getCurrentUrl()).toContain('/patientdata');
        createDeclaration.waitForSolr();
        expect(createDeclaration.getDeclarationTitle()).toContain('Jens Rasmussen');
    });

    it('should not be able to edit the fields', function() {
        expect(editDeclaration.findMainCharge().getAttribute('disabled')).toBe('true');
    })

    it('should edit the declaration', function() {
        editDeclaration.editDeclarationPage();
        expect(browser.getCurrentUrl()).toContain('/patientdata/rediger');
        editDeclaration.fillInputFields();
        editDeclaration.finishEditing();
        expect(editDeclaration.findMainCharge().getAttribute('value')).toBe('Disrupter');
    })

    it('should go back to search', function() {
        searchDeclaration.goBack();
        expect(browser.getCurrentUrl()).toContain('/erklaeringer');
    });

    it('should search for a case', function() {
        searchDeclaration.fillInputFields();
        searchDeclaration.search();
        expect(browser.getCurrentUrl()).toContain('/erklaeringer/13/patientdata');
    });
});