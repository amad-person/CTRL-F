import cv2
import os
import sys
import math
from PIL import Image
import pytesseract
import enchant
import json

def filterText(text, d):
    splitText = text.split(' ')
    filtered = ''
    for word in splitText:
        word = word.encode('ascii', 'ignore')
        if not word:
            continue

        if word.isspace():
            continue

        if d.check(word):
            filtered = filtered + ' ' + word
    return filtered


# onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
filename = sys.argv[1]
file = open('results', 'w')
cap = cv2.VideoCapture(filename)
frameRate = cap.get(5)
timeWordMappings = dict()
d = enchant.Dict("en_US")

while(cap.isOpened()):
    frameId = cap.get(1) #current frame number
    ret, frame = cap.read()
    if (ret != True):
        break
    if (frameId % math.floor(frameRate) == 0):
        # ret, frame = cv2.threshold(frame, 120, 255, cv2.THRESH_BINARY)
        # print(cap.get(0))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # frame = cv2.medianBlur(frame, 3)
        text = pytesseract.image_to_string(frame)
        # text = filterText(text, d)
        timeWordMappings[cap.get(0)] = text
        # print(str(cap.get(0)) + ':' + text)
        # cv2.imwrite(filename, frame)
cap.release()
file.close()
print "Done!"
print('Return value from python script')