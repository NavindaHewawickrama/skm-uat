// stores/orderCreateStore.ts
import { create } from 'zustand';

interface CustomerOutstandingData {
    customerName: string;
    invoiceNumber: string;
    invoiceDate: string;
    invoicedAmount: number;
    pdcAmount: number;
    dueAmount: number;
    originalAmount: number;
    orderNo: string;
    balanceBeforePDCs: number;
    releasedPDCs: number;
    balanceAfterPDCs: number;
    orderDate: string;
    totalDueAmount: number;
}

interface Customer {
    customerCode: string;
    customerName: string;
    dueAmount: number;
    creditAllowed: boolean;
    creditLimit: number;
    balanceCredit: number;
    paymentTermCode: string;
    outstandingData?: CustomerOutstandingData[];
}

interface SubstituteItem {
    itemCode: string;
    itemName: string;
    unitPrice: number;
}

interface LocationWiseInventory {
    locationCode: string;
    inventory: number;
}

interface Item {
    itemCode: string;
    itemName: string;
    substituteItems: SubstituteItem[];
    unitprice: string;
    locationWiseInventory?: LocationWiseInventory[];
}

interface Location {
    locationCode: string;
    locationName: string;
}

interface PaymentMethod {
    paymentMethodCode: string;
    description: string;
}

interface OrderCreateState {
    //data states
    customers: Customer[];
    locations: Location[];
    items: Item[];
    paymentMethods: PaymentMethod[];

    //loading states
    isLoadingCustomers: boolean;
    isLoadingLocations: boolean;
    isLoadingItems: boolean;
    isLoadingPayments: boolean;

    //error states
    errorCustomers: string | null;
    errorLocations: string | null;
    errorItems: string | null;
    errorPaymentMethods: string | null;

    // Cache timestamps
    lastFetchedCustomers: number | null;
    lastFetchedLocations: number | null;
    lastFetchedItems: number | null;
    lastFetchedPaymentMethods: number | null;

    // Actions
    fetchCustomers: (forceRefresh?: boolean) => Promise<void>;
    fetchLocations: (forceRefresh?: boolean) => Promise<void>;
    fetchItems: (forceRefresh?: boolean) => Promise<void>;
    fetchPaymentMethods: (forceRefresh?: boolean) => Promise<void>;

    // Getters/Helpers
    getItemsByLocation: (locationCode: string) => Item[];
    getCustomerByCode: (code: string) => Customer | undefined;
    getLocationByCode: (code: string) => Location | undefined;

    // Reset/Clear
    clearAllData: () => void;
}

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

