# UI Examples

This page provides examples of the user interface components and screens in ClipFlowAI. These examples serve as a reference for developers and designers to maintain consistency throughout the application.

## Login and Authentication

### Login Screen

The login screen provides options for users to sign in with their email and password or through social providers.

```jsx
<Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
  <VStack spacing={4} align="stretch">
    <Heading as="h1" size="xl" textAlign="center">
      ClipFlowAI
    </Heading>
    <Text textAlign="center" color="gray.600">
      Sign in to your account
    </Text>
    
    <FormControl id="email">
      <FormLabel>Email address</FormLabel>
      <Input type="email" />
    </FormControl>
    
    <FormControl id="password">
      <FormLabel>Password</FormLabel>
      <Input type="password" />
    </FormControl>
    
    <Button colorScheme="blue" size="lg" width="full">
      Sign In
    </Button>
    
    <Divider />
    
    <Button variant="outline" width="full" leftIcon={<FaGoogle />}>
      Continue with Google
    </Button>
    
    <Text textAlign="center">
      Don't have an account?{" "}
      <Link color="blue.500">Sign Up</Link>
    </Text>
  </VStack>
</Box>
```

### Registration Screen

The registration screen allows new users to create an account.

```jsx
<Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
  <VStack spacing={4} align="stretch">
    <Heading as="h1" size="xl" textAlign="center">
      Create an Account
    </Heading>
    
    <FormControl id="name">
      <FormLabel>Full Name</FormLabel>
      <Input type="text" />
    </FormControl>
    
    <FormControl id="email">
      <FormLabel>Email address</FormLabel>
      <Input type="email" />
    </FormControl>
    
    <FormControl id="password">
      <FormLabel>Password</FormLabel>
      <Input type="password" />
    </FormControl>
    
    <FormControl id="confirm-password">
      <FormLabel>Confirm Password</FormLabel>
      <Input type="password" />
    </FormControl>
    
    <Button colorScheme="blue" size="lg" width="full">
      Sign Up
    </Button>
    
    <Text textAlign="center">
      Already have an account?{" "}
      <Link color="blue.500">Sign In</Link>
    </Text>
  </VStack>
</Box>
```

## Dashboard

### Main Dashboard

The main dashboard displays the user's videos and provides quick access to create new videos.

```jsx
<Box p={4}>
  <Flex justify="space-between" align="center" mb={6}>
    <Heading as="h1" size="xl">
      Dashboard
    </Heading>
    <Button colorScheme="blue" leftIcon={<FaPlus />}>
      Create Video
    </Button>
  </Flex>
  
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
    {videos.map((video) => (
      <Box key={video.id} borderWidth={1} borderRadius="lg" overflow="hidden">
        <Image src={video.thumbnail} alt={video.title} />
        <Box p={4}>
          <Heading as="h3" size="md" mb={2}>
            {video.title}
          </Heading>
          <Text color="gray.600" noOfLines={2} mb={3}>
            {video.description}
          </Text>
          <Flex justify="space-between" align="center">
            <Text color="gray.500" fontSize="sm">
              {new Date(video.createdAt).toLocaleDateString()}
            </Text>
            <HStack>
              <IconButton 
                aria-label="Edit video" 
                icon={<FaEdit />} 
                size="sm" 
                variant="ghost" 
              />
              <IconButton 
                aria-label="Share video" 
                icon={<FaShare />} 
                size="sm" 
                variant="ghost" 
              />
              <IconButton 
                aria-label="Delete video" 
                icon={<FaTrash />} 
                size="sm" 
                variant="ghost" 
              />
            </HStack>
          </Flex>
        </Box>
      </Box>
    ))}
  </SimpleGrid>
</Box>
```

## Video Creation

### Create Video Form

The create video form allows users to input details for generating a new video.

