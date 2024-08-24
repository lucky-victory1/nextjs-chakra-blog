

import { Box, GridItem, HStack } from '@chakra-ui/react'
import {Skeleton,SkeletonCircle,SkeletonText} from './ui/Skeleton'
export function PostCardLoader(){
    return (
           <GridItem rounded={'24'} overflow={'hidden'} borderWidth={1} borderColor={'gray.300'}>
            <Skeleton height="200px" />
            <Box p={4}>

            <HStack>

              <SkeletonCircle size="10" /> 
<SkeletonText w={24}  noOfLines={1} rounded={'full'}/>
            </HStack>
            <SkeletonText my={3} w={120} noOfLines={1}  rounded={'full'}/>
<SkeletonText mt="4" noOfLines={4} spacing="3"  rounded={'full'}/>
            </Box>
            
          </GridItem>
    )
}