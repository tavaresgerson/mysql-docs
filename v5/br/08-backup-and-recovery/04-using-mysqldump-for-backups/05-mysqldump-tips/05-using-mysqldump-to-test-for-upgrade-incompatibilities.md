#### 7.4.5.5 Usar mysqldump para testar incompatibilidades de atualização

Ao considerar uma atualização do MySQL, é prudente instalar a versão mais recente separadamente da sua versão de produção atual. Em seguida, você pode fazer o dump do banco de dados e das definições dos objetos do banco de dados do servidor de produção e carregá-los no novo servidor para verificar se eles são tratados corretamente. (Isso também é útil para testar reduções de versão.)

No servidor de produção:

```sql
$> mysqldump --all-databases --no-data --routines --events > dump-defs.sql
```

No servidor atualizado:

```sql
$> mysql < dump-defs.sql
```

Como o arquivo de depuração não contém dados da tabela, ele pode ser processado rapidamente. Isso permite que você identifique possíveis incompatibilidades sem esperar por operações de carregamento de dados demoradas. Procure por avisos ou erros enquanto o arquivo de depuração está sendo processado.

Depois de verificar que as definições estão sendo tratadas corretamente, descarte os dados e tente carregá-los no servidor atualizado.

No servidor de produção:

```sql
$> mysqldump --all-databases --no-create-info > dump-data.sql
```

No servidor atualizado:

```sql
$> mysql < dump-data.sql
```

Agora, verifique o conteúdo da tabela e execute algumas consultas de teste.
