import React from "react";
import MainLayout from "../../modules/admin/layouts/MainLayout";
import ArchivedCheckout from "../../modules/admin/components/archived_complaint/ArchivedCheckout";

const ArchivedComplaintCheckout = () => {
    return (
        <MainLayout>
            <ArchivedCheckout />
        </MainLayout>
    );
};

export default ArchivedComplaintCheckout;