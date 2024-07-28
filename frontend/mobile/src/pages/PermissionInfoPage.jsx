import React from "react";
import styled from "styled-components";

import { Text, Grid } from "@components/elements";
const PermissionInfo = () => {
  return (
    <>
      <Grid is_flex={true} padding={" 60px 0px 0px 40px"}>
        <Text children="앱 접근 권한 안내" />
      </Grid>
    </>
  );
};

export default PermissionInfo;
