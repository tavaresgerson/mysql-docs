## 34.4 Conectando

Esta seção descreve os vários métodos de conexão para se conectar ao servidor MySQL implantado na Instância de Computação do OCI.

### Conectando com SSH

Esta seção fornece alguns detalhes sobre como se conectar a partir de uma plataforma semelhante ao UNIX para o OCI Compute. Para mais informações sobre como se conectar com SSH, consulte [Acesse uma Instância do Oracle Linux Usando SSH](https://docs.oracle.com/en/cloud/iaas/compute-iaas-cloud/stcsg/accessing-oracle-linux-instance-using-ssh.html#GUID-D947E2CC-0D4C-43F4-B2A9-A517037D6C11) e [Conectando-se à Sua Instância](https://docs.cloud.oracle.com/iaas/Content/GSG/Tasks/testingconnection.htm).

Para se conectar ao Oracle Linux em execução na Instância de Computação com SSH, execute o seguinte comando:

```
ssh opc@computeIP
```

onde `opc` é o usuário de computação e *`computeIP`* é o endereço IP da sua Instância de Computação.

Para encontrar a senha temporária de root criada para o usuário root, execute o seguinte comando:

```
sudo grep 'temporary password' /var/log/mysqld.log
```

Para alterar sua senha padrão, faça login no servidor usando a senha temporária gerada, usando o seguinte comando: `mysql -uroot -p`. Em seguida, execute o seguinte:

```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

### Conectando com o Cliente MySQL

Observação

Para se conectar a partir do seu cliente MySQL local, você deve primeiro criar no servidor MySQL um usuário que permita o login remoto.

Para se conectar ao servidor MySQL a partir do seu cliente MySQL local, execute o seguinte comando em sua sessão de shell:

```
mysql -uroot -p -hcomputeIP
```

onde *`computeIP`* é o endereço IP da sua Instância de Computação.

### Conectando com o Shell MySQL

Para se conectar ao servidor MySQL a partir do seu Shell MySQL local, execute o seguinte comando para iniciar sua sessão de shell:

```
mysqlsh root@computeIP
```

onde *`computeIP`* é o endereço IP da sua Instância de Computação.

Para mais informações sobre conexões com o Shell MySQL, consulte Conexões com o Shell MySQL.

### Conectando-se ao Workbench

Para se conectar ao servidor MySQL a partir do MySQL Workbench, consulte Conexões no MySQL Workbench.