export const useOrderCreateStore = create<OrderCreateState>()((set, get) => ({
    //initial state
    customers: [],
    locations: [],
    items: [],
    paymentMethods: [],

    isLoadingCustomers: false,
    isLoadingItems: false,
    isLoadingLocations: false,
    isLoadingPayments: false,

    errorCustomers: null,
    errorLocations: null,
    errorItems: null,
    errorPaymentMethods: null,

    lastFetchedCustomers: null,
    lastFetchedItems: null,
    lastFetchedLocations: null,
    lastFetchedPaymentMethods: null,

    fetchCustomers: async (forceRefresh = false) => {
        const { lastFetchedCustomers, customers, isLoadingCustomers } = get();
        const now = Date.now();

        // Check cache (1 hour)
        if (!forceRefresh && lastFetchedCustomers && (now - lastFetchedCustomers) < CACHE_DURATION && customers.length > 0) {
            console.log('📦 Using cached customers data');
            return;
        }

        // Prevent double fetching
        if (isLoadingCustomers) {
            console.log('⏳ Customers already loading');
            return;
        }

        console.log('🔄 Fetching fresh customers data from API...');
        set({ isLoadingCustomers: true, errorCustomers: null });

        try {
            const response = await fetch('/api/orders/getCustomers', {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }

            const data = await response.json();

            set({
                customers: data,
                isLoadingCustomers: false,
                lastFetchedCustomers: now
            });

            console.log(`✅ Customers cached successfully (${data.length} records)`);

        } catch (error) {
            console.error("Error fetching customers:", error);
            set({
                errorCustomers: error instanceof Error ? error.message : "Failed to fetch customers",
                isLoadingCustomers: false
            });
        }
    },

    fetchItems: async (forceRefresh = false) => {
        const { lastFetchedItems, items, isLoadingItems } = get();
        const now = Date.now();

        if (!forceRefresh && lastFetchedItems &&
            (now - lastFetchedItems) < CACHE_DURATION &&
            items.length > 0) {
            console.log('📦 Using cached items data');
            return;
        }

        if (isLoadingItems) {
            console.log('⏳ Items already loading');
            return;
        }

        console.log('🔄 Fetching fresh items data from API...');
        set({ isLoadingItems: true, errorItems: null });

        try {
            const response = await fetch(`/api/orders/getItems`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch items");
            }

            const data = await response.json();

            set({
                items: data,
                isLoadingItems: false,
                lastFetchedItems: now
            });

            console.log(`✅ Items cached successfully (${data.length} records)`);

        } catch (error) {
            console.error("Error fetching items:", error);
            set({
                errorItems: error instanceof Error ? error.message : "Failed to fetch items",
                isLoadingItems: false
            });
        }
    },

    fetchLocations: async (forceRefresh = false) => {
        const { lastFetchedLocations, locations, isLoadingLocations } = get();
        const now = Date.now();

        if (!forceRefresh && lastFetchedLocations &&
            (now - lastFetchedLocations) < CACHE_DURATION &&
            locations.length > 0) {
            console.log('📦 Using cached locations data');
            return;
        }

        if (isLoadingLocations) {
            console.log('⏳ Locations already loading');
            return;
        }

        console.log('🔄 Fetching fresh locations data from API...');
        set({ isLoadingLocations: true, errorLocations: null });

        try {
            const response = await fetch(`/api/orders/getLocations`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch locations");
            }

            const data = await response.json();

            set({
                locations: data,
                isLoadingLocations: false,
                lastFetchedLocations: now
            });

            console.log(`✅ Locations cached successfully (${data.length} records)`);

        } catch (error) {
            console.error("Error fetching locations:", error);
            set({
                errorLocations: error instanceof Error ? error.message : "Failed to fetch locations",
                isLoadingLocations: false
            });
        }
    },

    fetchPaymentMethods: async (forceRefresh = false) => {
        const { lastFetchedPaymentMethods, paymentMethods, isLoadingPayments } = get();
        const now = Date.now();

        if (!forceRefresh && lastFetchedPaymentMethods &&
            (now - lastFetchedPaymentMethods) < CACHE_DURATION &&
            paymentMethods.length > 0) {
            console.log('📦 Using cached payment methods data');
            return;
        }

        if (isLoadingPayments) {
            console.log('⏳ Payment methods already loading');
            return;
        }

        console.log('🔄 Fetching fresh payment methods data from API...');
        set({ isLoadingPayments: true, errorPaymentMethods: null });

        try {
            const response = await fetch(`/api/orders/getPaymentMethod`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch payment methods");
            }

            const data = await response.json();

            set({
                paymentMethods: data,
                isLoadingPayments: false,
                lastFetchedPaymentMethods: now
            });

            console.log(`✅ Payment methods cached successfully (${data.length} records)`);

        } catch (error) {
            console.error("Error fetching payment methods:", error);
            set({
                errorPaymentMethods: error instanceof Error ? error.message : "Failed to fetch payment methods",
                isLoadingPayments: false
            });
        }
    },

    // Helper: Get items available at a specific location
    getItemsByLocation: (locationCode: string) => {
        const { items } = get();
        return items.filter(item => item.locationWiseInventory?.some(inv => inv.locationCode === locationCode));
    },

    // Helper: Get location by code
    getLocationByCode: (code: string) => {
        const { locations } = get();
        return locations.find(l => l.locationCode === code);
    },

    getCustomerByCode: (code: string) => {
        const { customers } = get();
        return customers.find(c => c.customerCode === code);
    },

    // Clear all data
    clearAllData: () => {
        console.log('🗑️ Clearing all cached data');
        set({
            customers: [],
            locations: [],
            items: [],
            paymentMethods: [],
            lastFetchedCustomers: null,
            lastFetchedLocations: null,
            lastFetchedItems: null,
            lastFetchedPaymentMethods: null,
            errorCustomers: null,
            errorLocations: null,
            errorItems: null,
            errorPaymentMethods: null,
        });
    },
}));