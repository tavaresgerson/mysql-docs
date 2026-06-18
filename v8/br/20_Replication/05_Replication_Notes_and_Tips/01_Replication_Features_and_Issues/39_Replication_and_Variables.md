#### 19.5.1.39 Replicação e variáveis

As variáveis do sistema não são replicadas corretamente quando o modo `STATEMENT` é usado, exceto pelas seguintes variáveis quando são usadas com escopo de sessão:

- `auto_increment_increment`
- `auto_increment_offset`
- `character_set_client`
- `character_set_connection`
- `character_set_database`
- `character_set_server`
- `collation_connection`
- `collation_database`
- `collation_server`
- `foreign_key_checks`
- `identity`
- `last_insert_id`
- `lc_time_names`
- `pseudo_thread_id`
- `sql_auto_is_null`
- `time_zone`
- `timestamp`
- `unique_checks`

Quando o modo `MIXED` é usado, as variáveis na lista anterior, quando usadas com escopo de sessão, causam uma mudança do registro baseado em instruções para o registro baseado em linhas. Veja a Seção 7.4.4.3, “Formato de Registro Binário Misto”.

`sql_mode` também é replicado, exceto no modo `NO_DIR_IN_CREATE`; a replica sempre preserva seu próprio valor para `NO_DIR_IN_CREATE`, independentemente das alterações nele feitas na fonte. Isso é verdade para todos os formatos de replicação.

No entanto, quando o **mysqlbinlog** analisa uma instrução `SET @@sql_mode = mode`, o valor completo do `mode`, incluindo `NO_DIR_IN_CREATE`, é passado para o servidor receptor. Por essa razão, a replicação de tal instrução pode não ser segura quando o modo `STATEMENT` estiver em uso.

A variável de sistema `default_storage_engine` não é replicada, independentemente do modo de registro; isso visa facilitar a replicação entre diferentes motores de armazenamento.

A variável de sistema `read_only` não é replicada. Além disso, a ativação dessa variável tem efeitos diferentes em relação às tabelas temporárias, ao bloqueio de tabelas e à instrução `SET PASSWORD` em diferentes versões do MySQL.

A variável de sistema `max_heap_table_size` não é replicada. Aumentar o valor desta variável na origem sem fazê-lo na réplica pode, eventualmente, levar a erros de tabela cheia na réplica ao tentar executar instruções `INSERT` em uma tabela `MEMORY` na origem, que pode assim crescer mais do que sua contraparte na réplica. Para mais informações, consulte a Seção 19.5.1.21, “Replicação e Tabelas de MEMÓRIA”.

Na replicação baseada em declarações, as variáveis de sessão não são replicadas corretamente quando usadas em declarações que atualizam tabelas. Por exemplo, a seguinte sequência de declarações não insere os mesmos dados na fonte e na replica:

```
SET max_join_size=1000;
INSERT INTO mytable VALUES(@@max_join_size);
```

Isso não se aplica à sequência comum:

```
SET time_zone=...;
INSERT INTO mytable VALUES(CONVERT_TZ(..., ..., @@time_zone));
```

A replicação de variáveis de sessão não é um problema quando a replicação baseada em linhas está sendo usada, nesse caso, as variáveis de sessão são sempre replicadas com segurança. Veja a Seção 19.2.1, “Formatos de replicação”.

As seguintes variáveis de sessão são escritas no log binário e respeitadas pela réplica ao analisar o log binário, independentemente do formato de registro:

- `sql_mode`
- `foreign_key_checks`
- `unique_checks`
- `character_set_client`
- `collation_connection`
- `collation_database`
- `collation_server`
- `sql_auto_is_null`

Importante

Embora as variáveis de sessão relacionadas a conjuntos de caracteres e coligações sejam escritas no log binário, a replicação entre diferentes conjuntos de caracteres não é suportada.

Para ajudar a reduzir possíveis confusões, recomendamos que você use sempre a mesma configuração para a variável de sistema `lower_case_table_names` tanto na fonte quanto na replica, especialmente quando você está executando o MySQL em plataformas com sistemas de arquivos case-sensitive. A configuração `lower_case_table_names` só pode ser configurada durante a inicialização do servidor.
