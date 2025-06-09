const express = require('express');
const router = express.Router();
const { register, login, getAllUsers,
  promoteUser, demoteUser, 
  changeOwnPassword } = require('../controllers/authController');
  const authMiddleware = require('../middleware/authMiddleware');
  const roleMiddleware = require('../middleware/roleMiddleware');
  

router.post('/register', register);
router.post('/login', login);
// Admin-only user management
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.patch('/:id/promote', authMiddleware, roleMiddleware('admin'), promoteUser);
router.patch('/change-password', authMiddleware, roleMiddleware('admin'), changeOwnPassword);
router.patch('/:id/demote', authMiddleware, roleMiddleware('admin'), demoteUser);


module.exports = router;