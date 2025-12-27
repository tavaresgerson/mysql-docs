### 14.9.6 Ajuste fino da pesquisa de texto completo do MySQL

A capacidade de pesquisa de texto completo do MySQL tem poucos parâmetros que podem ser ajustados pelo usuário. Você pode exercer mais controle sobre o comportamento da pesquisa de texto completo se tiver uma distribuição de fonte do MySQL, pois algumas alterações requerem modificações no código-fonte. Consulte a Seção 2.8, “Instalando o MySQL a partir da fonte”.

A pesquisa de texto completo é cuidadosamente ajustada para eficácia. Modificar o comportamento padrão na maioria dos casos pode, na verdade, diminuir a eficácia. *Não altere as fontes do MySQL a menos que saiba o que está fazendo*.

A maioria das variáveis de texto completo descritas nesta seção deve ser definida no momento do início do servidor. Uma reinicialização do servidor é necessária para alterá-las; elas não podem ser modificadas enquanto o servidor estiver em execução.

Algumas alterações de variáveis exigem que você reconstrua os índices `FULLTEXT` em suas tabelas. As instruções para fazer isso são fornecidas mais adiante nesta seção.

* Configurando o comprimento mínimo e máximo das palavras
* Configurando o limiar de pesquisa de linguagem natural
* Modificando operadores de pesquisa de texto completo booleanos
* Modificações no conjunto de caracteres
* Reconstruindo índices `FULLTEXT` do InnoDB
* Otimizando índices `FULLTEXT` do InnoDB
* Reconstruindo índices `FULLTEXT` do MyISAM

#### Configurando o comprimento mínimo e máximo das palavras

Os comprimentos mínimos e máximos das palavras a serem indexadas são definidos pelos parâmetros `innodb_ft_min_token_size` e `innodb_ft_max_token_size` para índices de pesquisa `InnoDB`, e `ft_min_word_len` e `ft_max_word_len` para índices `MyISAM`.

::: info Nota

Os parâmetros de texto completo de comprimento mínimo e máximo não se aplicam aos índices `FULLTEXT` criados usando o analisador ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.


:::

Após alterar qualquer uma dessas opções, reconstrua seus índices `FULLTEXT` para que a alteração entre em vigor. Por exemplo, para tornar as palavras de dois caracteres pesquisáveis, você poderia colocar as seguintes linhas em um arquivo de opção:

```
[mysqld]
innodb_ft_min_token_size=2
ft_min_word_len=2
```

Em seguida, reinicie o servidor e reconstrua seus índices `FULLTEXT`. Para tabelas `MyISAM`, observe as observações sobre `myisamchk` nas instruções que seguem para a reconstrução de índices `MyISAM` de texto completo.

#### Configurando o Limite de Busca em Língua Natural

Para índices de busca `MyISAM`, o limite de 50% para buscas em linguagem natural é determinado pelo esquema de ponderação escolhido. Para desabilitar, procure a seguinte linha em `storage/myisam/ftdefs.h`:

```
#define GWS_IN_USE GWS_PROB
```

Altere essa linha para:

```
#define GWS_IN_USE GWS_FREQ
```

Em seguida, recomponha o MySQL. Não é necessário reconstruir os índices neste caso.

::: info Nota

Ao fazer essa alteração, você *reduz significativamente* a capacidade do MySQL de fornecer valores de relevância adequados para a função `MATCH()`. Se você realmente precisar buscar palavras comuns, seria melhor usar a busca com `IN BOOLEAN MODE` em vez disso, que não observa o limite de 50%.

:::

#### Modificando Operadores de Busca de Texto Completo Booleanos

Para alterar os operadores usados para buscas de texto completo booleanas em tabelas `MyISAM`, defina a variável de sistema `ft_boolean_syntax`. (`InnoDB` não tem uma configuração equivalente.) Essa variável pode ser alterada enquanto o servidor estiver em execução, mas você deve ter privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”). Não é necessário reconstruir os índices neste caso.

#### Modificações no Conjunto de Caracteres

Para o parser de texto completo embutido, você pode alterar o conjunto de caracteres que são considerados caracteres de palavra de várias maneiras, conforme descrito na lista a seguir. Após fazer a modificação, reconstrua os índices para cada tabela que contém algum índice `FULLTEXT`. Suponha que você queira tratar o caractere hífen ('-') como um caractere de palavra. Use um desses métodos:

