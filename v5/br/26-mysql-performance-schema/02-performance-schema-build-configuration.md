## 25.2 Configuração de Build do Performance Schema

O Performance Schema é obrigatório e sempre compilado. É possível excluir certas partes da instrumentação do Performance Schema. Por exemplo, para excluir a instrumentação de stage e statement, faça o seguinte:

```sql
$> cmake . \
        -DDISABLE_PSI_STAGE=1 \
        -DDISABLE_PSI_STATEMENT=1
```

Para mais informações, consulte as descrições das opções **CMake** `DISABLE_PSI_XXX` na [Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

Se você instalar o MySQL sobre uma instalação anterior que foi configurada sem o Performance Schema (ou com uma versão mais antiga do Performance Schema que possui tabelas ausentes ou desatualizadas). Uma indicação desse problema é a presença de mensagens como as seguintes no error log:

```sql
[ERROR] Native table 'performance_schema'.'events_waits_history'
has the wrong structure
[ERROR] Native table 'performance_schema'.'events_waits_history_long'
has the wrong structure
...
```

Para corrigir esse problema, execute o procedimento de upgrade do MySQL. Consulte a [Seção 2.10, “Fazendo Upgrade do MySQL”](upgrading.html "2.10 Upgrading MySQL").

Para verificar se um server foi construído com suporte ao Performance Schema, verifique sua saída de ajuda. Se o Performance Schema estiver disponível, a saída menciona várias variáveis cujos nomes começam com `performance_schema`:

```sql
$> mysqld --verbose --help
...
  --performance_schema
                      Enable the performance schema.
  --performance_schema_events_waits_history_long_size=#
                      Number of rows in events_waits_history_long.
...
```

Você também pode se conectar ao server e procurar por uma linha que nomeie o storage engine [`PERFORMANCE_SCHEMA`](performance-schema.html "Capítulo 25 MySQL Performance Schema") na saída de [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement"):

```sql
mysql> SHOW ENGINES\G
...
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
...
```

Se o Performance Schema não foi configurado no server no momento do build, nenhuma linha para [`PERFORMANCE_SCHEMA`](performance-schema.html "Capítulo 25 MySQL Performance Schema") aparece na saída de [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement"). Você pode ver `performance_schema` listado na saída de [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"), mas ele não terá tabelas e não poderá ser usado.

Uma linha para [`PERFORMANCE_SCHEMA`](performance-schema.html "Capítulo 25 MySQL Performance Schema") na saída de [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") significa que o Performance Schema está disponível, e não que ele está habilitado. Para habilitá-lo, você deve fazê-lo na inicialização do server, conforme descrito na próxima seção.