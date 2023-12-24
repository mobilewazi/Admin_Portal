interface RevenueByMonth {
  Month: string;
  Year: number;
  totalRevenue: string;
}

interface CollectionsByCategory {
  category: string;
  projectsInCategory: string;
  categoryValue: string;
}

export interface IStatistics {
  projects: number;
  totalUsers: number;
  projectsValue: number;
  noOfPaymets: number;
  totalPayments: number;
  revenueByMonth: RevenueByMonth[];
  collectionsByCategory: CollectionsByCategory[];
}
