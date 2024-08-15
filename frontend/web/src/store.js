import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './slices/loginSlice'
import reportSlice from './slices/reportSlice'
import incidentSlice from './slices/incidentSlice'
import emergencySlice from './slices/emergencySlice'


export default configureStore({
  reducer: { 
    "loginSlice": loginSlice,
    "reportSlice": reportSlice,
    "incident": incidentSlice,
    "emergencySlice": emergencySlice
  }
})
