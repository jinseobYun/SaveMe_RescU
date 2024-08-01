import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { Header, TabBar } from "@components/common";
import { MedicalSpecificForm, MedicalInfoForm } from "@components/form";
import { Button, Text, Input } from "@components/elements";

const EditMedicalInfoPage = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="" element={<MedicalInfoForm />} />
        <Route path=":drug" element={<MedicalSpecificForm />} />
        <Route path=":disease" element={<MedicalSpecificForm />} />
      </Routes>
    </>
  );
};

export default EditMedicalInfoPage;
