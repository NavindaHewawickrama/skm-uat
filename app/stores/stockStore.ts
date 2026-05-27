// stores/stockStore.ts
import { create } from 'zustand';
import type { StaticImageData } from 'next/image';

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

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

export const useStockStore = create<StockState>()((set, get) => ({
    stockItems: [],
    isLoading: false,
    error: null,
    lastFetched: null,

    fetchStock: async (forceRefresh = false) => {
        const { lastFetched, stockItems } = get();
        const now = Date.now();

        // Check if cache is still valid (1 hour)
        if (!forceRefresh && lastFetched && (now - lastFetched) < CACHE_DURATION && stockItems.length > 0) {
            const remainingMinutes = Math.round((CACHE_DURATION - (now - lastFetched)) / 60000);
            console.log(`📦 Using cached stock data (valid for another ${remainingMinutes} minutes)`);
            return;
        }

        // Check if already loading to prevent duplicate requests
        if (get().isLoading) {
            console.log('⏳ Stock data already loading');
            return;
        }

        console.log('🔄 Fetching fresh stock data from API...');
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
            const transformedData: StockItem[] = apiData.map((item: ApiStockItem) => ({
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
            }));

            set({
                stockItems: transformedData,
                isLoading: false,
                lastFetched: now
            });

            console.log(`✅ Stock data cached successfully (${transformedData.length} items)`);

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
        console.log('🗑️ Clearing stock cache');
        set({ stockItems: [], lastFetched: null, error: null });
    },
}));