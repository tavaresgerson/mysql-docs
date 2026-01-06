### 10.2.2 UTF-8 para metadados

Os metadados são “os dados sobre os dados”. Tudo o que *descreve* o banco de dados — em oposição a ser o *conteúdo* do banco de dados — é metadado. Assim, os nomes de colunas, nomes de bancos de dados, nomes de usuários, nomes de versões e a maioria dos resultados de strings do `SHOW` são metadados. Isso também é verdade para o conteúdo das tabelas no `INFORMATION_SCHEMA`, pois essas tabelas, por definição, contêm informações sobre objetos do banco de dados.

A representação dos metadados deve atender a esses requisitos:

- Todos os metadados devem estar no mesmo conjunto de caracteres. Caso contrário, nem as instruções `SHOW` nem as instruções `SELECT` para tabelas no `INFORMATION_SCHEMA` funcionariam corretamente, porque linhas diferentes na mesma coluna dos resultados dessas operações estariam em diferentes conjuntos de caracteres.

- Os metadados devem incluir todos os caracteres em todos os idiomas. Caso contrário, os usuários não poderão nomear colunas e tabelas usando seus próprios idiomas.

Para atender a ambos os requisitos, o MySQL armazena metadados em um conjunto de caracteres Unicode, especificamente UTF-8. Isso não causa qualquer interrupção se você nunca usar caracteres acentuados ou não latinos. Mas se você fizer isso, você deve estar ciente de que os metadados estão em UTF-8.

Os requisitos de metadados significam que os valores de retorno das funções `USER()`, `CURRENT_USER()`, `SESSION_USER()`, `SYSTEM_USER()`, `DATABASE()` e `VERSION()` têm o conjunto de caracteres UTF-8 por padrão.

O servidor define a variável de sistema `character_set_system` com o nome do conjunto de caracteres de metadados:

```sql
mysql> SHOW VARIABLES LIKE 'character_set_system';
+----------------------+-------+
| Variable_name        | Value |
+----------------------+-------+
| character_set_system | utf8  |
+----------------------+-------+
```

O armazenamento de metadados usando Unicode *não* significa que o servidor retorna cabeçalhos de colunas e os resultados das funções `DESCRIBE` no conjunto de caracteres `character_set_system` por padrão. Quando você usa `SELECT column1 FROM t`, o próprio nome `column1` é retornado pelo servidor ao cliente no conjunto de caracteres determinado pelo valor da variável de sistema `character_set_results`, que tem um valor padrão de `utf8`. Se você quiser que o servidor retorne os resultados dos metadados em um conjunto de caracteres diferente, use a instrução `SET NAMES` para forçar o servidor a realizar a conversão de conjunto de caracteres. `SET NAMES` define o `character_set_results` e outras variáveis de sistema relacionadas. (Veja a Seção 10.4, “Conjunto de caracteres de conexão e colagens”.) Alternativamente, um programa cliente pode realizar a conversão após receber o resultado do servidor. É mais eficiente que o cliente realize a conversão, mas essa opção nem sempre está disponível para todos os clientes.

Se `character_set_results` for definido como `NULL`, nenhuma conversão é realizada e o servidor retorna metadados usando seu conjunto de caracteres original (o conjunto indicado por `character_set_system`).

Mensagens de erro devolvidas pelo servidor ao cliente são convertidas automaticamente para o conjunto de caracteres do cliente, assim como os metadados.

Se você estiver usando, por exemplo, a função `USER()` para comparação ou atribuição em uma única instrução, não se preocupe. O MySQL realiza algumas conversões automáticas para você.

```sql
SELECT * FROM t1 WHERE USER() = latin1_column;
```

Isso funciona porque o conteúdo de `latin1_column` é convertido automaticamente para UTF-8 antes da comparação.

```sql
INSERT INTO t1 (latin1_column) SELECT USER();
```

Isso funciona porque o conteúdo de `USER()` é convertido automaticamente para `latin1` antes da atribuição.

Embora a conversão automática não esteja no padrão SQL, o padrão diz que cada conjunto de caracteres é (em termos de caracteres suportados) um “subconjunto” do Unicode. Como é um princípio bem conhecido que “o que se aplica a um superconjunto pode se aplicar a um subconjunto”, acreditamos que uma colagem para o Unicode pode ser aplicada para comparações com strings não Unicode. Para mais informações sobre a coerção de strings, consulte a Seção 10.8.4, “Coercibilidade da Colagem em Expressões”.
