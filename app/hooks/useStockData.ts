import { useEffect } from 'react';
import { useStockStore } from '../stores/stockStore';

export const useStockData = (autoFetch = true, forceRefresh = false) => {
    const {
        stockItems,
        isLoading,
        error,
        fetchStock,
        lastFetched
    } = useStockStore();

    useEffect(() => {
        if (autoFetch) {
            fetchStock(forceRefresh);
        }
    }, [autoFetch, forceRefresh, fetchStock]);

    return {
        stockItems,
        isLoading,
        error,
        lastFetched,
        refreshStock: () => fetchStock(true),
    };
};