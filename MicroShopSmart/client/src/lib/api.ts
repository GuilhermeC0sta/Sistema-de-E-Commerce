import { apiRequest as queryApiRequest } from "./queryClient";

/**
 * Helper function for making API requests
 * Uses the same functions as the queryClient but exported separately for direct use
 */
export const apiRequest = queryApiRequest;

/**
 * Format price to Brazilian currency format
 */
export const formatPrice = (price: number | string): string => {
  return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
};

/**
 * Format date to Brazilian format
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
