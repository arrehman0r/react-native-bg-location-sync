import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getAllNewRequest,
  getPlumberActiveRequest,
  getPlumberCompletedRequest,
  getCompleteTubewellRequest,
  getBillsByBillingMonth,
  getBillDetailsById,
  updateBillDetails,
  updateBillingMonthStatus,
  getPlumberComplaints,
  getPlumberAssignedComplaints,
  getPlumberCompletedComplaints
} from '../services/apiCalls';


export const useNewRequests = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["requests", "new"],
    queryFn: ({ pageParam = 1 }) => getAllNewRequest(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1; // next page number
      }
      return undefined; // no more pages
    },
    staleTime: 0,
    refetchInterval: 30000, // optional
  });
};


export const useActiveRequests = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["requests", "active"],
    queryFn: ({ pageParam = 1 }) => getPlumberActiveRequest(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};
export const useCompletedRequests = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["requests", "completed"],
    queryFn: ({ pageParam = 1 }) =>
      getPlumberCompletedRequest(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};
export const useCompleteTubewellRequest = () => {
  return useQuery({
    queryKey: ['requests', 'completeTubewell'],
    queryFn: getCompleteTubewellRequest,
  });
}

export const useGetBillsByBillingMonth = (tehsilId, limit = 10, maxPages = 10) => {
  return useInfiniteQuery({
    queryKey: ['bills', 'byBillingMonth', tehsilId],
    queryFn: ({ pageParam = 1 }) => getBillsByBillingMonth(tehsilId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1; // load next page
      }
      return undefined; // no more pages
    },
    select: (data) => {
      if (data.pages.length > maxPages) {
        return {
          ...data,
          pages: data.pages.slice(-maxPages), // keep only last N pages in cache
        };
      }
      return data;
    },
  });
};


export const useGetBillDetailsById = (billId) => {
  return useQuery({
    queryKey: ['bills', 'billsDetails', billId],
    queryFn: () => getBillDetailsById(billId),
  });
}


export const useUpdateBillDetails = (billId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => updateBillDetails(billId, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['bills', 'billsDetails', billId]);
    },
  });
};

export const useUpdateBillingMonthStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => updateBillingMonthStatus(id), 
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['bills', 'billsDetails', id]);
    },
  });
};



export const useGetPlumberComplaints = (tehsilId, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["complaints", "plumber", tehsilId],
    queryFn: ({ pageParam = 1 }) =>
      getPlumberComplaints(tehsilId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1; // load next page
      }
      return undefined; // no more pages
    },
  });
};


export const useGetPlumberAssignedComplaints = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["complaints", "assigned"],
    queryFn: ({ pageParam = 1 }) =>
      getPlumberAssignedComplaints(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export const useGetPlumberCompletedComplaints = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["complaints", "completed"],
    queryFn: ({ pageParam = 1 }) =>
      getPlumberCompletedComplaints(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};
