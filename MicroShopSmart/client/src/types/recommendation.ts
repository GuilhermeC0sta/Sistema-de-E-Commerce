import { Product } from "@shared/schema";

/**
 * Tipo que estende o Product com informações adicionais sobre o motivo da recomendação
 */
export interface RecommendationWithReason extends Product {
  reasonCode?: string;
  reasonText?: string;
}