import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    outstandingData?: CustomerOutstandingData[]; // optional field for outstanding data
    // add more fields if necessary
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

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useOrderCreateStore = create<OrderCreateState>()(
    persist(
        (set, get) => ({
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

            fetchCustomers: async (forcRefresh = false) => {
                //get current state
                const { lastFetchedCustomers, customers, isLoadingCustomers } = get();
                const now = Date.now();

                //check cache
                if (!forcRefresh && lastFetchedCustomers && (now - lastFetchedCustomers) < CACHE_DURATION && customers.length > 0) {
                    console.log('Using cached customers data');
                    return;
                }

                //prevent double fetcching
                if (isLoadingCustomers) {
                    console.log('Cusotomers already loading');
                    return;
                }

                // Set loading state
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


                } catch (error) {
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
                    console.log('Using cached items data');
                    return;
                }

                if (isLoadingItems) return;

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

                } catch (error) {
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
                    console.log('Using cached locations data');
                    return;
                }

                if (isLoadingLocations) return;

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

                } catch (error) {
                    set({
                        errorLocations: error instanceof Error ? error.message : "Failed to fetch locations",
                        isLoadingLocations: false
                    });
                }
            },

            fetchPaymentMethods: async (forceRefresh = false) => {
                const { lastFetchedPaymentMethods, paymentMethods, isLoadingPayments } = get();
                const now = Date.now();

                // Check cache
                if (!forceRefresh && lastFetchedPaymentMethods &&
                    (now - lastFetchedPaymentMethods) < CACHE_DURATION &&
                    paymentMethods.length > 0) {
                    console.log('Using cached payment methods data');
                    return;
                }

                // Prevent double fetching
                if (isLoadingPayments) {
                    console.log('Payment methods already loading');
                    return;
                }

                // Set loading state
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

                } catch (error) {
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
        }),
        {
            name: 'order-creation-storage', //localstorage key
            partialize: (state) => ({
                //only persist these fields
                customers: state.customers,
                locations: state.locations,
                items: state.items,
                paymentMethods: state.paymentMethods,
                lastFetchedCustomers: state.lastFetchedCustomers,
                lastFetchedLocations: state.lastFetchedLocations,
                lastFetchedItems: state.lastFetchedItems,
                lastFetchedPaymentMethods: state.lastFetchedPaymentMethods,
            }),
        }
    )
)



