
# II3160 Teknologi Sistem Terintegrasi - UCanteen

Repository ini berisi program implementasi Application Programing Interface (API) dari salah satu layanan UCanteen (University Canteen). UCanteen adalah sebuah platform inovatif yang bertujuan untuk menghubungkan mahasiswa dengan kedai makanan di sekitar kampus secara digital.

Layanan yang diimplementasikan merupakan core dari bisnis di mana sistem dapat menampilkan kantin atau restoran yang terletak di dalma radius 500 meter dari lokasi sebuah kampus. Selain itu, dapat ditampulkan juga menu makanan yang tersedia di setiap kantin atau restoran di sekitar kampus.

Pada program ini, terdapat 3 data yang terlibat, yakni data restoran, menu, dan user. Data tersebut diambil dari Microsoft Azure for MySQL Database yang diintegrasikan ke dalam program.


## Prequisites

Untuk menjalankan program, terdapat beberapa hal yang perlu di-install terlebih dahulu, antara lain:

#### 1. Library FastAPI

```bash
  pip install fastapi
```
#### 2. Library uvicorn

```bash
  pip install uvicorn
```
#### 3. Library SQLalchemy

```bash
  pip install SQLalchemy
```
#### 4. Library pydantic[Email]

```bash
  pip install pydantic[Email]
```
#### 5. Library pydantic-settings

```bash
  pip install pydantic-settings
```
#### 6. Library pymysql

```bash
  pip install pymysql
```
#### 7. Python Virtual Environment

```bash
  pip install virtualenv
```
##
## How to Use It

Berikut beberapa langkah yang perlu dilakukan untuk mendeploy dan menjalankan program:

#### 1. Aktivasi Python Virtual Environment

```bash
  ecanteen_venv/Scripts/activate
```
#### 2. Run Uvicorn

```bash
  uvicorn main:app --reload
```
#### 3. Build Docker Image

```bash
  docker image build --tag demo-app-image .
```
#### 4. Run Docker Container

```bash
  docker container run --publish 8000:8000 --name demo-app-container demo-app-image
```
#### 5. Container Registry in Azure
Buatlah **Container Registry** baru di Azure menggunakan nama "ucanteen" dan jalankan programnya dengan terminal
```bash
docker login ucanteen.azurecr.io/fredrick:latest
```

#### 6. Build and Push Docker Image in Azure
```bash
docker build -t ucanteen.azurecr.io/ucanteen:latest .
docker push ucanteen.azurecr.io/ucanteen:latest
```

#### 7. Container Instance in Azure
Buatlah **Container Instance** baru di Azure, di mana nama kontainer nya adalah "ucanteen" . Setelah itu, kamu akna medapatkan **FQDN URL** milikmu ketika selesai deploy

## 
## Use This Link

Gunakan URL di bawah untuk menjalankan API UCanteen yang teritegrasi dengan Microsoft Azure.
```bash
http://ucanteendns.d2bygdayf7dreygx.southeastasia.azurecontainer.io/docs
```
## Authors

- [@fredrick03](https://www.github.com/fredrick03)

