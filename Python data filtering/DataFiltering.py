
# coding: utf-8

# In[321]:


#import some libraries
import matplotlib.pyplot as plt, pandas as pd, numpy as np, matplotlib as mpl
from __future__ import print_function


# In[322]:


#Cleaned data from SQL Velocity 
df = pd.read_csv('Cleaned_data.csv')

index = df.loc[df['time'].str.contains("2017-01-20")]


df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S.%f')

df.sort_values(by='time')

##index = df.loc[df['tag_id'] == 2]
df = df[df['qualityName_id'] != 3]
df = df[df['qualityName_id'] != 4]
df = df[df['qualityName_id'] != 2]

##print (df)
tagTable = []
for i in range(0,2005):
    tagTable.append(df.loc[df['tag_id'] == i])

df =tagTable[985]

##df = tagTable[985]

df = df.drop(['name','tag_id'],axis=1)


# In[ ]:






# In[345]:


#Assay data filtering with recovery calculation

df1 = pd.read_csv("FeedData/AssaysCSV.csv", low_memory = False)
df1 = df1.loc[(df1['Timestamp'] == '2017-01-20')]

df1['time '] = df1['time '].map(str) + " " +df1['Timestamp']
df1['time '] = pd.to_datetime(df1['time '], format='%H:%M:%S %Y-%m-%d' )

df1 = df1.set_index("time ")
df  = df.set_index("time", drop=False)
final = df1.reindex(df.index, method='nearest')

finalop = final.join(df)
result = finalop['qualityName_id']
finalop = finalop.drop(['Timestamp', 'time', 'qualityName_id'],axis=1)

finalop = finalop.join(result)
allAssay = finalop
allAssay.drop(['qualityName_id'],axis=1)

finalop = finalop[['ZRF Zn', 'ZRT Comb Pb', 'ZRCC Zn', 'value', 'qualityName_id']]

feed = finalop['ZRF Zn']
tail = finalop['ZRT Comb Pb']
concentration = finalop['ZRCC Zn']

Recovery =[]
for index, row in finalop.iterrows():
    concentration = float(row['ZRCC Zn'])
    tail = float(row['ZRT Comb Pb'])
    feed = float(row['ZRF Zn'])
    
    rec = (((concentration/feed) *(feed - tail))/ tail*(concentration - tail))
    Recovery.append(rec)
    
    ##print ("Data is :" + str(tail) + " "+ str(feed)+ " " + str(concentration))
finalop['Recocvery']= Recovery
##finalop['Recocvery'] = finalop['Recocvery'].replace([True,False], [1,0])

finalop.drop(['qualityName_id'],axis=1)
finalop = finalop[['ZRF Zn','ZRT Comb Pb','ZRCC Zn','value','Recocvery']]
##finalop

finalop.to_csv('AssayResult.csv',index=False)


# In[332]:


# Flows data filtering

from sklearn import preprocessing
flowData = pd.read_csv("FeedData/Flows.csv", low_memory = False)
flowData = flowData.loc[(flowData['Timestamp'] == '2017-01-20')]

flowData['time'] = flowData['time'].map(str) + " " +flowData['Timestamp']
flowData['time'] = pd.to_datetime(flowData['time'], format='%H:%M:%S %Y-%m-%d' )


df1

flowData = flowData.set_index("time")
df  = df.set_index("time", drop=False)
final = flowData.reindex(df.index, method='bfill')

finalop = final.join(df)
finalop = finalop.drop(['time','qualityName_id', 'Timestamp'],axis=1)
finalop
finalop.to_csv('FlowResult.csv',index=False)


# In[335]:


## Pupmps data Filtering 

from sklearn import preprocessing
pumpsData = pd.read_csv("FeedData/Pumps.csv", low_memory = False)
pumpsData = pumpsData.loc[(pumpsData['Timestamp'] == '2017-01-20')]

pumpsData['time'] = pumpsData['time'].map(str) + " " +pumpsData['Timestamp']
pumpsData['time'] = pd.to_datetime(pumpsData['time'], format='%H:%M:%S %Y-%m-%d' )

pumpsData = pumpsData.set_index("time")
df  = df.set_index("time", drop=False)
final = pumpsData.reindex(df.index, method='bfill')

finalop = final.join(df)
finalop = finalop.drop(['time','qualityName_id', 'Timestamp'],axis=1)

finalop = finalop[['Z1RC 01 Output', 'Z1RC 02 Output', 'Z2RC 01 Output','Z2RC 02 Output', 'value' ]]
##finalop.to_csv('PumpResult.csv',index=False)
finalop


# In[336]:


## Reagents data Filtering 

from sklearn import preprocessing
reagentsData = pd.read_csv("FeedData/Reagents.csv", low_memory = False)
reagentsData = reagentsData.loc[(reagentsData['Timestamp'] == '2017-01-20')]

reagentsData['time'] = reagentsData['time'].map(str) + " " +reagentsData['Timestamp']
reagentsData['time'] = pd.to_datetime(reagentsData['time'], format='%H:%M:%S %Y-%m-%d' )

reagentsData = reagentsData.set_index("time")
df  = df.set_index("time", drop=False)

##final = pumpsData.reindex(df.index, method='bfill')

##finalop.to_csv('ReagentsResult.csv',index=False)


# In[ ]:


from sklearn import linear_model

from sklearn import tree

regr = linear_model.LinearRegression()



plt.figure(figsize=(25,15))

import matplotlib.pyplot as plt
plt.plot(finalop['value'])
plt.axis(['01-20-',xmax])
plt.show()


