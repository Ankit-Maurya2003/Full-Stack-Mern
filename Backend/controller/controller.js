import TODO from '../models/todo.js'

export const hello= async (req,res)=>{
   try {
     const todos = await TODO.find().populate("createdBy", "name")
    res.status(200).json({message:"todos",todos})
   } catch (error) {
    console.log(error.message);
    
     res.status(401).json({error:error.message})
    
   }
    

}
export const send= async(req,res)=>{
 try {
       const {title,description} = req.body;
    const Todo = await TODO.create({title,description,createdBy:req.user.id}) 
    
    res.status(201).json({message:"todo store " ,Todo })
   
    
    
 } catch (error) {
    console.log(error.message);
    
     res.status(401).json({error:error.message})
    
 }
    

}
export const update= async(req,res)=>{
   try {
      const{id} = req.params;
      const {title,description} = req.body;
      const todo = await TODO.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
      )
 res.status(201).json({message:"todo update " ,todo })
    
   } catch (error) {
      console.log(error.message);
    
     res.status(401).json({error:error.message})
    
    
   }
    

}
export const deleting= async(req,res)=>{
    try {
         const{id} = req.params;
   
      const todos = await TODO.findByIdAndDelete(
        id
      ) 
      
      
    res.status(200).json({message:"todo delete"})
        
    } catch (error) {
         console.log(error.message);
    
     res.status(401).json({error:error.message})
    }
    
    

}
