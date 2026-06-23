## 34.4 Conectar

Esta seção descreve os vários métodos de conexão para se conectar ao servidor MySQL implantado na Instância de Computação do OCI.

### Conectando com SSH

Esta seção fornece alguns detalhes sobre a conexão de uma plataforma semelhante ao UNIX para o OCI Compute. Para mais informações sobre a conexão com SSH, consulte [Acesse uma instância do Oracle Linux usando SSH][(https://docs.oracle.com/en/cloud/iaas/compute-iaas-cloud/stcsg/accessing-oracle-linux-instance-using-ssh.html#GUID-D947E2CC-0D4C-43F4-B2A9-A517037D6C11)] e [Conectar-se à sua instância][(https://docs.cloud.oracle.com/iaas/Content/GSG/Tasks/testingconnection.htm)].

Para se conectar ao Oracle Linux em execução na Instância de Computação com SSH, execute o seguinte comando:

```
ssh opc@computeIP
```

onde `opc` é o usuário do computador e *`computeIP`* é o endereço IP da sua Instância de Computação.

Para encontrar a senha de raiz temporária criada para o usuário de raiz, execute o seguinte comando:

```
sudo grep 'temporary password' /var/log/mysqld.log
```

Para alterar sua senha padrão, faça login no servidor usando a senha temporária gerada, usando o seguinte comando: `mysql -uroot -p`. Em seguida, execute o seguinte:

```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

### Conectando-se ao MySQL Client

Nota

Para se conectar a partir do seu cliente MySQL local, você deve primeiro criar um usuário no servidor MySQL que permita o login remoto.

Para se conectar ao servidor MySQL a partir do cliente MySQL local, execute o seguinte comando na sessão do shell:

```
mysql -uroot -p -hcomputeIP
```

onde *`computeIP`* é o endereço IP da sua Instância de Computação.

### Conectando-se ao MySQL Shell

Para se conectar ao servidor MySQL a partir do seu shell MySQL local, execute o seguinte comando para iniciar sua sessão de shell:

```
mysqlsh \connect root@computeIP
```

onde *`computeIP`* é o endereço IP da sua Instância de Computação.

Para mais informações sobre conexões do MySQL Shell, consulte Conexões do MySQL Shell.

### Conectando-se ao Workbench

Para se conectar ao servidor MySQL a partir do MySQL Workbench, consulte Conexões no MySQL Workbench.