```jsx
<Box maxW="3xl" mx="auto" p={4}>
  <Heading as="h1" size="xl" mb={6}>
    Create New Video
  </Heading>
  
  <VStack spacing={6} align="stretch">
    <FormControl id="title" isRequired>
      <FormLabel>Video Title</FormLabel>
      <Input placeholder="Enter a title for your video" />
    </FormControl>
    
    <FormControl id="prompt" isRequired>
      <FormLabel>Prompt</FormLabel>
      <Textarea 
        placeholder="Describe what you want in your video..." 
        minH="150px"
      />
      <FormHelperText>
        Be specific about the content, style, and tone you want in your video.
      </FormHelperText>
    </FormControl>
    
    <FormControl id="background-image">
      <FormLabel>Background Image (Optional)</FormLabel>
      <Box 
        borderWidth={1} 
        borderRadius="md" 
        borderStyle="dashed" 
        p={6} 
        textAlign="center"
      >
        <Icon as={FaImage} w={10} h={10} color="gray.400" mb={2} />
        <Text mb={2}>Drag and drop an image here, or click to select</Text>
        <Input type="file" accept="image/*" hidden />
        <Button size="sm" variant="outline">
          Select Image
        </Button>
      </Box>
    </FormControl>
    
    <FormControl id="platforms">
      <FormLabel>Share to Platforms</FormLabel>
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
        <Checkbox>Instagram</Checkbox>
        <Checkbox>TikTok</Checkbox>
        <Checkbox>YouTube</Checkbox>
        <Checkbox>Facebook</Checkbox>
        <Checkbox>Twitter</Checkbox>
      </SimpleGrid>
    </FormControl>
    
    <Divider />
    
    <Flex justify="space-between">
      <Button variant="outline">Cancel</Button>
      <Button colorScheme="blue" rightIcon={<FaPlay />}>
        Generate Video
      </Button>
    </Flex>
  </VStack>
</Box>
```

### Video Generation Progress

This screen shows the progress of video generation.

```jsx
<Box maxW="3xl" mx="auto" p={4} textAlign="center">
  <Heading as="h1" size="xl" mb={2}>
    Generating Your Video
  </Heading>
  
  <Text color="gray.600" mb={8}>
    This may take a few minutes. Please don't close this page.
  </Text>
  
  <Box mb={8}>
    <Progress 
      value={65} 
      size="lg" 
      colorScheme="blue" 
      borderRadius="md" 
      mb={2}
    />
    <Text>65% Complete</Text>
  </Box>
  
  <VStack spacing={4} mb={8}>
    <Box 
      p={4} 
      borderWidth={1} 
      borderRadius="md" 
      width="full" 
      bg="green.50"
    >
      <Flex align="center">
        <Icon as={FaCheck} color="green.500" mr={2} />
        <Text>Generating script</Text>
      </Flex>
    </Box>
    
    <Box 
      p={4} 
      borderWidth={1} 
      borderRadius="md" 
      width="full" 
      bg="green.50"
    >
      <Flex align="center">
        <Icon as={FaCheck} color="green.500" mr={2} />
        <Text>Creating voiceover</Text>
      </Flex>
    </Box>
    
    <Box 
      p={4} 
      borderWidth={1} 
      borderRadius="md" 
      width="full" 
      bg="blue.50"
    >
      <Flex align="center">
        <Spinner size="sm" color="blue.500" mr={2} />
        <Text>Adding captions</Text>
      </Flex>
    </Box>
    
    <Box 
      p={4} 
      borderWidth={1} 
      borderRadius="md" 
      width="full"
    >
      <Flex align="center">
        <Icon as={FaClock} color="gray.300" mr={2} />
        <Text color="gray.500">Finalizing video</Text>
      </Flex>
    </Box>
  </VStack>
  
  <Button variant="outline" leftIcon={<FaBell />}>
    Notify me when complete
  </Button>
</Box>
```

## Video Management

### Video Details

The video details screen shows information about a specific video and provides options for editing and sharing.

