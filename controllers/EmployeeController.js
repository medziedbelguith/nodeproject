const Employee=require('../models/Employee')

//Show all employees
const index=(req,res,next)=>
{
    if(req.query.page && req.query.limit)
    {
Employee.paginate({}, { page: req.query.page, limit: req.query.limit })
    .then(response=>{
        res.json({
                response
            })
    })

.catch(error=>
    {
        res.json({
            message:'An Error has Occured'+error
        })
    })
}
else{
    Employee.find()
    .then(response=>{
        res.json({
                response
            })
    })

.catch(error=>
    {
        res.json({
            message:'An Error has Occured'+error
        })
    })    
}

}

//Show single Employee
const show=(req,res,next)=>
{
    let employeeID=req.body.employeeID
    Employee.findById(employeeID)
    .then(response=>{
        res.json(
            {
                response
            }
        )
    })
    .catch(error=>{
        res.json(
            {
        message:'An error Occured!'
            }
        )
       
    })
}
//Add Employee
const store=(req,res,next)=>{
    let employee=new Employee({
        name:req.body.name,
        designation:req.body.designation,
        email:req.body.email,
        phone:req.body.phone
    })
    if(req.files){
        let path = ''
        req.files.forEach(function(files,index,arr)
        {
           path=path + files.path + ','
        })
        path=path.substring(0,path.lastIndexOf(","))
        employee.avatar=path
    }
    employee.save()
    .then(response=>{
        res.json({
            message:'Employee Added Successfully'
        })
    })
    .catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    }
        )
    
}

// Update an employee
const update=(req,res,next)=>{
    let employeeID=req.body.employeeID
    let updatedData={
        name:req.body.name,
        designation:req.body.designation,
        email:req.body.email,
        phone:req.body.phone,
    }
  


Employee.findByIdAndUpdate(employeeID,{$set:updatedData})
.then(()=>{
    res.json({
        message:'Employee updated suucessfully!'
    })
})
.catch(error=>{
    res.json({
        message:'An error Occured!'
    })
}
    )
}

// delete an employee
const destroy=(req,res,next)=>{
    let employeeID=req.body.employeeID
    Employee.findOneAndRemove(employeeID)
    .then(()=>{
        res.json({
            message:'Employee deleted suuccessfully!'
        })
    })
    .catch(error=>{
        res.json({
            message:'An error Occured!'
        })
    })
}
module.exports={
    index, show, store, update, destroy
}
