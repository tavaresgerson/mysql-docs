#### 9.4.5.5 Usando mysqldump para testar incompatibilidades de atualização

Ao considerar uma atualização do MySQL, é prudente instalar a versão mais recente separadamente da sua versão atual de produção. Em seguida, você pode fazer o dump do banco de dados e das definições dos objetos do banco de dados do servidor de produção e carregá-los no novo servidor para verificar se eles são tratados corretamente. (Isso também é útil para testar downgrades.)

No servidor de produção:

```
$> mysqldump --all-databases --no-data --routines --events > dump-defs.sql
```

No servidor atualizado:

```
$> mysql < dump-defs.sql
```

Como o arquivo de dump não contém dados da tabela, ele pode ser processado rapidamente. Isso permite que você identifique potenciais incompatibilidades sem esperar por operações de carregamento de dados demoradas. Procure por avisos ou erros enquanto o arquivo de dump está sendo processado.

Depois de verificar que as definições são tratadas corretamente, faça o dump dos dados e tente carregá-los no servidor atualizado.

No servidor de produção:

```
$> mysqldump --all-databases --no-create-info > dump-data.sql
```

No servidor atualizado:

```
$> mysql < dump-data.sql
```

Agora, verifique o conteúdo das tabelas e execute algumas consultas de teste.