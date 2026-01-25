### 10.2.2 UTF-8 para Metadata

Metadata é “o dado sobre o dado.” Tudo o que *descreve* o database — em oposição a ser o *conteúdo* do database — é metadata. Assim, nomes de colunas, nomes de databases, nomes de usuários, nomes de versões e a maioria dos resultados de *string* dos comandos `SHOW` são metadata. Isso também é verdade para o conteúdo das tabelas em `INFORMATION_SCHEMA`, pois essas tabelas, por definição, contêm informações sobre objetos do database.

A representação de metadata deve satisfazer estes requisitos:

* Toda a metadata deve estar no mesmo conjunto de caracteres. Caso contrário, nem os comandos `SHOW` nem os comandos `SELECT` para tabelas em `INFORMATION_SCHEMA` funcionariam corretamente, pois diferentes linhas na mesma coluna dos resultados dessas operações estariam em diferentes conjuntos de caracteres.

* A metadata deve incluir todos os caracteres em todos os idiomas. Caso contrário, os usuários não conseguiriam nomear colunas e tabelas usando seus próprios idiomas.

Para satisfazer ambos os requisitos, o MySQL armazena metadata em um conjunto de caracteres Unicode, especificamente UTF-8. Isso não causa nenhuma interrupção se você nunca usar caracteres acentuados ou não latinos. Mas, se o fizer, você deve estar ciente de que a metadata está em UTF-8.

Os requisitos de metadata significam que os valores de retorno das funções `USER()`, `CURRENT_USER()`, `SESSION_USER()`, `SYSTEM_USER()`, `DATABASE()` e `VERSION()` têm o conjunto de caracteres UTF-8 por padrão.

O servidor define a variável de sistema `character_set_system` para o nome do conjunto de caracteres de metadata:

```sql
mysql> SHOW VARIABLES LIKE 'character_set_system';
+----------------------+-------+
| Variable_name        | Value |
+----------------------+-------+
| character_set_system | utf8  |
+----------------------+-------+
```

O armazenamento de metadata usando Unicode *não* significa que o servidor retorna cabeçalhos de colunas e os resultados das funções `DESCRIBE` no conjunto de caracteres `character_set_system` por padrão. Quando você usa `SELECT column1 FROM t`, o nome `column1` em si é retornado do servidor para o cliente no conjunto de caracteres determinado pelo valor da variável de sistema `character_set_results`, que tem um valor padrão de `utf8`. Se você deseja que o servidor retorne os resultados de metadata em um conjunto de caracteres diferente, use o comando `SET NAMES` para forçar o servidor a realizar a conversão do conjunto de caracteres. `SET NAMES` define a variável `character_set_results` e outras variáveis de sistema relacionadas. (Veja Seção 10.4, “Conjuntos de Caracteres e Collations de Conexão”.) Alternativamente, um programa cliente pode realizar a conversão após receber o resultado do servidor. É mais eficiente para o cliente realizar a conversão, mas esta opção nem sempre está disponível para todos os clientes.

Se `character_set_results` for definido como `NULL`, nenhuma conversão é realizada e o servidor retorna metadata usando seu conjunto de caracteres original (o conjunto indicado por `character_set_system`).

Mensagens de erro retornadas do servidor para o cliente são convertidas automaticamente para o conjunto de caracteres do cliente, assim como ocorre com a metadata.

Se você estiver usando (por exemplo) a função `USER()` para comparação ou atribuição dentro de um único comando, não se preocupe. O MySQL realiza alguma conversão automática para você.

```sql
SELECT * FROM t1 WHERE USER() = latin1_column;
```

Isso funciona porque o conteúdo de `latin1_column` é convertido automaticamente para UTF-8 antes da comparação.

```sql
INSERT INTO t1 (latin1_column) SELECT USER();
```

Isso funciona porque o conteúdo de `USER()` é convertido automaticamente para `latin1` antes da atribuição.

Embora a conversão automática não esteja no padrão SQL, o padrão afirma que cada conjunto de caracteres é (em termos de caracteres suportados) um “subset” do Unicode. Uma vez que é um princípio bem conhecido que “o que se aplica a um superset pode se aplicar a um subset,” acreditamos que uma collation para Unicode pode se aplicar a comparações com strings não-Unicode. Para obter mais informações sobre a coerção de strings, veja Seção 10.8.4, “Coercibilidade de Collation em Expressões”.