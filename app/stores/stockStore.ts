import { create } from 'zustand';
import type { StaticImageData } from 'next/image';
import { persist } from 'zustand/middleware';

interface StockItem {
    img?: string | StaticImageData;
    description: string;
    description2: string;
    unitOfMeasure: string;
    size: string;
    reorderQuantity: number;
    itemCode: string;
    itemName: string;
    location: string;
    locationCode: string;
    stock: number | string;
    unitPrice: number;
    itemCategory: string;
    category: string;
    subCategory: string;
    image?: string;
}

interface ApiStockItem {
    itemCode: string;
    itemName: string;
    location: string;
    locationCode: string;
    stock: number | string;
    unitPrice: number;
    itemCategory: string;
    category: string;
    subCategory: string;
    description: string;
    description2: string;
    unitOfMeasure: string;
    size: string;
    reorderQuantity: number;
    image?: string;
}

interface StockState {
    stockItems: StockItem[];
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;

    // Actions
    fetchStock: (forceRefresh?: boolean) => Promise<void>;
    getStockItem: (itemCode: string, location: string) => StockItem | undefined;
    updateStockItem: (itemCode: string, location: string, updates: Partial<StockItem>) => void;
    clearStock: () => void;
}

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useStockStore = create<StockState>()(
    persist(
        (set, get) => ({
            stockItems: [],
            isLoading: false,
            error: null,
            lastFetched: null,

            fetchStock: async (forceRefresh = false) => {
                const { lastFetched, stockItems } = get();
                const now = Date.now();

                // Check if cache is still valid
                if (!forceRefresh && lastFetched && (now - lastFetched) < CACHE_DURATION && stockItems.length > 0) {
                    console.log('Using cached stock data');
                    return;
                }

                // Check if already loading to prevent duplicate requests
                if (get().isLoading) {
                    console.log('Stock data already loading');
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await fetch("/api/stock", {
                        method: "GET",
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch stock data");
                    }

                    const apiData: ApiStockItem[] = await response.json();

                    if (!Array.isArray(apiData)) {
                        throw new Error("Invalid API response: expected an array");
                    }

                    // Transform the data
                    const transformedData = apiData.reduce((acc: StockItem[], item: ApiStockItem) => {
                        acc.push({
                            itemCode: item.itemCode,
                            itemName: item.itemName,
                            location: item.location,
                            locationCode: item.locationCode,
                            stock: item.stock,
                            unitPrice: item.unitPrice,
                            itemCategory: item.itemCategory,
                            category: item.category,
                            subCategory: item.subCategory,
                            description: item.description,
                            description2: item.description2,
                            unitOfMeasure: item.unitOfMeasure,
                            size: item.size,
                            reorderQuantity: item.reorderQuantity,
                            image: item.image,
                            img: item.image || undefined,
                        });
                        return acc;
                    }, []);

                    set({
                        stockItems: transformedData,
                        isLoading: false,
                        lastFetched: now
                    });

                } catch (err) {
                    console.error("Error fetching stock data:", err);
                    set({
                        error: err instanceof Error ? err.message : "Failed to fetch stock data",
                        isLoading: false
                    });
                }
            },

            getStockItem: (itemCode: string, location: string) => {
                const { stockItems } = get();
                return stockItems.find(
                    item => item.itemCode === itemCode && item.location === location
                );
            },

            updateStockItem: (itemCode: string, location: string, updates: Partial<StockItem>) => {
                set((state) => ({
                    stockItems: state.stockItems.map(item =>
                        item.itemCode === itemCode && item.location === location
                            ? { ...item, ...updates }
                            : item
                    )
                }));
            },

            clearStock: () => {
                set({ stockItems: [], lastFetched: null, error: null });
            },
        }),
        {
            name: 'stock-storage',
            partialize: (state) => ({
                stockItems: state.stockItems,
                lastFetched: state.lastFetched
            }),
        }
    )
);