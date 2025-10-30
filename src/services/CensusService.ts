import api from "./axios";

export interface CensusFormData {
  name: string;
  email: string;
  level: string;
  department: string;
  programmingSkill: string;
  languages: string[];
  interests: string[];
  learningGoals: string;
  eventPreferences: string[];
  projectCell: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface StatisticsData {
  totalStudents: number;
  recentSubmissions: number;
  levelStats: { _id: string; count: number }[];
  departmentStats: { _id: string; count: number }[];
  skillStats: { _id: string; count: number }[];
  popularLanguages: { _id: string; count: number }[];
  popularInterests: { _id: string; count: number }[];
  projectCellStats: { _id: string; count: number }[];
}

class CensusService {
  async submitForm(
    formData: CensusFormData
  ): Promise<ApiResponse<{ id: string; name: string }>> {
    try {
      const response = await api.post("/census/submit", formData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAllResponses(): Promise<ApiResponse<CensusFormData[]>> {
    try {
      const response = await api.get("/census/all");
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getStatistics(): Promise<ApiResponse<StatisticsData>> {
    try {
      const response = await api.get("/census/statistics");
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getResponseById(id: string): Promise<ApiResponse<CensusFormData>> {
    try {
      const response = await api.get(`/census/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): { message: string; errors?: string[] } {
    if (error.response?.data) {
      return error.response.data;
    } else if (error.request) {
      return { message: "Network error. Please check your connection." };
    } else {
      return { message: "An unexpected error occurred." };
    }
  }
}


export const censusService = new CensusService();


