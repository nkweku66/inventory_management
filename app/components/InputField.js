import { styled } from "@mui/material";
import { TextField } from "@mui/material";

const CustomInputField = styled(TextField)(({ theme }) => ({
    display: "flex",
    backgroundColor: "#141e22",
    color: "#fff",
    width: "100%",
    borderRadius: "12px",
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        // borderColor: '#202d33',
        border: "1px solid #627171",
        borderRadius: "12px",
        transition: ".3s ease-in-out",
        },
        '&:hover fieldset': {
        borderColor: '#39db7d',
        },
        '&.Mui-focused fieldset': {
        borderColor: '#39db7d',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#ccc',
    },
    '& .MuiInputBase-input': {
        color: '#fff',
        padding: "15px"
    },
    '& .MuiInputAdornment-root': {
        color: '#fff',
    },
}));

const InputComponent = ({ value, onChange, ...props }) => {
    return (
        <CustomInputField
            id="custom-search"
            variant="outlined"
            type="text"
            fullWidth
            value={value}
            onChange={onChange}
            {...props}
        />
    );
};

export default InputComponent;
