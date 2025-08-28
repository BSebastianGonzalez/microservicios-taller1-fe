import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import ComplaintResponse from "../../modules/user/complaint/components/ComplaintResponse";

const ConsultResponse = () => {
    return (
        <UserLayout title="Respuesta de denuncia">
            <ComplaintResponse />
        </UserLayout>
    );
};

export default ConsultResponse;