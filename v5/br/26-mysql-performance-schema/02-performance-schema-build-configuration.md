## 25.2 Configuração de construção do esquema de desempenho

O Schema de Desempenho é obrigatório e sempre compilado. É possível excluir certas partes da instrumentação do Schema de Desempenho. Por exemplo, para excluir a instrumentação de estágios e declarações, faça o seguinte:

```sql
$> cmake . \
        -DDISABLE_PSI_STAGE=1 \
        -DDISABLE_PSI_STATEMENT=1
```

Para obter mais informações, consulte as descrições das opções `DISABLE_PSI_XXX` do **CMake** na Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”.

Se você instalar o MySQL sobre uma instalação anterior que foi configurada sem o Schema de Desempenho (ou com uma versão mais antiga do Schema de Desempenho que tem tabelas ausentes ou desatualizadas), uma indicação desse problema é a presença de mensagens como as seguintes no log de erro:

```sql
[ERROR] Native table 'performance_schema'.'events_waits_history'
has the wrong structure
[ERROR] Native table 'performance_schema'.'events_waits_history_long'
has the wrong structure
...
```

Para corrigir esse problema, execute o procedimento de atualização do MySQL. Consulte Seção 2.10, “Atualizando o MySQL”.

Para verificar se um servidor foi construído com suporte ao Schema de Desempenho, verifique sua saída de ajuda. Se o Schema de Desempenho estiver disponível, a saída menciona várias variáveis com nomes que começam com `performance_schema`:

```sql
$> mysqld --verbose --help
...
  --performance_schema
                      Enable the performance schema.
  --performance_schema_events_waits_history_long_size=#
                      Number of rows in events_waits_history_long.
...
```

Você também pode se conectar ao servidor e procurar por uma linha que nomeie o mecanismo de armazenamento `PERFORMANCE_SCHEMA` na saída do comando `SHOW ENGINES`:

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

Se o Schema de Desempenho não foi configurado no servidor durante a construção, nenhuma linha para `PERFORMANCE_SCHEMA` aparece na saída do `SHOW ENGINES`. Você pode ver `performance_schema` listado na saída do `SHOW DATABASES`, mas ele não tem tabelas e não pode ser usado.

Uma linha para `PERFORMANCE_SCHEMA` na saída de `SHOW ENGINES` significa que o Schema de Desempenho está disponível, não que ele está habilitado. Para habilitá-lo, você deve fazê-lo na inicialização do servidor, conforme descrito na próxima seção.
