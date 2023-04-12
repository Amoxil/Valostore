import aiohttp, json, requests
from fastapi import FastAPI
import os, sys
import asyncio
from riot_auth import RiotAuth, auth_exceptions

async def Auth(username, password):

  build = requests.get('https://valorant-api.com/v1/version').json()['data']['riotClientBuild']
  print('Valorant Build '+build)

  RiotAuth.RIOT_CLIENT_USER_AGENT = build + '%s (Windows;10;;Professional, x64)'

  if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

  CREDS = username, password

  auth = RiotAuth()
  try: await auth.authorize(*CREDS)

  except auth_exceptions.RiotAuthenticationError:
    raise auth_exceptions.RiotAuthenticationError

  except auth_exceptions.RiotMultifactorError:
    raise auth_exceptions.RiotAuthenticationError
    
  return auth
	
async def store(username, password, region):

  auth = await Auth(username, password)

  token_type = auth.token_type
  access_token = auth.access_token
  entitlements_token = auth.entitlements_token
  user_id = auth.user_id

  conn = aiohttp.TCPConnector()
  session = aiohttp.ClientSession(connector=conn)

  headers = {
   'X-Riot-Entitlements-JWT' : entitlements_token,
   'Authorization': 'Bearer '+ access_token,
  }

  async with session.get('https://pd.'+region+'.a.pvp.net/store/v1/offers/', headers=headers) as r:
    pricedata = await r.json()
  
  async with session.get('https://pd.'+region+'.a.pvp.net/store/v1/wallet/'+ user_id, headers=headers) as r:
    walletdata = await r.json()
  
  print(walletdata)
  
  async with session.get('https://pd.'+ region +'.a.pvp.net/store/v2/storefront/'+ user_id, headers=headers) as r:
    data = json.loads(await r.text())
  allstore = data.get('SkinsPanelLayout')
  singleitems = allstore["SingleItemOffers"]

  skins=[]

  for skinUuid in singleitems:
    async with session.get('https://valorant-api.com/v1/weapons/skinlevels/'+ skinUuid) as r:
      skinData = json.loads(await r.text())['data']
      for item in pricedata['Offers']:
        if item["OfferID"] == skinUuid:
          skinData["price"] = str(item['Cost']['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']) + ' RP'
      
      print(skinData)
      skins.append(skinData)
  
  await session.close()
  return skins
 