import React from 'react';
import UserLayout from '../../modules/user/layouts/UserLayout';
import FinishedRegister from '../../modules/user/complaint/components/FinishedRegister';

const ComplaintCreated = () => {
    return (
        <UserLayout title="Denuncia creada">
        <FinishedRegister />
        </UserLayout>
    );
};

export default ComplaintCreated;