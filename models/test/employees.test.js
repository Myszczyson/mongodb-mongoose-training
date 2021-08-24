const Employee = require('../employees.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');


describe('Employee', () => {

    it('should throw an error if no arg', () => {
        const emp = new Employee({}); // create new Employee, but don't set attr
      
        emp.validate(err => {
          expect(err.errors.firstName && err.errors.lastName && err.errors.department).to.exist;
        });

    });

    it('should throw an error if args are not a string', () => {

        const cases = [{}, []];
        for(let arg of cases) {
            const emp = new Employee({ firstName: arg, lastName: arg, department: arg });

            emp.validate(err => {
              expect(err.errors.firstName && err.errors.lastName && err.errors.department).to.exist;
            });

        }
    });

    it('should not throw an error if args are okay', () => {

        const cases = ['David', 'John', 135, 139];
        for(let arg of cases) {
          const emp = new Employee({ firstName: arg, lastName: arg, department: arg });

      
          emp.validate(err => {
            expect(err).to.not.exist;
          });
      
        }
    });

    it('should throw an error if one of args not a string', () => {

      const cases = [{}, []];
      for(let arg of cases) {
        const firstNameTest = new Employee({ firstName: arg, lastName: 'Something', department: 'Something' });
        const lastNameTest = new Employee({ firstName: 'Something', lastName: arg, department: 'Something' });
        const departmentTest = new Employee({ firstName: 'Something', lastName: 'Something', department: arg });
        
        firstNameTest.validate(err => {
          expect(err.errors.firstName).to.exist;
        });

        lastNameTest.validate(err => {
          expect(err.errors.lastName).to.exist;
        });

        departmentTest.validate(err => {
          expect(err.errors.department).to.exist;
        });
    
      }
    });

    it('should throw an error if no arg', () => {
      const firstNameTest = new Employee({ firstName: {}, lastName: 'Something', department: 'Something' });
      const lastNameTest = new Employee({ firstName: 'Something', lastName: {}, department: 'Something' });
      const departmentTest = new Employee({ firstName: 'Something', lastName: 'Something', department: {} });

      firstNameTest.validate(err => {
        expect(err.errors.firstName).to.exist;
      });

      lastNameTest.validate(err => {
        expect(err.errors.lastName).to.exist;
      });

      departmentTest.validate(err => {
        expect(err.errors.department).to.exist;
      });

    });

    
    after(() => {
        mongoose.models = {};
    });
  });

