import { axiosInstance } from '../api/axiosInstance';

export const designerService = {
  uploadDecal: async (formData: FormData) => {
    return axiosInstance.post('/designer/upload-decal', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  saveDesign: async (designPayload: Record<string, unknown>) => {
    return axiosInstance.post('/designer/save-design', designPayload);
  },
};
