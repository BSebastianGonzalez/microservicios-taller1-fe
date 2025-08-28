import React from 'react';
import UserLayout from "../../modules/user/layouts/UserLayout";
import LegalList from '../../modules/user/legal/LegalList';

const LawFrame = () => {
  return (
    <UserLayout title="Marco Legal">
      <LegalList />
    </UserLayout>
  );
};

export default LawFrame;