"use client"
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {TextField, Box, Typography, Stack, Modal, Button} from '@mui/material';
import {collection, getDocs, query, setDoc, deleteDoc, getDoc, doc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory, inventoryList] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  var arr = []
  var kay = ["jesus", "christ"]
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
    })
    console.log(inventoryList) //prints an array
    console.log(Object.prototype.toString.call(inventoryList)) //prints [Object Array]
    // inventoryList.map((name, quantity) => {
    //   console.log({name}) //correctly prints out a name
    //   })
  })
    setInventory(inventoryList)
    console.log(Object.prototype.toString(inventory)) //prints [object Object]
    newAttempt()
  }
  const addItem = async(item) =>{
    const docRef = doc(collection(firestore, "inventory"), item.toLowerCase())
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity + 1})
      }
      else{
        await setDoc(docRef, {quantity: 1})
      }
      await updateInventory()
      console.log(Object.prototype.toString.call(inventory)) //object Array
      const result = await newAttempt()
      console.log(result)
      // inventoryList.map((name, quantity) => {
      //   console.log({name}) //map is undefined for inventoryList
      //   })
  }
  const removeItem = async(item) =>{
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }
  const newAttempt = async() => {
    const q = collection(firestore, "inventory")
    const querySnapshot = await getDocs(q) 
    var arr = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    console.log(arr)
    return arr
  }
//add error if user tries to add nothing
  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={"#ff8181"}
    >
      <Typography variant={'h1'} color={'#333'} textAlign={'center'}>
            Pantry
          </Typography>
      <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              type="search"
              fullWidth
              onChange={(e) => setSearchQuery(e.target.value)}

            />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box bgcolor={'#ADD8E6'}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            bg-color={"#d16a6a"}
            onChange={(e) => setItemName(e.target.value)}
          />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
            </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            name.includes(searchQuery) ? (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.split(" ").map((x) => (
                  x.charAt(0).toUpperCase() + x.slice(1) + " "
                ))}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => addItem(name)}>
                Add
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
              </Stack>
            </Box>
            ) : null
          ))}
        </Stack>
      </Box>
    </Box>
  )}
