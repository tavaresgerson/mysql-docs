## 34.4 Conectar

Esta seção descreve os vários métodos de conexão para se conectar ao servidor MySQL implantado na Instância de Computação do OCI.

### Conectar com SSH

Esta seção fornece alguns detalhes sobre a conexão de uma plataforma semelhante ao UNIX para o OCI Compute. Para mais informações sobre a conexão com SSH, consulte Acessar uma Instância do Oracle Linux Usando SSH e Conectar-se à Sua Instância.

Para se conectar ao Oracle Linux em execução na Instância de Computação com SSH, execute o seguinte comando:

```
ssh opc@computeIP
```

onde `opc` é o usuário de computação e `computeIP` é o endereço IP da sua Instância de Computação.

Para encontrar a senha de raiz temporária criada para o usuário root, execute o seguinte comando:

```
sudo grep 'temporary password' /var/log/mysqld.log
```

Para alterar sua senha padrão, faça login no servidor usando a senha temporária gerada, usando o seguinte comando: `mysql -uroot -p`. Em seguida, execute o seguinte:

```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

### Conectar com o cliente MySQL

Nota

Para se conectar a partir do seu cliente MySQL local, você deve primeiro criar um usuário no servidor MySQL que permita o login remoto.

Para se conectar ao servidor MySQL a partir do cliente MySQL local, execute o seguinte comando na sessão do seu shell:

```
mysql -uroot -p -hcomputeIP
```

onde `computeIP` é o endereço IP da sua Instância de Computação.

### Conectar com o MySQL Shell

Para se conectar ao servidor MySQL a partir do seu shell MySQL local, execute o seguinte comando para iniciar sua sessão no shell:

```
mysqlsh \connect root@computeIP
```

onde `computeIP` é o endereço IP da sua Instância de Computação.

Para obter mais informações sobre conexões do MySQL Shell, consulte Conexões do MySQL Shell.

### Conectar-se ao Workbench

Para se conectar ao servidor MySQL a partir do MySQL Workbench, consulte Conexões no MySQL Workbench.
