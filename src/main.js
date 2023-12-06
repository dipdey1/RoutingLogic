import { Account, Client, Databases, Query, Storage } from 'node-appwrite';

const PROJECT_ID = process.env.PROJECT_IDOJ;
const DATABASE_ID = process.env.DATABASE_ID
const USERDOUBTS_COLLECTION_ID = process.env.DATABASE_ID
const DOUBT_STORAGE_BUCKET_ID = process.env.DOUBT_STORAGE_BUCKET_ID
const USERTABLE_ID = process.env.USERTABLE_ID
const API_AUTH_KEY = process.env.API_AUTH_KEY
const PROJECT_ID_DEX = process.env.PROJECT_ID_DEX
const DATABASE_ID_DEX = process.env.DATABASE_ID_DEX
const ACTIVE_DEX_COLLECTION_ID = process.env.ACTIVE_DEX_COLLECTION_ID

const client = new Client();
const databases = new Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const client2 = new Client();
const databases_2 = new Databases(client2);
    
  client2
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(PROJECT_ID_DEX);
    

export default async ({ req, res, log, error }) => {
 
  if (req.method === 'POST') {
    let response = JSON.parse(req.body)
    log(response)
    const subjectField = response.subject
    log(subjectField)
    try {
      let responsePool = await databases_2.listDocuments(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,[Query.equal('dexSpeciality',subjectField),Query.orderDesc('score')])
            log(responsePool)
            const totalpool = responsePool.documents.filter(item => item.onboardingStatus === true && item.onlineStatus === true && item.solvingStatus === false && item.routingStatus === true && item.currentRoutingStatus === false).map(obj => obj.$id)
            const poolLength = Math.floor((totalpool.length)/3)+1
            const poolOne = totalpool.slice(0,poolLength)
            log(poolOne)
        let payload = {
            currentRoutingStatus: true,
            doubtID: response.$id
        }
        for(let i=0; i<poolOne.length; i++){
            await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,poolOne[i],payload)
        }
        let flag = false;
        setTimeout( async function() {
            if(!flag){
                try {
                    let secondresponse = await databases.getDocument(DATABASE_ID,USERDOUBTS_COLLECTION_ID,response.$id)
                    if(secondresponse.status === 'ongoing'){
                    let deleteRouting = {
                        currentRoutingStatus: false,
                        doubtID: null
                    }
                    for(let i=0; i<poolOne.length; i++){
                        let activePromise2 = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,poolOne[i],deleteRouting)
                    } 
                        let responsePool = await databases_2.listDocuments(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,[Query.equal('dexSpeciality',subjectField),Query.orderDesc('score')])
                        const totalPoolTwoPool = responsePool.documents.filter(item => item.onboardingStatus === true && item.onlineStatus === true && item.solvingStatus === false && item.routingStatus === true && item.currentRoutingStatus === false).map(obj => obj.$id)
                        const totalPoolTwo = totalPoolTwoPool.filter(item => !poolOne.includes(item))
                        const poolLength = Math.floor((totalPoolTwoPool.length)/3) + 1
                        const poolTwo = totalPoolTwo.slice(0,poolLength)
                        log(poolTwo)
                        let payload = {
                            currentRoutingStatus: true,
                            doubtID: response.$id
                            }
                            for(let i=0; i<poolTwo.length; i++){
                            let activePromise = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,poolTwo[i],payload)
                            }
                            let flag = false;
                            setTimeout(async function() {
                            if(!flag){
                                try {
                                    let secondresponse = await databases.getDocument(DATABASE_ID,USERDOUBTS_COLLECTION_ID,response.$id)
                                    if(secondresponse.status === 'ongoing'){
                                    let deleteRouting = {
                                        currentRoutingStatus: false,
                                        doubtID: null
                                    }
                                    for(let i=0; i<poolTwo.length; i++){
                                        let activePromise = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,poolTwo[i],deleteRouting)
                                    }
                                        
                                        let responsePool = await databases_2.listDocuments(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,[Query.equal('dexSpeciality',subjectField),Query.orderDesc('score')])
                                        const exclusionPool = poolOne.concat(poolTwo)
                                        const totalPoolThree = responsePool.documents.filter(item => item.onboardingStatus === true && item.onlineStatus === true && item.solvingStatus === false && item.routingStatus === true && item.currentRoutingStatus === false).map(obj => obj.$id).filter(item => !exclusionPool.includes(item))
                                        log(totalPoolThree)
                                        let payload = { 
                                            currentRoutingStatus: true,
                                            doubtID: response.$id
                                            }
                                            for(let i=0; i<totalPoolThree.length; i++){
                                            let activePromise = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,totalPoolThree[i],payload)
                                            
                                            }
                                            let flag = false;
                                            setTimeout(async function() {
                                            if(!flag){
                                                try {
                                                    let secondresponse = await databases.getDocument(DATABASE_ID,USERDOUBTS_COLLECTION_ID,response.$id)
                                                    if(secondresponse.status === 'ongoing'){
                                                    let deleteID = {
                                                        currentRoutingStatus: false,
                                                        doubtID: null
                                                    }
                                                    for(let i=0; i<totalPoolThree.length; i++){
                                                        let activePromise = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,totalPoolThree[i],deleteID)
                                                    }
                                                    let finalresponse = await databases.updateDocument(DATABASE_ID,USERDOUBTS_COLLECTION_ID,response.$id, {status: 'Retry'})
                                                    }else if(secondresponse.status === 'accepted'){
                                                        for(let i=0; i<totalPoolThree.length; i++){
                                                            let activePromise = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,totalPoolThree[i],deleteRouting)
                                                        }
                                                    }
                                                    } catch (error) {
                                                      
                                                    }
                                            }else{
                                                flag=true
                                            }
                                            },30000)
                                    }else if(secondresponse.status === 'accepted'){
                                        for(let i=0; i<poolTwo.length; i++){
                                            let activePromise = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,poolTwo[i],deleteRouting)
                                        }
                                    }
                                    } catch (error) {
                                      
                                    }
                            }else{
                                flag=true
                            }
                            },30000)
                    }else if(secondresponse.status === 'accepted'){
                        let deleteRouting = {
                            currentRoutingStatus: false,
                            doubtID: null
                        }
                        for(let i=0; i<poolOne.length; i++){
                            let activePromise = await databases_2.updateDocument(DATABASE_ID_DEX,ACTIVE_DEX_COLLECTION_ID,poolOne[i],deleteRouting)
                        }
                    }
                    } catch (error) {
                      
                    }
            }else{
                flag=true
            }
        },30000)
    } catch (error) {
      
    }
  }

  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build Fast. Scale Big. All in One Place.',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
