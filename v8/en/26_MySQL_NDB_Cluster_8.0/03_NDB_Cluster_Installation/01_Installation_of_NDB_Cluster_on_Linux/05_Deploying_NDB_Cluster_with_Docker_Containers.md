#### 25.3.1.5 Deploying NDB Cluster with Docker Containers

##### Downloading a MySQL NDB Cluster Docker Image

Downloading the Docker image in a separate step is not strictly necessary; however, performing this step before you create your Docker containers ensures your local image is up to date. To download the MySQL NDB Cluster Community Edition image from the Oracle Container Registry (OCR), run this command:

```
docker pull container-registry.oracle.com/mysql/community-cluster:tag
```

The *`tag`* is the label for the image version you want to pull (for example, `7.5`, `7.6`, `8.0`, or `latest`). If **`:tag`** is omitted, the `latest` label is used, and the image for the latest GA version of MySQL NDB Cluster is downloaded.

You can list downloaded Docker images with this command:

```
$> docker images
REPOSITORY                                              TAG       IMAGE ID       CREATED        SIZE
container-registry.oracle.com/mysql/community-cluster   8.0       d1b28e457ac5   5 weeks ago    636MB
```

To download the MySQL Commercial Cluster image from the OCR, you need to first accept the license agreement . Follow these steps:

* Visit the OCR at <https://container-registry.oracle.com/> and choose MySQL.

* Under the list of MySQL repositories, choose `commercial-cluster`.

* If you have not signed in to the OCR yet, click the Sign in button on the right of the page, and then enter your Oracle account credentials when prompted to.

* Follow the instructions on the right of the page to accept the license agreement.

Download the Docker image for MySQL Commercial Cluster from the OCR with this command:

```
docker pull  container-registry.oracle.com/mysql/commercial-cluster:tag
```

##### Starting a MySQL Cluster Using Default Configuration

First, create an internal Docker network named `cluster` for the containers to communicate with each other:

```
docker network create cluster --subnet=192.168.0.0/16
```

Then, start the management node:

```
docker run -d --net=cluster --name=management1 --ip=192.168.0.2 container-registry.oracle.com/mysql/community-cluster ndb_mgmd
```

Next, start the two data nodes

```
docker run -d --net=cluster --name=ndb1 --ip=192.168.0.3 container-registry.oracle.com/mysql/community-cluster ndbd
```

```
docker run -d --net=cluster --name=ndb2 --ip=192.168.0.4 container-registry.oracle.com/mysql/community-cluster ndbd
```

Finally, start the MySQL server node:

```
docker run -d --net=cluster --name=mysql1 --ip=192.168.0.10 -e MYSQL_RANDOM_ROOT_PASSWORD=true container-registry.oracle.com/mysql/community-cluster mysqld
```

The server is then initialized with a randomized password, which needs to be changed. Fetch the password from the log:

```
docker logs mysql1 2>&1 | grep PASSWORD
```

If no password is returned by the command, the server has not finished initializing yet. Wait a while and try again. Once you get the password, change it by logging into the server with the `mysql` client:

```
docker exec -it mysql1 mysql -uroot -p
```

Once you are on the server, change the root password with the following statement:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Finally, start a container with an interactive management client **ndb_mgm** to monitor the cluster:

```
$> docker run -it --net=cluster container-registry.oracle.com/mysql/community-cluster ndb_mgm
[Entrypoint] MySQL Docker Image 8.0.43-1.2.10-cluster
[Entrypoint] Starting ndb_mgm
-- NDB Cluster -- Management Client --
```

Run the `SHOW` command to print the cluster's status. You should see the following:

```
ndb_mgm> SHOW
Connected to Management Server at: 192.168.0.2:1186
Cluster Configuration
---------------------
[ndbd(NDB)]	2 node(s)
id=2	@192.168.0.3  (mysql-8.0.43-ndb-8.0.43, Nodegroup: 0, *)
id=3	@192.168.0.4  (mysql-8.0.43-ndb-8.0.43, Nodegroup: 0)

[ndb_mgmd(MGM)]	1 node(s)
id=1	@192.168.0.2  (mysql-8.0.43-ndb-8.0.43)

[mysqld(API)]	1 node(s)
id=4	@192.168.0.10  (mysql-8.0.43-ndb-8.0.43)
```

##### Customizing MySQL Cluster

The default MySQL NDB Cluster image includes two configuration files, which are also available in the GitHub repository for MySQL NDB Cluster

* `/etc/my.cnf`
* `/etc/mysql-cluster.cnf`

To change the cluster (for instance, adding more nodes or changing the network setup), these files must be updated. For more information, see Section 25.4.3, “NDB Cluster Configuration Files”. To use custom configuration files when starting the container, use the `-v` flag to load external files. For example (enter the whole command on the same line):

```
$> docker run -d --net=cluster --name=management1 \
      --ip=192.168.0.2 -v /etc/my.cnf:/etc/my.cnf -v \
      /etc/mysql-cluster.cnf:/etc/mysql-cluster.cnf \
      container-registry.oracle.com/mysql/community-cluster ndb_mgmd
```
