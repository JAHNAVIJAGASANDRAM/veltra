// This file handles all team-related API routes.

import express from 'express';
const router = express.Router();

// A simple example route to get all teams
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'List of all teams',
    teams: [
      { id: 1, name: 'Team Alpha' },
      { id: 2, name: 'Team Beta' }
    ]
  });
});

// A route to get a single team by its ID
router.get('/:id', (req, res) => {
  const teamId = req.params.id;
  res.status(200).json({
    message: `Team data for ID: ${teamId}`,
    team: { id: teamId, name: `Team ${teamId}` }
  });
});

// A route to create a new team
router.post('/', (req, res) => {
  const newTeam = req.body;
  res.status(201).json({
    message: 'Team successfully created',
    newTeam: newTeam
  });
});

export default router;
