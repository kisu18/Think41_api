const express = require('express');
const router = express.Router();
const process = require('../models/process');


router.post('/request', async (req, res) => {
  const { resource_name, process_id ,ttl_seconds } = req.body;
  const now = new Date();
  const expiryTime = new Date(now.getTime() + ttl_seconds * 1000);

  const existingLock = await process.findOne({ resource_name });

  if (!existingLock) {

    const newLock = await process.create({ resource_name, process_id });
    console.log(newLock);
    return res.json({
      status: 'acquired',
      resource_name,
      process_id
    });



  }
  
  
  
  
  else if(existingLock){
    if((existingLock.expires_in)<now){
        if(ttl_seconds){
            const Lock = await process.findOneAndUpdate({ resource_name, process_id,expires_in:expiryTime},{new:true});
            return res.json({
                status: 'acquired',
                resource_name,
                process_id,
                expires_in:expiryTime
              });
        }
    }}
    
    else{
    return res.json({
      status: 'denied',
      resource_name,
      locked_by: existingLock.process_id
    });}
  
});

// Release lock
router.post('/release', async (req, res) => {
  const { resource_name, process_id } = req.body;

  const lock = await process.findOne({ resource_name, process_id });

  if (!lock) {
    return res.json({ status: 'resource_not_locked' });
  }

  await process.deleteOne({ resource_name, process_id });

  return res.json({
    status: 'released',
    resource_name
  });
});


router.get('/status/:resource_name', async (req, res) => {
  const resource_name = req.params.resource_name;
  console.log(resource_name);

  const exists = await process.findOne({ resource_name });

  if (!exists) {
    return res.json({
      resource_name,
      is_locked: false
    });
  }

  return res.json({
    resource_name,
    is_locked: true,
    locked_by: exists.process_id,
    locked_at: exists.createdAt
  });
});

router.get('/all-locked', async (req, res) => {
  const all = await process.find({});
  const allres = all.map(r => ({
    resource_name: r.resource_name,
    locked_by: r.process_id,
    locked_at: r.createdAt
  }));

  return res.json(allres);
});


router.get('/process/:id', async (req, res) => {
  const id = req.params.id;
  const allr = await process.find({ process_id: id });

  const result = allr.map(r => ({
    resource_name: r.resource_name,
    locked_at: r.createdAt
  }));

  return res.json(result);
});

module.exports = router;
