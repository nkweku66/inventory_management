'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { firestore } from "@/firebase";
import { styled } from "@mui/material";
import { StyledChip, StyledLink } from "/app/PageStyles";
import { Box, Button, Chip, Modal, Stack, Typography, Avatar, TextField } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
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
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import { CalendarMonth, Note, ShoppingCart, CameraAlt } from "@mui/icons-material";
import tomato from '/public/tomato.jpg';
import InputComponent from "/app/components/InputField";
import "/app/globals.css";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
}

export default function Home() {
  // We'll add our component logic here
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [itemType, setItemType] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [lifeSpan, setLifeSpan] = useState('');
    const [itemImage, setItemImage] = useState('');
    
    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
            docs.forEach((doc) => {
                inventoryList.push({ name: doc.id, ...doc.data() })
            })
        setInventory(inventoryList)
    }
    
    const UNSPLASH_ACCESS_KEY = 'OUZf3VWAjkQ9YoZRbb9_buL6Cf4zB-m6PCqGi4UXvAc';

    useEffect(() => {
        if (itemName) {
        fetch(`https://api.unsplash.com/search/photos?query=${itemName}&per_page=1`, {
            headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        })
            .then(response => response.json())
            .then(data => {
            if (data.results && data.results.length > 0) {
                setItemImage(data.results[0].urls.small);
            }
            })
            .catch(error => console.error('Error fetching image:', error));
        }
    }, [itemName]);
    
    useEffect(() => {
        updateInventory()
    }, [])

    const addItem = async () => {
        if (!itemName.trim()) {
            alert("Item name cannot be empty");
            return;
        }

        const item = {
            name: itemName.trim(),
            type: itemType,
            category: itemCategory,
            quantity: parseInt(quantity) || 0,
            lifeSpan: lifeSpan
        }

        try {
            const docRef = doc(collection(firestore, 'inventory'), item.name);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const existingData = docSnap.data();
                await setDoc(docRef, { 
                    ...existingData,
                    quantity: (existingData.quantity || 0) + (item.quantity || 1)
                }, { merge: true });
            } else {
                await setDoc(docRef, item);
            }
        
            await updateInventory();
            setItemName('');
            setItemType('');
            setItemCategory('');
            setQuantity('');
            setLifeSpan('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("An error occurred while adding the item");
        }
    }
    
    // Delete the entire item
    const deleteItem = async (item) => {
        if (!item || !item.name) {
            console.error("Invalid item or item name is missing");
            return;
        }

        try {
            const docRef = doc(collection(firestore, 'inventory'), item.name);
            await deleteDoc(docRef);
            await updateInventory();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    // Increase the quantity of the item
    const increaseQuantity = async (item) => {
        if (!item || !item.name) {
            console.error("Invalid item or item name is missing");
            return;
        }

        try {
            const docRef = doc(collection(firestore, 'inventory'), item.name);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const { quantity } = docSnap.data();
                await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
            } else {
                console.warn(`Item ${item.name} not found in the database`);
            }
            
            await updateInventory();
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    }

    // Decrease the quantity of the item
    const decreaseQuantity = async (item) => {
        if (!item || !item.name) {
            console.error("Invalid item or item name is missing");
            return;
        }

        try {
            const docRef = doc(collection(firestore, 'inventory'), item.name);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const { quantity } = docSnap.data();
                if (quantity <= 1) {
                    await deleteDoc(docRef);
                } else {
                    await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
                }
            } else {
                console.warn(`Item ${item.name} not found in the database`);
            }
            
            await updateInventory();
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    }
    
    // Add modals
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    

    return (
        <Box
            width="100vw"
            height="100vh"
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            gap={2}
            padding="32px"
            margin={0}
            boxSizing="border-box"
            bgcolor="#141e22"
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
                icon={<CategoryIcon />}
                label="Categories"
                variant="outlined"
            />
            <StyledChip
                icon={<CalendarMonth />}
                label="Expiration Dates"
                variant="outlined"
            />
            <Link href="#">
                <StyledChip
                    icon={<ShoppingCart />}
                    label="Shopping List"
                    variant="outlined"
                />
            </Link>
            <Link href="#">
                <StyledChip
                    icon={<Note />}
                    label="Reports"
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
            <Typography variant="h5" fontWeight={600} letterSpacing={1}>Item</Typography>
            <Chip
            label={`${inventory.length} total items`}
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
                    <CameraAlt />
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
                    color: '#000',
                    borderRadius: "10px",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    '&:hover': {
                        borderColor: '#39db7d',
                        color: '#647171',
                    },
                }}
            >
            Add Item
            </Button>
        </Stack>
        </Box>
        <Modal 
            open={open} 
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
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
                <Typography variant="h6" fontSize={14}>Product Name</Typography>
                <InputComponent
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
            </Stack>
            <Stack direction="row" gap={4}>
                <Stack width="100%" spacing={2}>
                    <Typography variant="h6" fontSize={14}>Product Type</Typography>
                    <InputComponent
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    />
                </Stack>
                <Stack width="100%" spacing={2}>
                    <Typography variant="h6" fontSize={14}>Product Category</Typography>
                    <InputComponent
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    />
                </Stack>
            </Stack>
            <Stack direction="row" gap={4}>
                <Stack width="100%" spacing={2}>
                    <Typography variant="h6" fontSize={14}>Quantity</Typography>
                    <InputComponent
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    />
                </Stack>
                <Stack width="100%" spacing={2}>
                    <Typography variant="h6" fontSize={14}>Life Span</Typography>
                    <InputComponent
                        value={lifeSpan}
                        onChange={(e) => setLifeSpan(e.target.value)}
                    />
                </Stack>
            </Stack>
            <Stack width="100%" spacing={2}>
                    <Typography variant="h6" fontSize={14}>Description</Typography>
                    <InputComponent
                        // value={lifeSpan}
                        // onChange={(e) => setLifeSpan(e.target.value)}
                        multiline
                    />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        addItem({
                            name: itemName,
                            type: itemType,
                            category: itemCategory,
                            quantity: parseInt(quantity),
                            lifeSpan: lifeSpan
                        })
                        setItemName('')
                        setItemType('')
                        setItemCategory('')
                        setQuantity('')
                        setLifeSpan('')
                        handleClose()
                    }}
                        sx={{
                        borderColor: "#39db7d",
                        color: "#fff",
                        '&:hover': {
                            borderColor: '#39db7d',
                            bgcolor: "#39db7d",
                            color: "#000",
                        },
                    }}
                >
                Add
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleClose()}
                    sx={{
                    borderColor: "#f3a952",
                    color: "#fff",
                    '&:hover': {
                        borderColor: '#f3a952',
                        bgcolor: "#f3a952",
                        color: "#000",
                    },
                    }}
                >
                    Cancel
                </Button>
            </Stack>
            </Box>
        </Modal>
        <Box 
            display={'flex'} 
            gap={3} 
            border={'1px solid red'} 
            width="100%"
            height="100%"
        >
            <Box
                width={'100%'}
                height="100%"
                flex={1}
                p={2}
                border={'1px solid red'}
                bgcolor="#1a262d"
                borderRadius={5}
                color="#fff"
            >
                <Box marginBottom={2}>
                    <Typography fontSize={14} fontWeight={500} color="#647171" marginBottom={1}>ITEM STATUS</Typography>
                    <Stack
                        display="grid"
                        gridTemplateColumns={'repeat(2, 1fr)'}
                        gridTemplateRows={'repeat(2, 40px)'}
                        gap={1}
                        direction="row">
                        <Box
                            border="1px solid #39db7d"
                            p={2}
                            color="#fff"
                            borderRadius="10px"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <Typography>All</Typography>
                            {inventory.length}
                        </Box>
                        <Box
                            border="1px solid #39db7d"
                            p={2}
                            color="#fff"
                            borderRadius="10px"
                            width="100%"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>Frozen</Typography>
                            {inventory.length}
                        </Box>
                        <Box
                            border="1px solid #39db7d"
                            p={2}
                            color="#fff"
                            borderRadius="10px"
                            width="100%"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>Dry Goods</Typography>
                            {inventory.length}
                        </Box>
                        <Box
                            border="1px solid #39db7d"
                            p={2}
                            color="#fff"
                            borderRadius="10px"
                            width="100%"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>Fresh </Typography>
                            {inventory.length}
                        </Box>
                    </Stack>
                </Box>
                <Box>
                    <Typography fontSize={14} fontWeight={500} color="#647171" marginBottom={1}>ITEM STATUS</Typography>
                    <Stack
                        display="grid"
                        gridTemplateColumns={'repeat(2, 1fr)'}
                        gridTemplateRows={'repeat(1, 40px)'}
                        gap={1}
                        direction="row">
                        <Box
                            border="1px solid #39db7d"
                            p={2}
                            color="#fff"
                            borderRadius="10px"
                            width="100%"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>Organic</Typography>
                            {inventory.length}
                        </Box>
                        <Box
                            border="1px solid #39db7d"
                            p={2}
                            color="#fff"
                            borderRadius="10px"
                            width="100%"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>Processed</Typography>
                            {inventory.length}
                        </Box>
                    </Stack>
                </Box>

            </Box>
            <Box flex={3}>
            <Stack 
                width="100%"
                spacing={2}
                overflow={'auto'}
                maxHeight="70vh" // Set the maximum height
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f0f0f0',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#aaa',
                        borderRadius: '10px',
                    },
                }}
            >
                {inventory.map((item) => (
                <Box
                    key={item.name}
                    width="100%"
                    maxHeight="80px"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    bgcolor={'#f0f0f0'}
                    paddingX={5}
                    p={2}
                    sx={{
                        backgroundColor: "#1a262d",
                        borderRadius: '20px',
                        color: 'white',

                    }}
                >
                    <Box display="flex" alignItems="center" marginRight={5}>
                        <Image src={itemImage} alt={item.name} width={70} height={60} style={{ objectFit: "cover", borderRadius: "10px" }} />
                    </Box>
                    {/* <Stack gap={2}>
                        <Typography variant="h6" fontWeight={600}>
                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Chip
                                label={`Type: ${item.type}`}
                                variant="outlined"
                                sx={{ color: "#fff" }}
                            />
                            <Chip
                                label={`Category: ${item.category}`}
                                variant="outlined"
                                sx={{ color: "#fff" }}
                            />
                            <Chip
                                label={`Quantity: ${item.quantity}`}
                                variant="outlined"
                                sx={{ color: "#fff" }}
                            />
                            <Chip
                                label={`Life Span: ${item.lifeSpan}`}
                                variant="outlined"
                                sx={{ color: "#fff" }}
                            />
                        </Stack>
                    </Stack> */}
                    <Stack width="100%" direction="row" >
                        <Stack spacing={1} width="100%">
                            <Typography variant="h6" color="#fff" fontWeight={600}>
                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                            </Typography>
                            <Stack direction="row" spacing={10}  alignItems="center" width="100%">
                            <Stack direction="row" spacing={2} width="100%" alignItems="center">
                                <Chip label="3 types" color="primary" size="small" />
                                <Typography variant="body1" fontSize={14} color="rgba(255, 255, 255, 0.5)">Type: {item.type}</Typography>
                                <Typography variant="body1" fontSize={14} color="rgba(255, 255, 255, 0.5)">Category: {item.category}</Typography>
                                <Typography variant="body1" fontSize={14} color="rgba(255, 255, 255, 0.5)">Quantity: {item.quantity}</Typography>
                            </Stack>
                            </Stack>
                        </Stack>
                        {/* <Box width='10px' height='80px' bgcolor={'#202d33'}></Box> */}
                        <Stack
                            direction="row"
                            spacing={3} width="100%"
                            alignItems="center"
                            justifyContent="flex-end"
                            paddingLeft={5}
                            style={{borderLeft: "3px solid #39db7d"}}
                        >
                            <Stack spacing={1} width="100%">
                                <Typography variant="body1" color="rgba(255, 255, 255, 0.5)" fontSize={12} fontWeight={400}>SHELF LIFE</Typography>
                                <Typography variant="body1" color="#fff" fontSize={14} fontWeight={600}>{item.lifeSpan}</Typography>
                            </Stack>
                            <Stack spacing={1} width="100%">
                                <Typography variant="body1" color="rgba(255, 255, 255, 0.5)" fontSize={12} fontWeight={400}>PRODUCT PRICE</Typography>
                                <Typography variant="body1" color="#fff" fontSize={14} fontWeight={600}>$2.50</Typography>
                            </Stack>
                            <Stack direction="row" gap={2}>
                                <StyledLink href="#">
                                    <Button
                                        size="small"
                                        onClick={() => increaseQuantity(item)}
                                        sx = {{
                                            background: 'none',
                                            color: '#fff',
                                            '&:hover' : {
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    >
                                        <AddIcon />
                                    </Button>
                                </StyledLink>
                                <StyledLink href="#">
                                    <Button
                                        size="small"
                                        onClick={() => decreaseQuantity(item)}
                                        sx = {{
                                            background: 'none',
                                            color: '#fff',
                                            '&:hover' : {
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    >
                                        <RemoveIcon />
                                    </Button>
                                </StyledLink>
                                <StyledLink href="#">
                                    <Button
                                        size="small"
                                        onClick={() => deleteItem(item)}
                                        sx = {{
                                            background: 'none',
                                            color: '#fff',
                                            '&:hover' : {
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </StyledLink>
                            </Stack>
                        </Stack>
                    </Stack>
                    {/* <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                    Quantity: {quantity}
                    </Typography> */}
                </Box>
                ))}
            </Stack>
            </Box>
        </Box>
    </Box>
    )
}