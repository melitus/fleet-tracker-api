const httpStatus = require('http-status');
const { omit } = require('lodash');

const Fleet = require('../models/fleet.model');
const { handler: errorHandler } = require('../middlewares/error');

module.exports = {
    // Load fleet and append to req.
    load: async (req, res, next, id) => {
        try {
          const fleet = await Fleet.get(id);
          req.locals = { fleet };
          return next();
        } catch (error) {
          return errorHandler(error, req, res);
        }
      },
       // Get saved fleet list by pages
     getAllFleets: async (req, res, next) => {
        try {
          const fleet = await Fleet.list(req.query);
          const transformedfleets = fleet.map(fleet => fleet.transform());
          res.json(transformedfleets);
        } catch (error) {
          next(error);
        }
      },
    
    /*  Get fleet req.locals creates some local variables 
        that will be available to the front-end
    */
    getOneFleet: (req, res) => res.json(req.locals.fleet.transform()),
    
    createfleet: async (req, res, next) => {
        try{
        // . Create a new fleet
            const newfleet = req.body;
            const fleet = new Fleet(newfleet);
            const savedFleet = await fleet.save(); 
            res.status(httpStatus.CREATED);
            res.json(savedFleet.transform());
        } catch (error) {
            next(error);
           // return res.status(400).json(error);

        }
    },
    
    // Replace existing fleet
    updatefleet: async (req, res, next) => {
        try {
        const { fleet } = req.locals;
        const newFleet = new Fleet(req.body);
        const ommitCategory = fleet.category !== 'truck' ? 'category' : '';
        const newfleetObject = omit(newFleet.toObject(), '_id', ommitCategory);
        // The upsert option directs mongoDB to create a document if 
        // it not present, otherwise it updates an existing document.
        await fleet.update(newfleetObject, { override: true, upsert: true });
        const savedFleet = await Fleet.findById(fleet._id);
        res.json(savedFleet.transform());
        } catch (error) {
        next(Fleet.checkDuplicateEmail(error));
        }
  },

    deletefleetById: async (req, res, next) => {  
        try{  
        const { fleetId } = req.params;
        // get a fleet
        const fleet = await Fleet.findById(fleetId);
        if (!fleet) {
            res.status(404).json({error: 'fleet does not exist'});
        }
        // remove the fleet
        await fleet.remove();
        res.status(200).json({ message: 'fleet successfully deleted' });
    } catch (error) {
       next(error);
    }  
}
}

