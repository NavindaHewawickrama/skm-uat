import { useEffect } from 'react';
import { useOrderCreateStore } from '../stores/orderCreateStore';

export const useOrderCreationData = (autoFetch = true) => {
    const {
        customers,
        locations,
        items,
        paymentMethods,
        isLoadingCustomers,
        isLoadingLocations,
        isLoadingItems,
        isLoadingPayments,
        errorCustomers,
        errorLocations,
        errorItems,
        errorPaymentMethods,
        fetchCustomers,
        fetchLocations,
        fetchItems,
        fetchPaymentMethods,
        getItemsByLocation,
        getCustomerByCode,
        getLocationByCode,
    } = useOrderCreateStore();

    useEffect(() => {
        if (autoFetch) {
            fetchCustomers();
            fetchLocations();
            fetchItems();
            fetchPaymentMethods();
        }
    }, [autoFetch, fetchCustomers, fetchLocations, fetchItems, fetchPaymentMethods]);

    return {
        // Data
        customers,
        locations,
        items,
        paymentMethods,

        // Loading states
        isLoading: isLoadingCustomers || isLoadingLocations || isLoadingItems || isLoadingPayments,
        isLoadingCustomers,
        isLoadingLocations,
        isLoadingItems,
        isLoadingPayments,

        // Errors
        errors: {
            customers: errorCustomers,
            locations: errorLocations,
            items: errorItems,
            paymentMethods: errorPaymentMethods,
        },

        // Actions
        refreshCustomers: () => fetchCustomers(true),
        refreshLocations: () => fetchLocations(true),
        refreshItems: () => fetchItems(true),
        refreshAll: () => {
            fetchCustomers(true);
            fetchLocations(true);
            fetchItems(true);
            fetchPaymentMethods(true);
        },

        // Helpers
        getItemsByLocation,
        getCustomerByCode,
        getLocationByCode,
    };
};