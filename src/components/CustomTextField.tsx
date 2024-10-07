//import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';


    const CustomTextField = styled(TextField)(() => ({
        "& .MuiInputBase-root": {
          color: "white", // Input text color
        },
        "& .MuiInput-underline:before": {
          borderBottomColor: "white", // White border color
        },
        "&:hover .MuiInput-underline:before": {
          borderBottomColor: "white", // White border color on hover
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "white", // White border color when focused
        },
        "& .MuiInputLabel-root": {
          color: "white", // Label color
          zIndex: 1, // Make sure the label is below the placeholder

        },
        "&.Mui-focused .MuiInputLabel-root": {
          color: "white", // Label color when focused
        },
        "& .MuiInputBase-input::placeholder": {
          color: "white", // Placeholder color
          opacity: 1, // Always keep the placeholder fully visible
        },
      }));


export default CustomTextField;