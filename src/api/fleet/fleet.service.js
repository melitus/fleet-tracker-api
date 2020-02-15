/* eslint-disable prefer-promise-reject-errors */
const  mongoose = require('mongoose')

const FleetModel = require('./fleet.model')

exports.getSingleFleet = async fleetId => {
  if (!mongoose.Types.ObjectId.isValid(fleetId)) {
    return Promise.reject('Invalid identifier')
  }
  const fleet = await FleetModel.findById(fleetId).exec()
  return fleet
}

exports.getFleets = async (params) => {
  let pageNumber = parseInt(params.pagenumber)
  const pageSize = parseInt(params.pagesize)
  const searchQuery = {}
  const fleets = await FleetModel.find(searchQuery)
    .lean()
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip((pageNumber - 1) * pageSize)
    .exec()
  const fleetCount = await fleetsCount()
  const results = {
    allFleets: fleets,
    totalFleets: fleetCount
  }
  return results
}
const fleetsCount = async () => {
  const allFleetsCount = await FleetModel.countDocuments({})
    .lean()
    .exec()
  return allFleetsCount
}
exports.addFleet = async (fleetData) => {
  const newFleet = new FleetModel(fleetData)
  const savedFleet = await newFleet.save()
  return savedFleet
}
exports.updateFleet = async (fleetId, fleetData) => {
  if (!mongoose.Types.ObjectId.isValid(fleetId)) {
    return Promise.reject('Invalid identifier')
  }
  const updatedFleet = await FleetModel.findByIdAndUpdate(fleetId, fleetData)
  return updatedFleet
}
exports.deleteBrand = async (fleetId) => {
  if (!mongoose.Types.ObjectId.isValid(fleetId)) {
    return Promise.reject('Invalid identifier')
  }
  const deletedFleet = await FleetModel.findByIdAndRemove(fleetId)
  return deletedFleet
}
