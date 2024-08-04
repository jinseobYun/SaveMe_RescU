import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './slices/loginSlice'
import reportSlice from './slices/reportSlice'


export default configureStore({
  reducer: { 
    "loginSlice": loginSlice,
    "reportSlice": reportSlice,
  }
})
