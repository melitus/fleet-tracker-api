import FleetService from './fleet.service'
const {
  onFailure,
  onSuccess,
  onCreated,
  onNotFoundError,
  generateHATEOASLink
} = require('../../manager/responseManager')
const message = require('../../messages/messages')

module.exports = {
  fleetByID: async (req, res, next) => {
    try {
      const { fleetId } = req.params
      const fleet = await FleetService.getSinglefleet(fleetId)
      req.fleet = fleet
      return next()
    } catch (error) {
      onFailure(res, error, message.fleet_get_failure)
    }
  },
  getSinglefleet: (req, res) => {
    const fleet = req.fleet
    let hateosLinks = [generateHATEOASLink(req.baseUrl, 'GET', 'fleet')]
    onSuccess(res, fleet, message.fleet_get_success, hateosLinks)
  },

  getAllfleets: async (req, res, next) => {
    try {
      let query = req.query
      const results = await FleetService.getfleets(query)
      onSuccess(res, results, message.fleet_getAll_success)
    } catch (error) {
      onFailure(res, error, message.fleet_getAll_failure)
    }
  },

  addfleet: async (req, res, next) => {
    try {
      const incommingfleetData = req.body
      const savedfleet = await FleetService.addfleet(incommingfleetData)
      onCreated(res, savedfleet, message.fleet_create_success)
    } catch (error) {
      onFailure(res, error, message.fleet_create_failure)
    }
  },

  updatefleet: async (req, res, next) => {
    try {
      const { fleetId } = req.params
      const incommingfleetData = req.body
      const updatedfleet = await FleetService.updatefleet(
        fleetId,
        incommingfleetData
      )
      if (!updatedfleet) {
        onNotFoundError(res, message.fleet_not_exist)
      }
      onSuccess(res, updatedfleet, message.fleet_update_success)
    } catch (error) {
      onFailure(res, error, message.fleet_update_failure)
    }
  },

  deletefleets: async (req, res, next) => {
    try {
      const { fleetId } = req.params
      const deletedfleet = await FleetService.deletefleet(fleetId)
      if (!deletedfleet) {
        onNotFoundError(res, message.fleet_not_exist)
      }
      onSuccess(res, deletedfleet, message.fleet_delete_success)
    } catch (error) {
      onFailure(res, error, message.fleet_delete_failure)
    }
  }
}
