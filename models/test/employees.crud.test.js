const Employee = require('../employees.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
});

describe('Employee', () => {
    before(async () => {
        const testEmpOne = new Employee({ firstName: 'First Name #1', lastName: 'Last Name #1', department: 'Department #1' });
        await testEmpOne.save();
    
        const testEmpTwo = new Employee({ firstName: 'First Name #2', lastName: 'Last Name #2', department: 'Department #2' });
        await testEmpTwo.save();
      });
    

    it('should return all the data with "find" method', async () => {
        const employees = await Employee.find();
        const expectedLength = 2;
        expect(employees.length).to.be.equal(expectedLength);
    });


    it('should return a proper document by args value with "findOne" method', async () => {
        const expectedFirstName = 'First Name #1';
        const expectedLastName = 'Last Name #2';
        const expectedDepartment = 'Department #2';

        const firstNameTest = await Employee.findOne({ firstName: expectedFirstName });
        const lastNameTest = await Employee.findOne({ lastName: expectedLastName });
        const departmentTest = await Employee.findOne({ department: expectedDepartment });
        
        expect(firstNameTest.firstName).to.be.equal(expectedFirstName);
        expect(lastNameTest.lastName).to.be.equal(expectedLastName);
        expect(departmentTest.department).to.be.equal(expectedDepartment);
    }); 

    after(async () => {
        await Employee.deleteMany();
    });
});

describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
        const employee = new Employee({ firstName: 'First Name #3', lastName: 'Last Name #3', department: 'Department #3' });
        await employee.save();
        expect(employee.isNew).to.be.false;
    });

    after(async () => {
        await Employee.deleteMany();
    });
});

describe('Updating data', () => {
    beforeEach(async () => {
        const testEmpOne = new Employee({ firstName: 'First Name #1', lastName: 'Last Name #1', department: 'Department #1' });
        await testEmpOne.save();
    
        const testEmpTwo = new Employee({ firstName: 'First Name #2', lastName: 'Last Name #2', department: 'Department #2' });
        await testEmpTwo.save();
      });

    it('should properly update one document with "updateOne" method', async () => {
        await Employee.updateOne({ firstName: 'First Name #1' }, { $set: { firstName: '=First Name #1=' }});
        const updatedEmployee = await Employee.findOne({ firstName: '=First Name #1=' });
        expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
        const employee = await Employee.findOne({ lastName: 'Last Name #2' });
        employee.lastName = '=Last Name #2=';
        await employee.save();
      
        const updatedEmployee = await Employee.findOne({ lastName: '=Last Name #2=' });
        expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
        await Employee.updateMany({}, { $set: { department: 'Updated Department!' }});
        const employees = await Employee.find({ department: 'Updated Department!' });
        expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
        await Employee.deleteMany();
    });
});

describe('Removing data', () => {
    beforeEach(async () => {
        const testEmpOne = new Employee({ firstName: 'First Name #1', lastName: 'Last Name #1', department: 'Department #1' });
        await testEmpOne.save();
    
        const testEmpTwo = new Employee({ firstName: 'First Name #2', lastName: 'Last Name #2', department: 'Department #2' });
        await testEmpTwo.save();
      });

    it('should properly remove one document with "deleteOne" method', async () => {
        await Employee.deleteOne({ firstName: 'First Name #1' });
        const removeEmployee = await Employee.findOne({ firstName: 'First Name #1' });
        expect(removeEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
        const employee = await Employee.findOne({ lastName: 'Last Name #2' });
        await employee.remove();
        const removedEmployee = await Employee.findOne({ lastName: 'Last Name #2' });
        expect(removedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
        await Employee.deleteMany();
        const employees = await Employee.find();
        expect(employees.length).to.be.equal(0);
    });

            
    afterEach(async () => {
        await Employee.deleteMany();
    });
});


after( async () => {
    mongoose.models = {};
});