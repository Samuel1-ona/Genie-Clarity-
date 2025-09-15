import styles from '../styles/Home.module.css';
import { WalletConnectButton } from '../components/wallet-connect-button';
import { UserCard } from '../components/user-card';
import { getDehydratedStateFromSession } from '../common/session-helpers';

import type { NextPage, GetServerSidePropsContext } from 'next';

import {
  stringUtf8CV,
  standardPrincipalCV,
} from 'micro-stacks/clarity';

import {
  FungibleConditionCode, makeStandardSTXPostCondition, callReadOnlyFunction 
} from 'micro-stacks/transactions'

import React, { useState, SetStateAction , useCallback, useEffect} from 'react'
import {useOpenContractCall, useAccount} from '@micro-stacks/react'
import {useAuth} from '@micro-stacks/react'
import {StacksTestnet} from 'micro-stacks/network'
import useInterval from "@use-it/interval"


const Home: NextPage = () => {

  const{openContractCall, isRequestPending} = useOpenContractCall()
  const {stxAddress}  = useAccount()
  const [response, setResponse] = useState(null);
  const  {openAuthRequest,  signOut, isSignedIn} = useAuth()
  const [post, setPost] = useState('');
  const [postedMessage, setPostedMessage] = useState("none");
  const [contractAddress, setContractAddress] = useState("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");


  // user input handler 

  const handleMessageChange = (e: {target:{value:SetStateAction<string>;};}) => {
    setPost(e.target.value);
  }

  //handle contract call to write post
  const handleOpenContractCall =  async () => {
    const functionArgs = [stringUtf8CV(post)];

    const postConditions = [
      makeStandardSTXPostCondition(stxAddress!, FungibleConditionCode.LessEqual, 1000000)
    ]
     
    await openContractCall({
      contractAddress: contractAddress,
      contractName: "genie",
      functionName: "create-post",
      functionArgs: functionArgs,
      postConditions: postConditions,
      onFinish: async data => {
        console.log('finished contract call', data);
        setResponse(data);
      },
      onCancel: () => {
        console.log('cancelled contract call');
      },
    });
  };

  // handles contract calls for editing post 
  const handleOpenContractCallEdit = async () => {
     
    const functionArgs = [standardPrincipalCV(stxAddress!), stringUtf8CV(post)];
    
    await openContractCall({
      contractAddress: contractAddress,
      contractName: "genie",
      functionName: "edit-post",
      functionArgs: functionArgs,
      onFinish: async data => {
        console.log('finished contract call', data);
        setResponse(data);
      },
      onCancel: () => {
        console.log('cancelled contract call');
      },
    });
  };

  // handles contract calls for deleting post

  const handleOpenContractCallDelete = async () => {
    const functionArgs = [standardPrincipalCV(stxAddress!)];
    await openContractCall({
      contractAddress: contractAddress,
      contractName: "genie",
      functionName: "delete-post",
      functionArgs: functionArgs,
      onFinish: async data => {
        console.log('finished contract call', data);
        setResponse(data);
      },
      onCancel: () => {
        console.log('cancelled contract call');
      },
    });
  };

   
  //handle read only function to get total posts
  const getPost = useCallback(async () => {
    if (isSignedIn) {
      // arg of the function 

      const functionArgs = [
        standardPrincipalCV(`${stxAddress!}`)
      ];
      // network param for callReadOnly 
      const network = new StacksTestnet({
        url: 'http://localhost:20443',
      });
      // read only function call 
      const result = await callReadOnlyFunction({
        contractAddress: contractAddress,
        contractName: "genie",
        functionName: "get-post",
        functionArgs: functionArgs,
        network: network,
      });
      
       console.log('result', result);
        if (result && typeof result === 'object' && 'data' in result) {
         setPostedMessage(result.data);
        }
      }
    }, []);

    useEffect(() => {
      getPost();
    }, [isSignedIn]);

     useEffect(() => {
       const interval = setInterval(() => {
         getPost();
       }, 1000);
       return () => clearInterval(interval);
     }, [getPost]);

    return (
      <>
      <div className = "flex flex-row gap-12 items-center justify-center py-4">
          <UserCard />
          <WalletConnectButton />
      </div>
      <div className = "flex flex-col  items-center justify-center py-4 min-h-screen">
        {
          isSignedIn && 
          <form 
          className="flex flex-col items-center justify-center text-2xl"
          onSubmit =  {() => handleOpenContractCall()}>
            <p>
              Post &nbsp;
               <input
               className= "bg-white text-block placeholder:text-slate-500"
               type="text"
               value={post}
               onChange={handleMessageChange}
               placeholder="Enter your post"
               />
               &nbsp; for 1 STX
            </p>
             <button
             type="submit"
             className="px-10 py-4 bg-white text-black mt rounded "
             >
               {isRequestPending ? 'Loading...' : 'Create Post'}
             </button>
             <button
             type="button"
             onClick={handleOpenContractCallEdit}
             className="px-10 py-4 bg-blue-500 text-white mt-4 rounded"
             >
               {isRequestPending ? 'Loading...' : 'Edit Post'}
             </button>
             <button
             type="button"
             onClick={handleOpenContractCallDelete}
             className="px-10 py-4 bg-red-500 text-white mt-4 rounded"
             >
               {isRequestPending ? 'Loading...' : 'Delete Post'}
             </button>
            <div className="mt-28">
              {
                postedMessage !== "none" ? (
                  <p>You posted &quot;{postedMessage}&quot;</p>
                ) : (
                  <p>You haven't posted anything yet</p>
                )
              }
            </div>
            </form>
              


         }
       </div>
       </>
     );
  };



export default Home;