* Modifique o código-fonte do MySQL: Em `storage/innobase/handler/ha_innodb.cc` (para `InnoDB`) ou em `storage/myisam/ftdefs.h` (para `MyISAM`), consulte as macros `true_word_char()` e `misc_word_char()`. Adicione `'-'` a uma dessas macros e recompile o MySQL.
* Modifique um arquivo de conjunto de caracteres: Isso não requer recompilação. A macro `true_word_char()` usa uma tabela de "tipo de caractere" para distinguir letras e números de outros caracteres. Você pode editar o conteúdo do array `<ctype><map>` em um dos arquivos XML de conjunto de caracteres para especificar que `'-'` é uma "letra". Em seguida, use o conjunto de caracteres fornecido para seus índices `FULLTEXT`. Para informações sobre o formato do array `<ctype><map>`, consulte  Seção 12.13.1, “Arrays de Definição de Caracteres”.
* Adicione um novo conjunto de collation para o conjunto de caracteres usado pelas colunas indexadas e altere as colunas para usar esse conjunto de collation. Para informações gerais sobre adição de collation, consulte  Seção 12.14, “Adição de uma Collation a um Conjunto de Caracteres”. Para um exemplo específico de indexação full-text, consulte Seção 14.9.7, “Adição de uma Collation Definida pelo Usuário para Indexação Full-Text”.

#### Rebuilding of Full-Text Indexes in InnoDB

Para que as alterações tenham efeito, os índices `FULLTEXT` devem ser reconstruídos após modificar qualquer uma das seguintes variáveis de índice full-text: `innodb_ft_min_token_size`; `innodb_ft_max_token_size`; `innodb_ft_server_stopword_table`; `innodb_ft_user_stopword_table`; `innodb_ft_enable_stopword`; `ngram_token_size`. Modificar `innodb_ft_min_token_size`, `innodb_ft_max_token_size` ou `ngram_token_size` requer o reinício do servidor.

Para reconstruir índices `FULLTEXT` para uma tabela `InnoDB`, use `ALTER TABLE` com as opções `DROP INDEX` e `ADD INDEX` para excluir e recriar cada índice.

#### Otimizando Indizes Full-Text em InnoDB

Executar `OPTIMIZE TABLE` em uma tabela com um índice full-text reconstrui o índice full-text, removendo IDs de documento excluídos e consolidando múltiplas entradas para a mesma palavra, quando possível.

Para otimizar um índice de texto completo, habilite `innodb_optimize_fulltext_only` e execute `OPTIMIZE TABLE`.

```
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

Para evitar tempos prolongados de reconstrução de índices de texto completo em tabelas grandes, você pode usar a opção `innodb_ft_num_word_optimize` para realizar a otimização em etapas. A opção `innodb_ft_num_word_optimize` define o número de palavras que são otimizadas cada vez que `OPTIMIZE TABLE` é executado. O valor padrão é 2000, o que significa que 2000 palavras são otimizadas cada vez que `OPTIMIZE TABLE` é executado. As operações subsequentes de `OPTIMIZE TABLE` continuam a partir do ponto onde a operação de `OPTIMIZE TABLE` anterior terminou.

#### Reconstrução de Índices de Texto Completo MyISAM

Se você modificar variáveis de texto completo que afetam a indexação ( `ft_min_word_len`, `ft_max_word_len` ou `ft_stopword_file`), ou se alterar o próprio arquivo de palavras-chave, você deve reconstruir seus índices `FULLTEXT` após fazer as alterações e reiniciar o servidor.

Para reconstruir os índices `FULLTEXT` para uma tabela `MyISAM`, é suficiente realizar uma operação de reparo `QUICK`:

```
mysql> REPAIR TABLE tbl_name QUICK;
```

Alternativamente, use  `ALTER TABLE` como descrito. Em alguns casos, isso pode ser mais rápido do que uma operação de reparo.

Cada tabela que contém algum índice `FULLTEXT` deve ser reparada como mostrado. Caso contrário, as consultas para a tabela podem retornar resultados incorretos, e as modificações na tabela fazem com que o servidor veja a tabela como corrompida e necessitando de reparo.

Se você usar `myisamchk` para realizar uma operação que modifica os índices de tabela `MyISAM` (como reparo ou análise), os índices `FULLTEXT` são reconstruídos usando os valores padrão dos parâmetros de texto completo para comprimento mínimo de palavra, comprimento máximo de palavra e arquivo de palavras-chave, a menos que você especifique o contrário. Isso pode resultar em consultas que falham.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados nos arquivos de índice `MyISAM`. Para evitar o problema se você tiver modificado os valores do arquivo de palavra mínima ou máxima ou do arquivo de palavras-chave usadas pelo servidor, especifique os mesmos valores de `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para `myisamchk` que você usa para `mysqld`. Por exemplo, se você definiu o comprimento mínimo da palavra para 3, você pode reparar uma tabela com `myisamchk` da seguinte forma:

```
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que `myisamchk` e o servidor usem os mesmos valores para os parâmetros de texto completo, coloque cada um deles nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa ao uso de `myisamchk` para a modificação do índice de tabela `MyISAM` é usar as instruções `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas instruções são executadas pelo servidor, que conhece os valores corretos dos parâmetros de texto completo a serem usados.