const FleetService = require('./fleet.service')
const {
  onFailure,
  onSuccess,
  onCreated,
  onNotFoundError,
  generateHATEOASLink
} = require('../../responses')
const message = require('../../messages/messages')

exports.fleetByID = async (req, res, next) => {
  try {
    const { fleetId } = req.params
    const fleet = await FleetService.getSinglefleet(fleetId)
    req.fleet = fleet
    return next()
  } catch (error) {
    onFailure(res, error, message.fleet_get_failure)
  }
}
exports.getSinglefleet = (req, res) => {
  const fleet = req.fleet
  let hateosLinks = [generateHATEOASLink(req.baseUrl, 'GET', 'fleet')]
  onSuccess(res, fleet, message.fleet_get_success, hateosLinks)
}

exports.getAllfleets = async (req, res, next) => {
  try {
    let query = req.query
    const results = await FleetService.getfleets(query)
    onSuccess(res, results, message.fleet_getAll_success)
  } catch (error) {
    onFailure(res, error, message.fleet_getAll_failure)
  }
}

exports.addfleet = async (req, res, next) => {
  try {
    const incommingfleetData = req.body
    const savedfleet = await FleetService.addfleet(incommingfleetData)
    onCreated(res, savedfleet, message.fleet_create_success)
  } catch (error) {
    onFailure(res, error, message.fleet_create_failure)
  }
}

exports.updatefleet = async (req, res, next) => {
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
}

exports.deletefleets = async (req, res, next) => {
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
