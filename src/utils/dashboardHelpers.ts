// src/utils/dashboardHelpers.ts
export const dashboardHelpers = {
  getCollegeData: (stats: any) => {
    if (!stats?.collegeVsDeptRevenue) return { revenue: 0, count: 0 };
    const collegeData = stats.collegeVsDeptRevenue.find(
      (item: any) => item._id === "college"
    );
    return {
      revenue: collegeData?.revenue || 0,
      count: collegeData?.count || 0,
    };
  },

  getDepartmentalData: (stats: any) => {
    if (!stats?.collegeVsDeptRevenue) return { revenue: 0, count: 0 };
    const deptData = stats.collegeVsDeptRevenue.find(
      (item: any) => item._id === "departmental"
    );
    return {
      revenue: deptData?.revenue || 0,
      count: deptData?.count || 0,
    };
  },

  formatCurrency: (amount: number) => {
    return `₦${amount?.toLocaleString() || "0"}`;
  },

  calculateNetAmount: (grossAmount: number, paymentCount: number) => {
    const maintenanceFee = paymentCount * 200;
    return Math.max(0, grossAmount - maintenanceFee);
  },

  getCollegeBreakdown: (stats: any) => {
    return (
      stats.detailedDepartmentBreakdown?.filter(
        (item: any) => item._id.type === "college"
      ) || []
    );
  },

  getDepartmentalBreakdown: (stats: any) => {
    return (
      stats.detailedDepartmentBreakdown?.filter(
        (item: any) => item._id.type === "departmental"
      ) || []
    );
  },
};
