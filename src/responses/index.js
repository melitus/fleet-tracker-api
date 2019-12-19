const httpStatus =  require('http-status')

const logger = require('../config/logger')

const basicResponse = {
  success: false,
  message: '',
  data: {},
  links:[]
}

export const onFailure = (res, error, message, data = '', links = []) => {
  let response = Object.assign({}, basicResponse)
  response.success = false
  response.message = message
  response.data = data
  response.links = links
  if (error) {
    logger.error('Bad Request', response)
    return res
      .status(error.status || httpStatus.BAD_REQUEST)
      .json(response)
  }
}

export const onSuccess = (res, data = '', message = '', links = []) => {
  let response = Object.assign({}, basicResponse)
  response.success = true
  response.message = message
  response.data = data
  response.links = links
  logger.info('Success', response)
  return res.status(httpStatus.OK).json(response)
}

export const onCreated = (res, data = '', message = '', links = []) => {
  let response = Object.assign({}, basicResponse)
  response.success = true
  response.message = message
  response.data = data
  response.links = links
  logger.info(`${data} created successfully`, response)
  return res.status(httpStatus.CREATED).json(response)
}

export const onNotFoundError = (res, data, message = '', links = '') => {
  if (!data) {
    let response = Object.assign({}, basicResponse)
    response.success = true
    response.message = message
    response.data = data
    response.links = links
    logger.info(`${data} Not Found`, { data, message })
    return res.status(httpStatus.NOT_FOUND).json({ data, message })
  }
}

export const generateHATEOASLink = (link, method, rel) => {
  return {
    link: link,
    method: method,
    rel: rel
  }
}
