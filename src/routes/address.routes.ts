import { Router } from 'express'
import {
  getAllProvincesController,
  getDistrictsByProvinceCodeController,
  getWardsByProvinceCodeController,
  initializeDistrictController,
  initializeProvincesController,
  initializeWardController
} from '~/controllers/address.controllers'
import { getDistrictsByProvinceCodeValidator, getWardsByDistrictCodeValidator } from '~/middlewares/address.middlewares'
import { accessTokensValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const addressRouter = Router()

/**
 * Description: initial provinces
 * Method: POST
 * Header:
 */
addressRouter.post('/provinces/initialize', accessTokensValidator, wrapRequestHandler(initializeProvincesController))

/**
 * Description: initial provinces
 * Method: POST
 * Header:
 */
addressRouter.post('/districts/initialize', accessTokensValidator, wrapRequestHandler(initializeDistrictController))

/**
 * Description: initial provinces
 * Method: POST
 * Header:
 */
addressRouter.post('/wards/initialize', accessTokensValidator, wrapRequestHandler(initializeWardController))

/**
 * Description: get all provinces
 * Method: GET
 * Header:
 */
addressRouter.get('/provinces', accessTokensValidator, wrapRequestHandler(getAllProvincesController))

/**
 * Description: get all district by province code
 * Method: GET
 * Query: {province_code: "..."}
 */
addressRouter.get(
  '/districts',
  accessTokensValidator,
  getDistrictsByProvinceCodeValidator,
  wrapRequestHandler(getDistrictsByProvinceCodeController)
)

/**
 * Description: get all wards by district code
 * Method: GET
 * Query: {district_code: "..."}
 */
addressRouter.get(
  '/wards',
  accessTokensValidator,
  getWardsByDistrictCodeValidator,
  wrapRequestHandler(getWardsByProvinceCodeController)
)

export default addressRouter