```jsx
<Box maxW="4xl" mx="auto" p={4}>
  <Flex 
    direction={{ base: "column", md: "row" }} 
    gap={6} 
    mb={6}
  >
    <Box 
      flex="1" 
      borderRadius="md" 
      overflow="hidden" 
      borderWidth={1}
    >
      <AspectRatio ratio={16/9}>
        <Box bg="black">
          <video 
            controls 
            width="100%" 
            poster="/path/to/thumbnail.jpg"
          >
            <source src="/path/to/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </AspectRatio>
    </Box>
    
    <Box flex="1">
      <Heading as="h1" size="xl" mb={2}>
        How Blockchain Works
      </Heading>
      
      <Text color="gray.600" mb={4}>
        Created on April 15, 2023
      </Text>
      
      <Text mb={4}>
        An educational video explaining how blockchain technology works in simple terms with a casual, friendly tone.
      </Text>
      
      <HStack spacing={4} mb={6}>
        <Tag colorScheme="blue">Educational</Tag>
        <Tag colorScheme="green">Technology</Tag>
        <Tag colorScheme="purple">Explainer</Tag>
      </HStack>
      
      <VStack align="stretch" spacing={3}>
        <Button leftIcon={<FaEdit />} width="full">
          Edit Video
        </Button>
        <Button leftIcon={<FaShare />} colorScheme="blue" width="full">
          Share Video
        </Button>
        <Button leftIcon={<FaDownload />} variant="outline" width="full">
          Download
        </Button>
        <Button leftIcon={<FaTrash />} colorScheme="red" variant="ghost" width="full">
          Delete
        </Button>
      </VStack>
    </Box>
  </Flex>
  
  <Tabs>
    <TabList>
      <Tab>Analytics</Tab>
      <Tab>Captions</Tab>
      <Tab>Settings</Tab>
    </TabList>
    
    <TabPanels>
      <TabPanel>
        <Box p={4} borderWidth={1} borderRadius="md">
          <Heading as="h3" size="md" mb={4}>
            Performance Overview
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
            <Stat>
              <StatLabel>Views</StatLabel>
              <StatNumber>1,245</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
            
            <Stat>
              <StatLabel>Likes</StatLabel>
              <StatNumber>237</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5.05%
              </StatHelpText>
            </Stat>
            
            <Stat>
              <StatLabel>Shares</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                9.05%
              </StatHelpText>
            </Stat>
          </SimpleGrid>
          
          {/* Chart would go here */}
          <Box height="200px" bg="gray.100" borderRadius="md" />
        </Box>
      </TabPanel>
      
      <TabPanel>
        <Box p={4} borderWidth={1} borderRadius="md">
          <Heading as="h3" size="md" mb={4}>
            Video Captions
          </Heading>
          
          <VStack align="stretch" spacing={3}>
            <Flex>
              <Text width="60px" color="gray.500">00:00</Text>
              <Text>Welcome to this explainer on blockchain technology.</Text>
            </Flex>
            <Flex>
              <Text width="60px" color="gray.500">00:05</Text>
              <Text>At its core, blockchain is a distributed ledger technology.</Text>
            </Flex>
            <Flex>
              <Text width="60px" color="gray.500">00:10</Text>
              <Text>Think of it as a digital record book that's maintained by many computers.</Text>
            </Flex>
            {/* More captions would go here */}
          </VStack>
          
          <Button mt={4} size="sm" leftIcon={<FaDownload />}>
            Download Captions
          </Button>
        </Box>
      </TabPanel>
      
      <TabPanel>
        <Box p={4} borderWidth={1} borderRadius="md">
          <Heading as="h3" size="md" mb={4}>
            Video Settings
          </Heading>
          
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <FormLabel>Privacy</FormLabel>
              <Select defaultValue="public">
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select defaultValue="education">
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="howto">How-to & Style</option>
                <option value="tech">Science & Technology</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Allow Comments</FormLabel>
              <Switch defaultChecked />
            </FormControl>
          </VStack>
          
          <Button mt={6} colorScheme="blue">
            Save Settings
          </Button>
        </Box>
      </TabPanel>
    </TabPanels>
  </Tabs>
</Box>
```

## Sharing

### Share Video Modal

The share video modal allows users to share their videos to different platforms.

