/* eslint-disable prefer-promise-reject-errors */
import * as mongoose from 'mongoose'

import FleetModel from './fleet.model'

export const getSingleFleet = async fleetId => {
  if (!mongoose.Types.ObjectId.isValid(fleetId)) {
    return Promise.reject('Invalid identifier')
  }
  const fleet = await FleetModel.findById(fleetId).exec()
  return fleet
}

export const getFleets = async (params) => {
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
export const addFleet = async (fleetData) => {
  const newFleet = new FleetModel(fleetData)
  const savedFleet = await newFleet.save()
  return savedFleet
}
export const updateFleet = async (fleetId, fleetData) => {
  if (!mongoose.Types.ObjectId.isValid(fleetId)) {
    return Promise.reject('Invalid identifier')
  }
  const updatedFleet = await FleetModel.findByIdAndUpdate(fleetId, fleetData)
  return updatedFleet
}
export const deleteBrand = async (fleetId) => {
  if (!mongoose.Types.ObjectId.isValid(fleetId)) {
    return Promise.reject('Invalid identifier')
  }
  const deletedFleet = await FleetModel.findByIdAndRemove(fleetId)
  return deletedFleet
}
