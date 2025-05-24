import { axiosClient, imageUploadUrl } from '@/api'
import { ILogoUploadPayload, ILogoUploadResponse } from './types'

export const userService = {
  uploadLogo: async (
    payload: ILogoUploadPayload,
  ): Promise<ILogoUploadResponse> => {
    try {
      const formData = new FormData()
      formData.append('image', payload.file)

      const response = await axiosClient.post<ILogoUploadResponse>(
        imageUploadUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return response.data
    } catch (error) {
      console.error('Error while uploading photo', error)

      throw error
    }
  },
}
