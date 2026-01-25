#### 7.4.5.5 Usando mysqldump para Testar Incompatibilidades de Upgrade

Ao considerar um Upgrade do MySQL, é prudente instalar a versão mais recente separadamente da sua versão de produção atual. Em seguida, você pode fazer o dump das definições do Database e dos objetos do Database a partir do servidor de produção e carregá-las no novo servidor para verificar se são tratadas corretamente. (Isto também é útil para testar downgrades.)

No servidor de produção:

```sql
$> mysqldump --all-databases --no-data --routines --events > dump-defs.sql
```

No servidor com Upgrade:

```sql
$> mysql < dump-defs.sql
```

Como o arquivo dump não contém os dados das tabelas, ele pode ser processado rapidamente. Isso permite identificar incompatibilidades potenciais sem ter que esperar por operações demoradas de carregamento de dados (data-loading). Procure por warnings ou errors enquanto o arquivo dump estiver sendo processado.

Após verificar que as definições estão sendo tratadas corretamente, faça o dump dos dados e tente carregá-los no servidor com Upgrade.

No servidor de produção:

```sql
$> mysqldump --all-databases --no-create-info > dump-data.sql
```

No servidor com Upgrade:

```sql
$> mysql < dump-data.sql
```

Agora verifique o conteúdo das tabelas e execute algumas test queries.