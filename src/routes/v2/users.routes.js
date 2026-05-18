import { Router } from 'express';
import { User } from '../../modules/users/user.model.js'
import { supabase } from '../../config/supabase.js';
export const router = Router();

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password;
  return user;
};
{/*Mongo Route */ }
{/*User Route */ }
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();

//     res.status(200).json({ success: true, data: users });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err });
//   }
// });

// {/* GET DYNAMIC ROUTE */ }
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//     res.status(200).json({ success: true, data: userResponse(user) });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err });
//   }
// });


// {/* POST new user*/ }
// router.post('/', async (req, res) => {
//   const { username, email, password, role } = req.body || {};

//   //Eror handling
//   if (!username || !email || !password) {
//     const err = new Error('Missing required fields: username, email, and password are required.');
//     err.name = 'ValidationError';
//     err.status = 400;
//     return res.status(400).json({ success: false, error: err });
//   }
//   try {
//     const doc = await User.create({ username, email, password, role });

//     return res.status(201).json({ success: true, data: userResponse(doc) });
//   } catch (err) {

//     console.error('Error creating user:', err);
//     return res.status(500).json({ success: false, error: err });
//   }
// });

// {/* PUT update user*/ }
// router.put('/:id', async (req, res) => {
//   const { username, email, password } = req.body || {};

//   //ดัก error ในเคสว่าถ้า 
//   if (!username && !email && !password) {
//     const err = new Error('At least one field (username, email, password, or role) must be provided for update.');
//     err.name = 'ValidationError';
//     err.status = 400;
//     return res.status(400).json({ success: false, error: err });
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       { username, email, password },
//       { new: true, runValidators: true }
//     );
//     res.status(200).json({ success: true, data: userResponse(updatedUser) });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err });
//   }
// });



// {/* DELETE user data*/ }
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//     res.status(200).json({ success: true, message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err });
//   }
// });


const PG_SELECT = "id, username, email, role, created_at, updated_at";

{/*PG Route */ }
router.get('/pg', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select(PG_SELECT);

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
);




router.post('/pg', async (req, res) => {
  const { username, email, password, role } = req.body || {};

  //Eror handling
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "username,email,password are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .insert({ username, email, password, role: role || "user" })
      .select(PG_SELECT)
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});