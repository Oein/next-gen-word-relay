# list file in current directory
def list_files():
    import os
    files = []
    for file in os.listdir('.'):
        if os.path.isfile(file):
            if file.endswith('.csv'):
                files.append(file)
    return files

files = list_files()

# read csv file
def read_csv(file):
    print('Reading file:', file)
    with open(file, 'r', encoding="cp1252") as f:
        fsplit = f.read().split('\n')
        f_filter = [line.strip() for line in fsplit if line != '' and line.strip().find(' ') == -1 and line.find(',') == -1 and line.find('-') == -1 and line.strip() != "#NAME?"]
        f_unique = list(set(f_filter))
        print("Total words in file:", len(f_unique))
        return [[li, []] for li in f_unique]

words = []
for file in files:
    words += read_csv(file)

print('Total words:', len(words))

# write to file
import json
with open('words.json', 'w') as f:
    f.write(json.dumps(words))