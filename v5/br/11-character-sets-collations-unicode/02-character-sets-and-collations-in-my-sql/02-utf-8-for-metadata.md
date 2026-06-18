### 10.2.2 UTF-8 para Metadata

Metadata é "os dados sobre os dados". Qualquer coisa que *descreva* o Database — em oposição a ser o *conteúdo* do Database — é Metadata. Assim, nomes de colunas, nomes de Databases, nomes de usuários, nomes de versão e a maioria dos resultados de string de `SHOW` são Metadata. Isso também é verdade para o conteúdo das tabelas em `INFORMATION_SCHEMA`, pois essas tabelas, por definição, contêm informações sobre objetos do Database.

A representação de Metadata deve satisfazer estes requisitos:

* Toda Metadata deve estar no mesmo Character Set. Caso contrário, nem as instruções `SHOW` nem as instruções `SELECT` para tabelas em `INFORMATION_SCHEMA` funcionariam corretamente, pois linhas diferentes na mesma coluna dos resultados dessas operações estariam em diferentes Character Sets.

* A Metadata deve incluir todos os caracteres em todos os idiomas. Caso contrário, os usuários não conseguiriam nomear colunas e tabelas usando seus próprios idiomas.

Para satisfazer ambos os requisitos, o MySQL armazena Metadata em um Character Set Unicode, especificamente UTF-8. Isso não causa nenhuma interrupção se você nunca usar caracteres acentuados ou não latinos. Mas se você usar, você deve estar ciente de que a Metadata está em UTF-8.

Os requisitos de Metadata significam que os valores de retorno das funções `USER()`, `CURRENT_USER()`, `SESSION_USER()`, `SYSTEM_USER()`, `DATABASE()` e `VERSION()` possuem o Character Set UTF-8 por padrão.

O servidor define a variável de sistema `character_set_system` para o nome do Character Set de Metadata:

```sql
mysql> SHOW VARIABLES LIKE 'character_set_system';
+----------------------+-------+
| Variable_name        | Value |
+----------------------+-------+
| character_set_system | utf8  |
+----------------------+-------+
```

O armazenamento de Metadata usando Unicode *não* significa que o servidor retorne cabeçalhos de colunas e os resultados de funções `DESCRIBE` no Character Set `character_set_system` por padrão. Quando você usa `SELECT column1 FROM t`, o nome `column1` em si é retornado do servidor para o cliente no Character Set determinado pelo valor da variável de sistema `character_set_results`, que tem um valor padrão de `utf8`. Se você deseja que o servidor retorne os resultados de Metadata em um Character Set diferente, use a instrução `SET NAMES` para forçar o servidor a realizar a conversão de Character Set. `SET NAMES` define `character_set_results` e outras variáveis de sistema relacionadas. (Consulte a Seção 10.4, “Connection Character Sets and Collations”.) Alternativamente, um programa cliente pode realizar a conversão após receber o resultado do servidor. É mais eficiente para o cliente realizar a conversão, mas essa opção nem sempre está disponível para todos os clientes.

Se `character_set_results` for definido como `NULL`, nenhuma conversão é realizada e o servidor retorna Metadata usando seu Character Set original (o conjunto indicado por `character_set_system`).

As mensagens de erro retornadas do servidor para o cliente são convertidas automaticamente para o Character Set do cliente, assim como ocorre com Metadata.

Se você estiver usando (por exemplo) a função `USER()` para comparação ou atribuição dentro de uma única instrução, não se preocupe. O MySQL realiza algumas conversões automáticas para você.

```sql
SELECT * FROM t1 WHERE USER() = latin1_column;
```

Isso funciona porque o conteúdo de `latin1_column` é automaticamente convertido para UTF-8 antes da comparação.

```sql
INSERT INTO t1 (latin1_column) SELECT USER();
```

Isso funciona porque o conteúdo de `USER()` é automaticamente convertido para `latin1` antes da atribuição.

Embora a conversão automática não esteja no padrão SQL, o padrão afirma que todo Character Set é (em termos de caracteres suportados) um "subset" (subconjunto) do Unicode. Por ser um princípio bem conhecido que "o que se aplica a um superset pode se aplicar a um subset", acreditamos que um Collation para Unicode pode ser aplicado para comparações com strings não-Unicode. Para mais informações sobre Coercibility de strings, consulte a Seção 10.8.4, “Collation Coercibility in Expressions”.