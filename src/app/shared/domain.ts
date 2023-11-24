// ------
// Paging
// ------
export interface SortCriteria {
  sort: string;
}

export interface PagingCriteria extends SortCriteria {
  page: number;
  size: number;
}

export interface Page<T> {
  content: T[];
  last: boolean;
  totalElements: number;
}

// ----
// Misc
// ----

export interface SortOption {
  label: string;
  value: string;
}

// --------
// Category
// --------

export interface Category {
  id?: string;
  color: string;
  name: string;
}

export interface CategoryCriteria extends PagingCriteria {
  name?: string;
}

// -------
// Expense
// -------

export interface Expense {
  id: string;
  createdAt: string;
  lastModifiedAt: string;
  amount: number;
  category: Category;
  date: string;
  name: string;
}

export interface ExpenseUpsertDto {
  id?: string;
  amount: number;
  categoryId: string;
  date: string;
  name: string;
}

export interface ExpenseCriteria extends PagingCriteria {
  categoryIds?: string;
  name?: string;
  yearMonth?: string;
}

export class AllCategoryCriteria {
}
