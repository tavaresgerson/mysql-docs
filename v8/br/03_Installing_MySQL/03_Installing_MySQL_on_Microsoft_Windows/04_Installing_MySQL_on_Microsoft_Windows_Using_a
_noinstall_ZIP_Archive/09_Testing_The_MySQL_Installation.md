#### 2.3.4.9 Testando a Instalação do MySQL

Você pode testar se o servidor MySQL está funcionando executando qualquer um dos seguintes comandos:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqlshow"
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqlshow" -u root mysql
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin" version status proc
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" test
```

Se o **mysqld** demorar a responder às conexões TCP/IP dos programas cliente, provavelmente há um problema com o seu DNS. Nesse caso, inicie o **mysqld** com a variável de sistema `skip_name_resolve` habilitada e use apenas `localhost` e endereços IP na coluna `Host` das tabelas de concessão MySQL. (Certifique-se de que existe uma conta que especifique um endereço IP, caso contrário, você pode não conseguir se conectar.)

Você pode forçar um cliente MySQL a usar uma conexão de canal nomeado em vez de TCP/IP, especificando a opção `--pipe` ou `--protocol=PIPE`, ou especificando `.` (ponto) como o nome do host. Use a opção `--socket` para especificar o nome do canal se você não quiser usar o nome padrão do canal.

Se você configurou uma senha para a conta `root`, excluiu a conta anônima ou criou uma nova conta de usuário, então para se conectar ao servidor MySQL, você deve usar as opções apropriadas `-u` e `-p` com os comandos mostrados anteriormente. Veja a Seção 6.2.4, “Conectando-se ao Servidor MySQL Usando Opções de Comando”.

Para obter mais informações sobre o **mysqlshow**, consulte a Seção 6.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.
