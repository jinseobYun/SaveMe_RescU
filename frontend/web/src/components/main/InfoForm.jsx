import React from "react";
import Input from "../elements/Input";
import Textarea from "../elements/Textarea";
import "./InfoForm.css";

const InfoForm = ({ formData }) => (
  <form>
    <div className="left-column">
      <Input type="text" name="department" label="관할부서" value={formData.firestation} disabled={true} />
      <Input type="text" name="address1" label="신고위치 - 지번" value={formData.jibunLocationInfo} disabled={true} />
      <Input type="text" name="address2" label="신고위치 - 도로명" value={formData.doroLocationInfo} disabled={true} />
      <Input type="text" name="patientType" label="환자유형" value={formData.emergencyType} disabled={true} />
      <Textarea name="memo" value={formData.reportDetails} label="메모사항" overflow="hidden" disabled={true} />
      <Input type="text" name="reporterName" label="신고자명" value={formData.reporterName} disabled={true} />
      <Input type="text" name="reporterPhone" label="신고자번호" value={formData.reporterPhone} disabled={true} />
      <Input type="text" name="reportTime" label="신고시간" value={formData.reportedTime.toLocaleString()} disabled={true} placeholder="yyyy.mm.dd hh:mm:ss" />
      
    </div>
    <div className="right-column">
      <Input type="text" name="emergencyRoom" label="응급실" value={formData.hospitalName} disabled={true} />
      <Input type="text" name="patientName" label="환자명" value={formData.memberName} disabled={true} />
      <div className="patient-basic-info">
        <Input type="text" name="gender" label="성별" value={formData.gender} disabled={true} />
        <Input type="text" name="birthDate" label="생년월일" value={formData.birth} disabled={true} />
        {/* <Input type="text" name="bloodType" label="혈액형" value={formData.bloodType1 + "형,   " + formData.bloodType2} disabled={true} /> */}
        <Input type="text" name="bloodType" label="혈액형" 
          value={
            formData.bloodType1 
              ? `${formData.bloodType1}형${formData.bloodType2 ? ", " + formData.bloodType2 : ""}`
              : formData.bloodType2 || ""
          } 
          disabled={true} 
        />
      </div>
      <Textarea name="diseases" value={formData.chronicDisease} label="지병정보" overflow="hidden" disabled={true} />
      <Textarea name="medications" value={formData.drugInfos} label="투약정보" overflow="hidden" disabled={true} />
      <Textarea name="specialNotes" value={formData.otherInfo} label="기타특이사항" overflow="hidden" disabled={true} />
    </div>
  </form>
);

export default InfoForm;
