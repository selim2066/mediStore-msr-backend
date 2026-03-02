type IOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
};

type IOptionsReturn = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  skip: number;
};

const paginationSortingHelpers = (options: IOptions): IOptionsReturn => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const skip = (page - 1) * limit;

  const sortBy: string = options.sortBy || "createdAt";
    //const sortOrder: string = options.sortOrder || "desc";
   
   const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};

export default paginationSortingHelpers;
