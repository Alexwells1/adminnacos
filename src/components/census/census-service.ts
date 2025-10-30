// census-service.ts
import instance from "@/services/axios";

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

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export class CensusService {
  async getStatistics(): Promise<ApiResponse<StatisticsData>> {
    try {
      const response = await instance.get("/census/statistics");
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAllResponses(): Promise<ApiResponse<CensusFormData[]>> {
    try {
      const response = await instance.get("/census/all");
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response?.data) return error.response.data;
    if (error.request) return { message: "Network error" };
    return { message: "Unexpected error" };
  }
}
