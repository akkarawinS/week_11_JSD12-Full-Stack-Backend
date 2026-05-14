import { Router } from 'express';
import { users } from '../../mockData/Users.js'

export const router = Router();

{/*User Route */ }
router.get('/', (req, res) => {
  res.json(users)
});

{/* GET DYNAMIC ROUTE */ }
router.get('/:id', (req, res) => {
  const id = (req.params.id) - 1;
  res.send(users[id]);
});


{/* POST new user*/ }
router.post('/', (req, res) => {
  const { username, email, password } = req.body || {};
  {/*Error handling */ }
  if (!username || !email) {
    res.status(400).json({ error: "username and email are required" });
  }
  {/*Get id by reduce method*/ }
  // const nextId = String((users.reduce((max, u) => Math.max(max, Number(u.id)), 0) || 0) + 1,);
  // const newUser = { id: nextId,username,email,password};

  {/*Another method */ }
  const newUser = {
    id: users[users.length - 1].id + 1,
    username,
    email,
    password
  };

  users.push(newUser);
  res.status(201).json({ message: `user create successfully`, user: newUser });

});

{/* PUT update user*/ }
router.put('/:id', (req, res) => {
  // const userId = parseInt(req.params.id);
  // const usersIndex = users.findIndex(u => u.id === (userId));

  // if (usersIndex !== -1) {
  //   users[usersIndex] = { id: userId, ...req.body };
  //   res.json({ message: 'User updated', user: users[usersIndex] });
  // } else {

  //   res.status(404).json({ message: 'User not found' });
  // }

  {/*P'Neeti method */ }
  const user = users.find(u => u.id === parseInt(req.params.id));
  const { username,email,password } = req.body;
  if (user) {
    user.usersname = username;
    user.email = email;
    user.password = password;

    res.status(200).json(user);
  } else {

    res.status(404).json({ message: 'User not found' });

  }
});


{/* DELETE user data*/ }
router.delete('/:id', (req, res)=>{
  
})