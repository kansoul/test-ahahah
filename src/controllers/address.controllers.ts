import { NextFunction, Request, Response } from 'express'
import { readFileSync } from 'fs'
import { ObjectId } from 'mongodb'
import { ADDRESS_MESSAGES } from '~/constants/messages'
import { District } from '~/models/district.model'
import { Province } from '~/models/province.model'
import addressService from '~/services/address.services'
import { internalServerErrorHandler, notFoundHandler, okHandler } from '~/utils/handlers'

export const getAllProvincesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await addressService.getAllProvinces()

    return okHandler(req, res, result)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const getDistrictsByProvinceCodeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { province_code } = req.query

    const province = await Province.findOne({ code: province_code })

    if (!province) notFoundHandler(req, res, ADDRESS_MESSAGES.PROVINCE_NOT_EXIST)

    const result = await addressService.getDistrictsByProvinceId(province?._id as ObjectId)

    return okHandler(req, res, result)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const getWardsByProvinceCodeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { district_code } = req.query

    const district = await District.findOne({ code: district_code })

    if (district === null) return notFoundHandler(req, res, ADDRESS_MESSAGES.DISTRICT_NOT_EXIST)

    const districtId = district._id as ObjectId

    const result = await addressService.getWardsByDistrictId(districtId.toString())

    return okHandler(req, res, result)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const initializeProvincesController = async (req: Request, res: Response) => {
  try {
    const appRootPath = (global as any).appRoot

    const mockupsProvincesJson = readFileSync(`${appRootPath}/mocks/provinces.json`, 'utf-8')

    const provinces = JSON.parse(mockupsProvincesJson)

    await addressService.initializeProvinces(provinces)
    return okHandler(req, res, {})
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const initializeDistrictController = async (req: Request, res: Response) => {
  try {
    const appRootPath = (global as any).appRoot

    const mockupsDistrictsJson = readFileSync(`${appRootPath}/mocks/districts.json`, 'utf-8')

    const districts = JSON.parse(mockupsDistrictsJson)

    await addressService.initializeDistricts(districts)
    return okHandler(req, res, {})
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const initializeWardController = async (req: Request, res: Response) => {
  try {
    const appRootPath = (global as any).appRoot

    const mockupsWardsJson = readFileSync(`${appRootPath}/mocks/wards.json`, 'utf-8')

    const wards = JSON.parse(mockupsWardsJson)

    await addressService.initializeWards(wards)
    return okHandler(req, res, {})
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}
