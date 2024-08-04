'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { firestore } from "@/firebase";
import { styled } from "@mui/material";
import { StyledChip, StyledLink } from "/app/PageStyles";
import { Box, Button, Chip, Modal, Stack, Typography, Avatar } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, addDoc } from "firebase/firestore";
import Link from "next/link";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SpeedIcon from '@mui/icons-material/Speed';
import SearchComponent from "/app/components/SearchField";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WindowIcon from '@mui/icons-material/Window';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import tomato from '/public/tomato.jpg';
import InputComponent from "/app/components/InputField";
import "/app/globals.css";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lifeSpan, setLifeSpan] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        console.log('Document:', doc.id, doc.data());
        inventoryList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log('Inventory List:', inventoryList);
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const addItem = async () => {
    if (!itemName || !quantity || !itemType || !itemCategory || !lifeSpan) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const inventoryRef = collection(firestore, 'inventory');
      const docRef = doc(inventoryRef, itemName); // or use addDoc for auto-generated ID

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity: existingQuantity } = docSnap.data();
        await setDoc(docRef, { quantity: existingQuantity + parseInt(quantity), itemType, itemCategory, lifeSpan });
      } else {
        await setDoc(docRef, { quantity: parseInt(quantity), itemType, itemCategory, lifeSpan });
      }
      await updateInventory();
      resetFields();
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetFields = () => {
    setItemName('');
    setItemType('');
    setItemCategory('');
    setQuantity('');
    setLifeSpan('');
  };

  const removeItem = async (id) => {
    try {
      const docRef = doc(firestore, 'inventory', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: "#141E22" }}
      padding="32px"
      margin={0}
      boxSizing="border-box"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        color="#647171"
      >
        <Typography
          variant="h4"
          color="#fff"
          sx={{ fontWeight: "600", fontSize: "1.5rem" }}
        >
          PAN<span style={{ color: "#39db7d" }}>Track</span>
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link href="#">
            <StyledChip
              icon={<SpeedIcon />}
              label="Dashboard"
              variant="outlined"
            />
          </Link>
          <Button
            onClick={() => setOpen(true)}
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 12px',
              borderColor: '#202d33',
              color: '#647171',
              borderRadius: "40px",
              '&:hover': {
                borderColor: '#39db7d',
              },
            }}
          >
            <ShoppingBasketIcon fontSize="small" color="success" />
            <Typography variant="h6" sx={{
              fontSize: '.86rem',
              textTransform: 'capitalize',
              textAlign: 'center',
              padding: '0 5px'
            }}>
              Inventory
            </Typography>
            <ArrowDropDownIcon fontSize="small" />
          </Button>
          <StyledChip
            label="Sales"
            variant="outlined"
          />
          <StyledChip
            className="links"
            label="Order"
            variant="outlined"
          />
          <Link href="#">
            <StyledChip
              label="Reports"
              variant="outlined"
            />
          </Link>
          <Link href="#">
            <StyledChip
              label="Document"
              variant="outlined"
            />
          </Link>
        </Stack>
        <Stack direction="row" align="center" spacing={2}>
          <StyledLink href="#">
            <SettingsIcon />
          </StyledLink>
          <StyledLink href="#">
            <NotificationsIcon />
          </StyledLink>
          <Avatar sx={{
            bgcolor: "#f3a952",
            width: '1.5em',
            height: '1.5em',
          }}>
            A
          </Avatar>
        </Stack>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="2em"
        width="100%"
        margin="1em 0"
        color="white"
      >
        <Typography variant="h5" fontWeight={600} letterSpacing={1}>Product</Typography>
        <Chip
          label={`${inventory.length} total products`}
          variant="outlined"
          sx={{ color: "#fff" }}
        />
        <SearchComponent />
        <Stack
          direction="row"
          align="center"
          justifyContent="flex-end"
          spacing={2}
          width="40%"
        >
          <StyledLink href="#">
            <FormatListBulletedIcon />
          </StyledLink>
          <StyledLink href="#">
            <WindowIcon />
          </StyledLink>
          <StyledLink href="#">
            <MoreHorizIcon />
          </StyledLink>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 12px',
              borderColor: '#202d33',
              bgcolor: "#39db7d",
              borderRadius: "40px",
              '&:hover': {
                borderColor: '#39db7d',
                bgcolor: "#28b15f"
              },
            }}
          >
            <ShoppingBasketIcon fontSize="small" />
            <Typography
              variant="h6"
              sx={{ textTransform: 'capitalize', textAlign: 'center', padding: '0 5px' }}
            >
              Add Item
            </Typography>
          </Button>
        </Stack>
      </Box>
      <Box width="100%" display="flex" flexDirection="column" gap={2} margin="0 auto">
        {inventory.map((item) => (
          <Box
            key={item.id}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
            sx={{ backgroundColor: '#2C3E50', borderRadius: '5px' }}
          >
            <Typography variant="h6" color="#fff">
              {item.itemName}
            </Typography>
            <Typography variant="body1" color="#fff">
              {item.itemType} | {item.itemCategory} | {item.quantity} in stock
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Add New Item
          </Typography>
          <Stack spacing={2} mt={2}>
            <InputComponent label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <InputComponent label="Item Type" value={itemType} onChange={(e) => setItemType(e.target.value)} />
            <InputComponent label="Item Category" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} />
            <InputComponent label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <InputComponent label="Life Span" value={lifeSpan} onChange={(e) => setLifeSpan(e.target.value)} />
            <Button onClick={addItem} variant="contained" color="success">
              Add Item
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
