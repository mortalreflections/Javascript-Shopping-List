import requests

url="http://127.0.0.1:5000/1/add_todo"

r=requests.post(url,json={"todo":"buy groceris"})

print(r.text)