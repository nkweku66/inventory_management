import { styled } from "@mui/material";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const CustomSearchField = styled(TextField)(({ theme }) => ({
    display: "flex",
    backgroundColor: "#141e22",
    color: "#fff",
    width: "100%",
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: '#202d33',
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
        padding: "8px"
    },
    '& .MuiInputAdornment-root': {
        color: '#fff',
    },
}));

const SearchComponent = () => {
    return (
        <CustomSearchField
            id="custom-search"
            variant="outlined"
            type="search"
            placeholder="Search product..."
            fullWidth
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchComponent;
