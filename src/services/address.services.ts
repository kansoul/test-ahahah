import { ObjectId } from 'mongodb'
import { ADDRESS_MESSAGES, COMMON_MESSAGES } from '~/constants/messages'
import { District } from '~/models/district.model'
import { Province } from '~/models/province.model'
import { Ward } from '~/models/ward.model'

class AddressService {
  async initializeProvinces(provinces: any[]) {
    try {
      await Province.insertMany(provinces)
    } catch (error) {
      throw new Error(ADDRESS_MESSAGES.INITIALIZE_PROVINCES_FAILED)
    }
  }

  async initializeDistricts(districts: any[]) {
    try {
      for (const dt of districts) {
        const province = await Province.findOne({ code: dt.province_code })

        if (!province) {
          console.log(`Province with code ${dt.province_code} not found. Skipping district ${dt.name}`)
          continue
        }

        const newDistrict = new District({
          code: dt.code,
          name: dt.name,
          name_en: dt.name_en,
          full_name: dt.full_name,
          full_name_en: dt.full_name_en,
          code_name: dt.code_name,
          province_code: province._id
        })

        await newDistrict.save()
        console.log(`District ${dt.name} imported successfully.`)
      }
    } catch (error) {
      throw new Error(ADDRESS_MESSAGES.INITIALIZE_DISTRICTS_FAILED)
    }
  }

  async initializeWards(wards: any[]) {
    try {
      for (const ward of wards) {
        const district = await District.findOne({ code: ward.district_code })

        if (!district) {
          console.log(`District with code ${ward.district_code} not found. Skipping ward ${ward.name}`)
          continue
        }

        const newWard = new Ward({
          code: ward.code,
          name: ward.name,
          name_en: ward.name_en,
          full_name: ward.full_name,
          full_name_en: ward.full_name_en,
          code_name: ward.code_name,
          district_code: district._id
        })

        await newWard.save()
        console.log(`Wards ${ward.name} imported successfully.`)
      }
    } catch (error) {
      throw new Error(ADDRESS_MESSAGES.INITIALIZE_WARDS_FAILED)
    }
  }

  async getAllProvinces() {
    try {
      const provinces = Province.find({}, '_id code name full_name code_name')

      return provinces
    } catch (error) {
      throw new Error(COMMON_MESSAGES.SOMETHING_WENT_WRONG)
    }
  }

  async getProvinceByProvinceByCode(code: string) {
    try {
      const province = await Province.findOne({ code })

      if (!province) return null

      return province
    } catch (error) {
      throw new Error(COMMON_MESSAGES.SOMETHING_WENT_WRONG)
    }
  }

  async getDistrictByDistrictCode(code: string) {
    try {
      const district = await District.findOne({ code })

      if (!district) return null

      return district
    } catch (error) {
      throw new Error(COMMON_MESSAGES.SOMETHING_WENT_WRONG)
    }
  }

  async getWardByWardCode(code: string) {
    try {
      const ward = await Ward.findOne({ code })

      if (!ward) return null

      return ward
    } catch (error) {
      throw new Error(COMMON_MESSAGES.SOMETHING_WENT_WRONG)
    }
  }

  async getDistrictsByProvinceId(provinceId: ObjectId) {
    try {
      const result = await District.find({ province_code: provinceId }, '_id code name full_name code_name')

      return result
    } catch (error) {
      throw new Error(COMMON_MESSAGES.SOMETHING_WENT_WRONG)
    }
  }

  async getWardsByDistrictId(districtId: string) {
    try {
      const result = await Ward.find({ district_code: new ObjectId(districtId) }, '_id code name full_name code_name')

      return result
    } catch (error) {
      throw new Error(COMMON_MESSAGES.SOMETHING_WENT_WRONG)
    }
  }
}

const addressService = new AddressService()
export default addressService
