## 34.4 Conexão

Esta seção descreve os vários métodos de conexão para se conectar ao servidor MySQL implantado na Instância de Computação OCI.

### Conexão com SSH

Esta seção fornece detalhes sobre como se conectar a partir de uma plataforma semelhante ao UNIX para a Computação OCI. Para obter mais informações sobre como se conectar com SSH, consulte  Acesse uma Instância Oracle Linux usando SSH e  Conexão à sua Instância.

Para se conectar ao Oracle Linux em execução na Instância de Computação com SSH, execute o seguinte comando:

```
ssh opc@computeIP
```

onde `opc` é o usuário de computação e *`computeIP`* é o endereço IP da sua Instância de Computação.

Para encontrar a senha root temporária criada para o usuário root, execute o seguinte comando:

```
sudo grep 'temporary password' /var/log/mysqld.log
```

Para alterar sua senha padrão, faça login no servidor usando a senha temporária gerada, usando o seguinte comando: `mysql -uroot -p`. Em seguida, execute o seguinte:

```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

### Conexão com o Cliente MySQL

::: info Nota

Para se conectar a partir do seu cliente MySQL local, você deve primeiro criar no servidor MySQL um usuário que permita o login remoto.


:::

Para se conectar ao Servidor MySQL a partir do seu cliente MySQL local, execute o seguinte comando na sua sessão de shell:

```
mysql -uroot -p -hcomputeIP
```

onde *`computeIP`* é o endereço IP da sua Instância de Computação.

### Conexão com o Shell MySQL

Para se conectar ao Servidor MySQL a partir do seu Shell MySQL local, execute o seguinte comando para iniciar sua sessão de shell:

```
mysqlsh root@computeIP
```

onde *`computeIP`* é o endereço IP da sua Instância de Computação.

Para obter mais informações sobre conexões com o Shell MySQL, consulte  Conexões com o Shell MySQL.

### Conexão com o Workbench

Para se conectar ao Servidor MySQL a partir do MySQL Workbench, consulte  Conexões no MySQL Workbench.