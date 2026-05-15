import { Router } from 'express';
import { User } from '../../modules/users/user.model.js'
export const router = Router();

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password; 
  return user;
};

{/*User Route */ }
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// {/* GET DYNAMIC ROUTE */ }
// router.get('/:id', (req, res) => {
//   const id = (req.params.id) - 1;
//   res.send(users[id]);
// });


{/* POST new user*/ }
router.post('/', async (req, res) => {
  const { username, email, password, role} = req.body || {};

  {/*Error handling */ }
  if (!username || !email || !password) {
    const err = new Error('Missing required fields: username, email, and password are required.');
    err.name = 'ValidationError';
    err.status = 400;
    return res.status(400).json({ success: false, error: err });
  }
  try {
    const doc = await User.create({ username, email, password, role });

    return res.status(201).json({ success: true, data: userResponse(doc) });
  } catch (err) {
    
    console.error('Error creating user:', err);
    return res.status(500).json({ success: false, error: err });
  }
});

// {/* PUT update user*/ }
// router.put('/:id', (req, res) => {
//   // const userId = parseInt(req.params.id);
//   // const usersIndex = users.findIndex(u => u.id === (userId));

//   // if (usersIndex !== -1) {
//   //   users[usersIndex] = { id: userId, ...req.body };
//   //   res.json({ message: 'User updated', user: users[usersIndex] });
//   // } else {

//   //   res.status(404).json({ message: 'User not found' });
//   // }

//   {/*P'Neeti method */ }
//   const user = users.find(u => u.id === parseInt(req.params.id));
//   const { username,email,password } = req.body;
//   if (user) {
//     user.usersname = username;
//     user.email = email;
//     user.password = password;

//     res.status(200).json(user);
//   } else {

//     res.status(404).json({ message: 'User not found' });

//   }
// });


// {/* DELETE user data*/ }
// router.delete('/:id', (req, res)=>{
//   const userId = parseInt(req.params.id);
//   const usersIndex = users.findIndex(u => u.id === userId);
  
//   if(usersIndex !== -1){
//     users.splice(usersIndex,1);
//     res.json({message: 'User deleted successfully', users: users}); 
//   } else {
//     res.status(404).json({message: 'User not found'});
//   }


// })