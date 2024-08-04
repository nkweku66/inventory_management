'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { firestore } from "@/firebase";
import { styled } from "@mui/material"
import {StyledChip, StyledLink} from "./PageStyles"
import { Box, Button, Chip, Modal, Stack, TextField, Typography, Avatar } from "@mui/material"
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import Link from "next/link";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SpeedIcon from '@mui/icons-material/Speed';
import SearchComponent from "./components/SearchField";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WindowIcon from '@mui/icons-material/Window';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import tomato from '/public/tomato.jpg'
import InputComponent from "./components/InputField";
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
    const snapshot = query(collection(firestore, 'inventory'));
    const inventoryList = [];
    const docs = await getDocs(snapshot);
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList);
  }

  const addItem = async () => {

    if (!itemName) return;

    const docRef = doc(collection(firestore, 'inventory'), itemName)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, {quantity: existingQuantity + 1, itemType, itemCategory, lifeSpan })
    } else {
      await setDoc(docRef, {quantity: 1, itemType, itemCategory, lifeSpan })
    }
    await updateInventory();
    resetFields();
    handleClose();
  }

  const resetFields = () => {
    setItemName('');
    setItemType('');
    setItemCategory('');
    setQuantity('');
    setLifeSpan('');
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory();
  }, [])


  return (
    <Box
      width="100vw"
      height="100vh"
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
      // border={`1px solid red`}
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
          // icon={<ContentPasteIcon fontSize="small" />}
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
      <Stack 
        direction="row"
        align="center"
        spacing={2}
        >
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
        }}
        >
        A
        </Avatar>
      </Stack>
    </Box>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap="2em"
      // border="1px solid yellow"
      width="100%"
      margin="1em 0"
      color="white"
      // padding="1em"
    >
      <Typography variant="h5" fontWeight={600} letterSpacing={1}>product</Typography>
      <Chip
        label={`20 total products`}
        variant="outlined"
        sx={{color: "#fff"}}
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
        <Button variant="outlined" color="primary" onClick={() => setOpen(true)}
          sx={
            {
              display: 'flex',
              alignItems: 'center', 
              padding: '5px 12px', 
              borderColor: '#202d33',
              bgcolor: "#39db7d",
              color: '#000',
              borderRadius: "10px",
              textTransform: "capitalize",
              fontWeight: "bold",
              '&:hover': {
                borderColor: '#39db7d',
                color: '#647171',
              },
            }
          }
        >Add Product</Button>
      </Stack>
      <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={600}
        bgcolor="#1a262d"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
            transform: "translate(-50%, -50%)",
            color: "rgba(255, 255, 255)"
        }}
      >
      <Typography variant="h5" fontWeight={600} align="center">ADD A NEW ITEM</Typography>
      <Stack width="100%" spacing={2}>
        <Typography variant="h6" fontSize={14}>Product name</Typography>
        <InputComponent
          value={itemName}
          onChange={(e) => {
              setItemName(e.target.value);
            }
          }
        />
      </Stack>
      <Stack direction="row" gap={4}>
        <Stack width="100%" spacing={2}>
          <Typography variant="h6" fontSize={14}>Product Type</Typography>
          <InputComponent
            value={itemType}
            onChange={(e) => {
                setItemType(e.target.value);
              }
            }
          />
        </Stack>
        <Stack width="100%" spacing={2}>
          <Typography variant="h6" fontSize={14}>Product Category</Typography>
          <InputComponent
            value={itemCategory}
            onChange={(e) => {
                setItemCategory(e.target.value);
              }
            }
          />
        </Stack>
      </Stack>
      <Stack direction="row" gap={4}>
        <Stack width="100%" spacing={2}>
          <Typography variant="h6" fontSize={14}>Quantity</Typography>
          <InputComponent
            value={quantity}
            onChange={(e) => {
                setItemQuantity(e.target.value);
              }
            }
          />
        </Stack>
        <Stack width="100%" spacing={2}>
          <Typography variant="h6" fontSize={14}>Life Span</Typography>
          <InputComponent
            value={lifeSpan}
            onChange={(e) => {
                setLifeSpan(e.target.value);
              }
            }
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={addItem}
          >
            Add
          </Button>
          <Button
              variant="outlined"
              color="error"
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
        </Stack>
      </Stack>
      </Box>
    </Modal>
    </Box>
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      border="1px solid red"
      width="100%"
      height="100%"
    >
      <Box
        border="1px solid blue"
        flex={1}
      >
      </Box>
      <Box
        // border="1px solid green"
        flex={3}
        overflow="auto"
        width="100%"
        height="100%"
      >
        {inventory.map((item) => (
          <Box
            width="100%"
            bgcolor="#1a262d"
            p="10px"
            key={item.id}
            display="flex"
            // justifyContent="space-between"
            gap={4}
            alignItems="center"
            borderRadius={3}
          >
            <Image
              src={tomato}
              alt="Tomatoes"
              width={90}
              height={80}
              // layout="responsive"
              style={{ objectFit: 'cover', borderRadius: '15px' }}
            />
            <Stack width="100%" direction="row" >
              <Stack spacing={1} width="100%">
                <Typography variant="h6" color="#fff" fontWeight={600}>{item.id}</Typography>
                <Stack direction="row" spacing={10}  alignItems="center" width="100%">
                  <Stack direction="row" spacing={2} width="100%" alignItems="center">
                    <Chip label="3 types" color="primary" size="small"></Chip>
                    <Typography variant="body1" fontSize={14} color="rgba(255, 255, 255, 0.5)">Type: {item.itemType}</Typography>
                    <Typography variant="body1" fontSize={14} color="rgba(255, 255, 255, 0.5)">Category: {item.itemCategory}</Typography>
                    <Typography variant="body1" fontSize={14} color="rgba(255, 255, 255, 0.5)">Quantity: {item.quantity}</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                spacing={10} width="100%"
                alignItems="center"
                justifyContent="flex-end"
                style={{borderLeft: "3px solid #39db7d"}}
              >
                <Stack spacing={1}>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.5)" fontSize={12} fontWeight={400}>SHELF LIFE</Typography>
                  <Typography variant="body1" color="#fff" fontSize={14} fontWeight={600}>{item.lifeSpan}</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.5)" fontSize={12} fontWeight={400}>PRODUCT PRICE</Typography>
                  <Typography variant="body1" color="#fff" fontSize={14} fontWeight={600}>$2.50</Typography>
                </Stack>
                <StyledLink href="#">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    <MoreHorizIcon />
                  </Button>
                </StyledLink>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Box>
    </Stack>
    </Box>

  );
}
