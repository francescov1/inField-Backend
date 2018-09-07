import sys

def mult(arr):
    for i, x in enumerate(arr):
        arr[i] = int(x)*2
    return arr

args = sys.argv[1:]
b = mult(args)
print(b)
sys.stdout.flush()
