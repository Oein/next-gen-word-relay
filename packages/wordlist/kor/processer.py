import sys
import re

def isHangul(text):
    rep = re.compile("[가-힣]")
    # test is all string is hangul
    match = rep.findall(text)
    grps = len(match)
    if grps == 0:
        return False
    if grps == len(text):
        return True
    return False

def process_file(filepath: str):
    with open(filepath, 'r') as f:
        fsplit = f.read().split('\n')
        return fsplit
        
def process_data(fsplit: list[str]):
    fmap = list(map(lambda x: x.strip().split(","), fsplit))
    ffilter = [line for line in fmap if isHangul(line[0]) and len(line[1]) > 0]
    fwords = []
    ftype = {}
    i = 0
    for line in ffilter:
        i += 1
        if i % 1000 == 0:
            print(i, "out of", len(ffilter))
        if line[0] not in ftype:
            ftype[line[0].strip()] = [line[1]]
            fwords.append(line[0].strip())
        else:
            ftype[line[0].strip()].append(line[1])
    ret = []
    i = 0
    for word in fwords:
        i += 1
        if i % 1000 == 0:
            print(i, "out of", len(fwords))
        ret.append([word, list(set(ftype[word]))])
    return ret
        
res_kr = process_file("./kr_korean.csv")
res_kp = process_file("./kp_korean.csv")

res_kr += res_kp
processed = process_data(res_kr)

import json
with open('words.json', 'w') as f:
    f.write(json.dumps(processed, ensure_ascii=False))