import { styled } from "@mui/material"
import { Chip } from "@mui/material"
import Link from "next/link";

export const StyledLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '2em',
    width: '2em', // Set width equal to height to make it a square
    padding: '0',
    border: '1px solid #202d33', // Border color
    borderRadius: '10px',
    backgroundColor: '#1a2624',
    cursor: 'pointer',
    color: '#647171',
    textAlign: 'center',
    textDecoration: 'none', // Remove underline
    '&:hover': {
      backgroundColor: '#39db7d',
      color: '#fff',
    },
  }));

 export const StyledChip = styled(Chip)(({ theme }) => ({
    color: '#647171',
    borderColor: "#202d33",
    transition: ".3s ease-in-out",
    '&:hover': {
        borderColor: '#39db7d',
    },
  }));
