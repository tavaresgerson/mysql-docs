### 12.9.6 Ajuste Fino da Busca Full-Text do MySQL

A capacidade de busca full-text do MySQL possui poucos parâmetros ajustáveis pelo usuário. Você pode exercer mais controle sobre o comportamento da busca full-text se tiver uma distribuição de código fonte do MySQL, pois algumas alterações exigem modificações no código fonte. Consulte a Seção 2.8, “Instalando o MySQL a partir do Código Fonte”.

A busca full-text é criteriosamente ajustada para eficácia. Na maioria dos casos, modificar o comportamento padrão pode, na verdade, diminuir a eficácia. *Não altere os códigos fonte do MySQL a menos que você saiba o que está fazendo*.

A maioria das variáveis full-text descritas nesta seção deve ser definida no momento da inicialização do servidor. É necessário reiniciar o servidor para alterá-las; elas não podem ser modificadas enquanto o servidor estiver em execução.

Algumas alterações de variáveis exigem que você reconstrua os Indexes `FULLTEXT` em suas tabelas. As instruções para fazer isso são fornecidas mais adiante nesta seção.

* Configurando o Comprimento Mínimo e Máximo de Palavras
* Configurando o Limite de Busca em Linguagem Natural
* Modificando Operadores de Busca Full-Text Booleana
* Modificações de Conjunto de Caracteres (Character Set)
* Reconstruindo Indexes Full-Text do InnoDB
* Otimizando Indexes Full-Text do InnoDB
* Reconstruindo Indexes Full-Text do MyISAM

#### Configurando o Comprimento Mínimo e Máximo de Palavras

Os comprimentos mínimo e máximo das palavras a serem indexadas são definidos por `innodb_ft_min_token_size` e `innodb_ft_max_token_size` para Indexes de busca `InnoDB`, e `ft_min_word_len` e `ft_max_word_len` para Indexes `MyISAM`.

Note

Os parâmetros full-text de comprimento mínimo e máximo de palavras não se aplicam a Indexes `FULLTEXT` criados usando o parser ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

Após alterar qualquer uma dessas opções, reconstrua seus Indexes `FULLTEXT` para que a alteração tenha efeito. Por exemplo, para tornar pesquisáveis palavras de dois caracteres, você pode colocar as seguintes linhas em um arquivo de opções:

```sql
[mysqld]
innodb_ft_min_token_size=2
ft_min_word_len=2
```

Em seguida, reinicie o servidor e reconstrua seus Indexes `FULLTEXT`. Para tabelas `MyISAM`, observe as observações referentes ao **myisamchk** nas instruções a seguir sobre a reconstrução de Indexes full-text do `MyISAM`.

#### Configurando o Limite de Busca em Linguagem Natural

Para Indexes de busca `MyISAM`, o limite de 50% para buscas em linguagem natural (natural language searches) é determinado pelo esquema de ponderação particular escolhido. Para desabilitá-lo, procure pela seguinte linha em `storage/myisam/ftdefs.h`:

```sql
#define GWS_IN_USE GWS_PROB
```

Altere essa linha para:

```sql
#define GWS_IN_USE GWS_FREQ
```

Em seguida, recompile o MySQL. Não há necessidade de reconstruir os Indexes neste caso.

Note

Ao fazer essa alteração, você *diminui drasticamente* a capacidade do MySQL de fornecer valores de relevância adequados para a função `MATCH()`. Se você realmente precisa buscar por palavras tão comuns, seria melhor buscar usando `IN BOOLEAN MODE` em vez disso, que não observa o limite de 50%.

#### Modificando Operadores de Busca Full-Text Booleana

Para alterar os operadores usados para buscas full-text booleanas em tabelas `MyISAM`, defina a variável de sistema `ft_boolean_syntax`. (`InnoDB` não possui uma configuração equivalente.) Esta variável pode ser alterada enquanto o servidor está em execução, mas você deve ter privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”). Nenhuma reconstrução de Indexes é necessária neste caso.

#### Modificações de Character Set

Para o parser full-text embutido, você pode alterar o conjunto de caracteres que são considerados caracteres de palavra de várias maneiras, conforme descrito na lista a seguir. Depois de fazer a modificação, reconstrua os Indexes para cada tabela que contém Indexes `FULLTEXT`. Suponha que você queira tratar o caractere hífen ('-') como um caractere de palavra. Use um destes métodos:

*   Modifique o código fonte do MySQL: Em `storage/innobase/handler/ha_innodb.cc` (para `InnoDB`), ou em `storage/myisam/ftdefs.h` (para `MyISAM`), consulte as macros `true_word_char()` e `misc_word_char()`. Adicione `'-'` a uma dessas macros e recompile o MySQL.

*   Modifique um arquivo de character set: Isso não requer recompilação. A macro `true_word_char()` usa uma tabela de “tipo de caractere” para distinguir letras e números de outros caracteres. Você pode editar o conteúdo do array `<ctype><map>` em um dos arquivos XML de character set para especificar que `'-'` é uma "letra". Em seguida, use o character set fornecido para seus Indexes `FULLTEXT`. Para obter informações sobre o formato do array `<ctype><map>`, consulte a Seção 10.13.1, “Arrays de Definição de Caracteres”.

