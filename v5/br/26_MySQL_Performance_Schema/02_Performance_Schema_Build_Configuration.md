## 25.2 Configuração de Configuração de Schema de Desempenho

O Schema de Desempenho é obrigatório e sempre compilado. É possível excluir determinadas partes da instrumentação do Schema de Desempenho. Por exemplo, para excluir a instrumentação de estágios e declarações, faça o seguinte:

```sql
$> cmake . \
        -DDISABLE_PSI_STAGE=1 \
        -DDISABLE_PSI_STATEMENT=1
```

Para mais informações, consulte as descrições das opções de `DISABLE_PSI_XXX` **CMake** na Seção 2.8.7, “Opções de Configuração de Fonte MySQL”.

Se você instalar o MySQL em uma instalação anterior que foi configurada sem o Schema de Desempenho (ou com uma versão mais antiga do Schema de Desempenho que tem tabelas ausentes ou desatualizadas), uma indicação desse problema é a presença de mensagens como as seguintes no log de erro:

```sql
[ERROR] Native table 'performance_schema'.'events_waits_history'
has the wrong structure
[ERROR] Native table 'performance_schema'.'events_waits_history_long'
has the wrong structure
...
```

Para corrigir esse problema, realize o procedimento de atualização do MySQL. Veja a Seção 2.10, “Atualizando o MySQL”.

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

Você também pode se conectar ao servidor e procurar uma string que nomeie o mecanismo de armazenamento `PERFORMANCE_SCHEMA` na saída do `SHOW ENGINES`:

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

Se o Schema de desempenho não foi configurado no servidor na hora da construção, nenhuma string para `PERFORMANCE_SCHEMA` aparece na saída do `SHOW ENGINES`. Você pode ver `performance_schema` listado na saída do `SHOW DATABASES`, mas ele não tem tabelas e não pode ser usado.

Uma string para `PERFORMANCE_SCHEMA` na saída `SHOW ENGINES` significa que o Schema de Desempenho está disponível, não que ele esteja habilitado. Para habilitá-lo, você deve fazê-lo na inicialização do servidor, conforme descrito na próxima seção.