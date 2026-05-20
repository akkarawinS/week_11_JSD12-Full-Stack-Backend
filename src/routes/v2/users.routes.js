import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { getUsers, getDynamicUsers, addUsers, updateUsers, deleteUsers ,pgGetUser} from '../../controllers/users.v1.controller.js'
export const router = Router();


{/*Mongo Route */ }
{/*User Route */ }
router.get('/', getUsers);

{/* GET DYNAMIC ROUTE */ }
router.get('/:id', getDynamicUsers);


{/* POST new user*/ }
router.post('/', addUsers);

{/* PUT update user*/ }
router.put('/:id', updateUsers);



{/* DELETE user data*/ }
router.delete('/:id', deleteUsers);


// const PG_SELECT = "id, username, email, role, created_at, updated_at";

{/*PG Route */ }
router.get('/pg', pgGetUser);

// router.post('/pg', async (req, res) => {
//   const { username, email, password, role } = req.body || {};

//   //Eror handling
//   if (!username || !email || !password) {
//     return res.status(400).json({
//       success: false,
//       error: "username,email,password are required",
//     });
//   }

//   try {
//     const { data, error } = await supabase
//       .from('users')
//       .insert({ username, email, password, role: role || "user" })
//       .select(PG_SELECT)
//       .single();

//     if (error) throw error;

//     return res.status(201).json({ success: true, data });
//   } catch (error) {
//     return res.status(400).json({ success: false, error: error.message });
//   }
// });