*   Adicione um novo Collation para o character set usado pelas colunas indexadas e altere as colunas para usar esse Collation. Para obter informações gerais sobre como adicionar Collations, consulte a Seção 10.14, “Adicionando um Collation a um Character Set”. Para um exemplo específico de Indexação full-text, consulte a Seção 12.9.7, “Adicionando um Collation Definido pelo Usuário para Indexação Full-Text”.

#### Reconstruindo Indexes Full-Text do InnoDB

Para que as alterações entrem em vigor, os Indexes `FULLTEXT` devem ser reconstruídos após a modificação de qualquer uma das seguintes variáveis de Index full-text: `innodb_ft_min_token_size`; `innodb_ft_max_token_size`; `innodb_ft_server_stopword_table`; `innodb_ft_user_stopword_table`; `innodb_ft_enable_stopword`; `ngram_token_size`. A modificação de `innodb_ft_min_token_size`, `innodb_ft_max_token_size` ou `ngram_token_size` requer a reinicialização do servidor.

Para reconstruir Indexes `FULLTEXT` para uma tabela `InnoDB`, use `ALTER TABLE` com as opções `DROP INDEX` e `ADD INDEX` para remover e recriar cada Index.

#### Otimizando Indexes Full-Text do InnoDB

A execução de `OPTIMIZE TABLE` em uma tabela com um Index full-text reconstrói o Index full-text, removendo IDs de Documentos excluídos e consolidando múltiplas entradas para a mesma palavra, sempre que possível.

Para otimizar um Index full-text, habilite `innodb_optimize_fulltext_only` e execute `OPTIMIZE TABLE`.

```sql
mysql> set GLOBAL innodb_optimize_fulltext_only=ON;
Query OK, 0 rows affected (0.01 sec)

mysql> OPTIMIZE TABLE opening_lines;
+--------------------+----------+----------+----------+
| Table              | Op       | Msg_type | Msg_text |
+--------------------+----------+----------+----------+
| test.opening_lines | optimize | status   | OK       |
+--------------------+----------+----------+----------+
1 row in set (0.01 sec)
```

Para evitar longos tempos de reconstrução para Indexes full-text em tabelas grandes, você pode usar a opção `innodb_ft_num_word_optimize` para realizar a otimização em estágios. A opção `innodb_ft_num_word_optimize` define o número de palavras que são otimizadas a cada vez que `OPTIMIZE TABLE` é executado. A configuração padrão é 2000, o que significa que 2000 palavras são otimizadas a cada execução de `OPTIMIZE TABLE`. As operações subsequentes de `OPTIMIZE TABLE` continuam de onde a operação `OPTIMIZE TABLE` anterior parou.

#### Reconstruindo Indexes Full-Text do MyISAM

Se você modificar variáveis full-text que afetam a Indexação (`ft_min_word_len`, `ft_max_word_len` ou `ft_stopword_file`), ou se você alterar o próprio arquivo de stopword, você deve reconstruir seus Indexes `FULLTEXT` após fazer as alterações e reiniciar o servidor.

Para reconstruir os Indexes `FULLTEXT` de uma tabela `MyISAM`, é suficiente fazer uma operação de reparo `QUICK`:

```sql
mysql> REPAIR TABLE tbl_name QUICK;
```

Alternativamente, use `ALTER TABLE` conforme descrito anteriormente. Em alguns casos, isso pode ser mais rápido do que uma operação de reparo.

Cada tabela que contém qualquer Index `FULLTEXT` deve ser reparada conforme mostrado. Caso contrário, as Queries para a tabela podem produzir resultados incorretos, e as modificações na tabela fazem com que o servidor veja a tabela como corrompida e precise de reparo.

Se você usar **myisamchk** para realizar uma operação que modifica Indexes de tabela `MyISAM` (como reparo ou análise), os Indexes `FULLTEXT` são reconstruídos usando os valores *padrão* dos parâmetros full-text para comprimento mínimo de palavra, comprimento máximo de palavra e arquivo de stopword, a menos que você especifique o contrário. Isso pode resultar em falha das Queries.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados em arquivos de Index `MyISAM`. Para evitar o problema, se você modificou os valores de comprimento mínimo ou máximo de palavra ou de arquivo de stopword usados pelo servidor, especifique os mesmos valores `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para **myisamchk** que você usa para **mysqld**. Por exemplo, se você definiu o comprimento mínimo da palavra para 3, você pode reparar uma tabela com **myisamchk** desta forma:

```sql
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que **myisamchk** e o servidor usem os mesmos valores para os parâmetros full-text, coloque cada um nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```sql
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa ao uso de **myisamchk** para modificação de Index de tabela `MyISAM` é usar as instruções `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas instruções são executadas pelo servidor, que conhece os valores de parâmetro full-text apropriados a serem usados.