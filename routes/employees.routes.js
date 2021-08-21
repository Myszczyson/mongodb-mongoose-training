const express = require('express');
const router = express.Router();
const Employee = require('../models/employees.model');
const Department = require('../models/department.model');

router.get('/employees', async (req, res) => {
  try {
    res.json(await Employee.find().populate('department'));
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/employees/random', async (req, res) => {

  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const emp = await Employee.findOne().skip(rand).populate('department');
    if(!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

router.get('/employees/:id', async (req, res) => {

  try {
    const emp = await Employee.findById(req.params.id).populate('department');
    if(!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

router.post('/employees', async (req, res) => {
  
try {

  const { firstName, lastName, department } = req.body;
  let empDepartment;
  
  try {
  empDepartment = await Department.findById( department )
  } finally {
    if(!empDepartment){
      res.status(404).json({ message: 'Department not found...' });
      return
    }
  }

  const newEmployee = new Employee({ firstName: firstName, lastName: lastName, department: department });
  await newEmployee.save();
  const emp = await Employee.findById(newEmployee.id).populate('department');
  res.json(emp);

} catch(err) {
  res.status(500).json({ message: err });
}

});

router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;

  let empDepartment;
  
  try {
  empDepartment = await Department.findById( department )
  } finally {
    if(!empDepartment){
      res.status(404).json({ message: 'Department not found...' });
      return
    }
  }

  try {
    const emp = await Employee.findById(req.params.id)
    if(emp) {
      emp.firstName = firstName;
      emp.lastName = lastName;
      emp.department = department;
      await emp.save();
      res.json(emp);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

router.delete('/employees/:id', async (req, res) => {

  try {
    const emp = await Employee.findById(req.params.id).populate('department');
    if(emp) {
      await Employee.deleteOne({ _id: req.params.id });
      res.json(emp);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

});

module.exports = router;
