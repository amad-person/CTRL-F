import cv2
import os
import sys
import math
from PIL import Image
import pytesseract
import enchant
import json

filename = sys.argv[1]
cap = cv2.VideoCapture(filename)
frameRate = cap.get(5)
frameRate = frameRate * 10

timeTextMappings = dict()

while(cap.isOpened()):
    frameId = cap.get(1) #current frame number
    ret, frame = cap.read()
    if (ret != True):
        break

    if (frameId % math.floor(frameRate) == 0):

        # Convert to black and white
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Get text from image
        text = pytesseract.image_to_string(frame)
        text = text.replace('\n', ' ')
        text = text.lower()
        
        # Update the mapping
        timeTextMappings[cap.get(0)] = text

cap.release()

wordTimeMappings = dict()

for time, text in timeTextMappings.items():
    splitText = text.split(' ')
    for word in splitText:
        word = word.encode('ascii', 'ignore')

        if word == '':
            continue

        if word.isspace():
            continue
        
        if word not in wordTimeMappings:
            wordTimeMappings[word] = list()
        
        wordTimeMappings[word].append(time)


results = dict()
results['wordTimeMappings'] = wordTimeMappings
results['timeTextMappings'] = timeTextMappings

with open('data.json', 'w') as outfile:
    json.dump(results, outfile)