```jsx
<Modal isOpen={true} onClose={() => {}}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Share Your Video</ModalHeader>
    <ModalCloseButton />
    
    <ModalBody>
      <VStack spacing={4} align="stretch">
        <Box p={3} borderWidth={1} borderRadius="md">
          <Flex align="center">
            <Icon as={FaInstagram} boxSize={6} color="purple.500" mr={3} />
            <Box flex="1">
              <Text fontWeight="bold">Instagram</Text>
              <Text fontSize="sm" color="gray.600">Share to Instagram Reels</Text>
            </Box>
            <Switch defaultChecked />
          </Flex>
        </Box>
        
        <Box p={3} borderWidth={1} borderRadius="md">
          <Flex align="center">
            <Icon as={FaTiktok} boxSize={6} color="black" mr={3} />
            <Box flex="1">
              <Text fontWeight="bold">TikTok</Text>
              <Text fontSize="sm" color="gray.600">Share to TikTok</Text>
            </Box>
            <Switch defaultChecked />
          </Flex>
        </Box>
        
        <Box p={3} borderWidth={1} borderRadius="md">
          <Flex align="center">
            <Icon as={FaYoutube} boxSize={6} color="red.500" mr={3} />
            <Box flex="1">
              <Text fontWeight="bold">YouTube</Text>
              <Text fontSize="sm" color="gray.600">Share to YouTube Shorts</Text>
            </Box>
            <Switch />
          </Flex>
        </Box>
        
        <Box p={3} borderWidth={1} borderRadius="md">
          <Flex align="center">
            <Icon as={FaFacebook} boxSize={6} color="blue.500" mr={3} />
            <Box flex="1">
              <Text fontWeight="bold">Facebook</Text>
              <Text fontSize="sm" color="gray.600">Share to Facebook Reels</Text>
            </Box>
            <Switch />
          </Flex>
        </Box>
        
        <Box p={3} borderWidth={1} borderRadius="md">
          <Flex align="center">
            <Icon as={FaTwitter} boxSize={6} color="blue.400" mr={3} />
            <Box flex="1">
              <Text fontWeight="bold">Twitter</Text>
              <Text fontSize="sm" color="gray.600">Share to Twitter</Text>
            </Box>
            <Switch />
          </Flex>
        </Box>
        
        <Divider />
        
        <FormControl>
          <FormLabel>Caption</FormLabel>
          <Textarea 
            placeholder="Add a caption for your video..." 
            defaultValue="Check out my new video about blockchain technology! #blockchain #crypto #education"
          />
          <FormHelperText>
            This caption will be used for all selected platforms.
          </FormHelperText>
        </FormControl>
      </VStack>
    </ModalBody>
    
    <ModalFooter>
      <Button variant="outline" mr={3}>
        Cancel
      </Button>
      <Button colorScheme="blue" leftIcon={<FaShare />}>
        Share Now
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

## Settings

### User Profile Settings

The user profile settings screen allows users to update their profile information.

```jsx
<Box maxW="3xl" mx="auto" p={4}>
  <Heading as="h1" size="xl" mb={6}>
    Account Settings
  </Heading>
  
  <Tabs>
    <TabList>
      <Tab>Profile</Tab>
      <Tab>Preferences</Tab>
      <Tab>Billing</Tab>
      <Tab>API Keys</Tab>
    </TabList>
    
    <TabPanels>
      <TabPanel>
        <Box p={4} borderWidth={1} borderRadius="md">
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align={{ md: "center" }} 
            mb={6}
            gap={4}
          >
            <Avatar size="xl" name="John Doe" src="/path/to/avatar.jpg" />
            <Box>
              <Button size="sm" leftIcon={<FaUpload />}>
                Change Photo
              </Button>
              <Text fontSize="sm" color="gray.500" mt={1}>
                JPG, GIF or PNG. Max size 2MB.
              </Text>
            </Box>
          </Flex>
          
          <VStack spacing={4} align="stretch">
            <FormControl id="name">
              <FormLabel>Full Name</FormLabel>
              <Input defaultValue="John Doe" />
            </FormControl>
            
            <FormControl id="email">
              <FormLabel>Email Address</FormLabel>
              <Input defaultValue="john.doe@example.com" type="email" />
            </FormControl>
            
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <InputLeftAddon>@</InputLeftAddon>
                <Input defaultValue="johndoe" />
              </InputGroup>
            </FormControl>
            
            <FormControl id="bio">
              <FormLabel>Bio</FormLabel>
              <Textarea 
                defaultValue="Content creator specializing in educational videos about technology and finance."
                rows={3}
              />
            </FormControl>
            
            <Divider />
            
            <Flex justify="flex-end">
              <Button variant="outline" mr={3}>
                Cancel
              </Button>
              <Button colorScheme="blue">
                Save Changes
              </Button>
            </Flex>
          </VStack>
        </Box>
      </TabPanel>
      
      {/* Other tab panels would go here */}
    </TabPanels>
  </Tabs>
</Box>
```

## Responsive Design

All UI components should be responsive and work well on different screen sizes. Use Chakra UI's responsive props to adjust layouts based on screen size:

```jsx
<Flex 
  direction={{ base: "column", md: "row" }} 
  p={{ base: 4, md: 6 }}
  gap={{ base: 4, md: 6 }}
>
  <Box flex="1">
    {/* Content */}
  </Box>
  <Box 
    flex="1" 
    display={{ base: "none", md: "block" }}
  >
    {/* Content visible only on medium screens and larger */}
  </Box>
</Flex>
```

## Design System

ClipFlowAI uses a consistent design system with the following key elements:

### Colors

- Primary: `blue.500` (#3182CE)
- Secondary: `teal.500` (#319795)
- Accent: `purple.500` (#805AD5)
- Success: `green.500` (#38A169)
- Warning: `orange.500` (#DD6B20)
- Error: `red.500` (#E53E3E)
- Neutral: `gray.500` (#718096)

### Typography

- Headings: Poppins (or system font stack)
- Body: Inter (or system font stack)
- Code: Fira Code (or monospace font stack)

### Spacing

Follow Chakra UI's spacing scale:

- 1 = 0.25rem (4px)
- 2 = 0.5rem (8px)
- 3 = 0.75rem (12px)
- 4 = 1rem (16px)
- 5 = 1.25rem (20px)
- 6 = 1.5rem (24px)
- etc.

## Implementation Notes

These UI examples are provided as a reference and may need to be adapted based on specific requirements and data structures. Always ensure that:

1. Components are properly connected to state management
2. Form validation is implemented
3. Error handling is in place
4. Accessibility features are included
5. Responsive design is tested on various devices
