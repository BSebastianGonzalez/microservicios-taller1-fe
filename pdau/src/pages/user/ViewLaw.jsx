import React from 'react';
import UserLayout from '../../modules/user/layouts/UserLayout';
import LawView from '../../modules/user/legal/LawView';

const ViewLaw = () => {
  return (
    <UserLayout>
      <LawView />
    </UserLayout>
  );
};

export default ViewLaw;