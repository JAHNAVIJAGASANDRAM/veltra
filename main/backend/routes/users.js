// This file handles all user-related API routes.

import express from 'express';
const router = express.Router();

// A simple example route to get user profile data
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.status(200).json({
    message: `User profile for ID: ${userId}`,
    user: { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` }
  });
});

// A route to update a user's profile
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  res.status(200).json({
    message: `User with ID ${userId} updated successfully`,
    updatedUser: updatedData
  });
});

// A route to delete a user
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  res.status(200).json({
    message: `User with ID ${userId} deleted successfully`
  });
});

export default router;
