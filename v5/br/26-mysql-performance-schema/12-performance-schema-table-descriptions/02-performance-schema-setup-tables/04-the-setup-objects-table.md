#### 25.12.2.4 A tabela setup\_objects

A tabela `setup_objects` controla se o Schema de Desempenho monitora objetos específicos. Essa tabela tem um tamanho máximo de 100 linhas por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_objects_size` na inicialização do servidor.

O conteúdo inicial do `setup_objects` parece assim:

```sql
mysql> SELECT * FROM performance_schema.setup_objects;
+-------------+--------------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA      | OBJECT_NAME | ENABLED | TIMED |
+-------------+--------------------+-------------+---------+-------+
| EVENT       | mysql              | %           | NO      | NO    |
| EVENT       | performance_schema | %           | NO      | NO    |
| EVENT       | information_schema | %           | NO      | NO    |
| EVENT       | %                  | %           | YES     | YES   |
| FUNCTION    | mysql              | %           | NO      | NO    |
| FUNCTION    | performance_schema | %           | NO      | NO    |
| FUNCTION    | information_schema | %           | NO      | NO    |
| FUNCTION    | %                  | %           | YES     | YES   |
| PROCEDURE   | mysql              | %           | NO      | NO    |
| PROCEDURE   | performance_schema | %           | NO      | NO    |
| PROCEDURE   | information_schema | %           | NO      | NO    |
| PROCEDURE   | %                  | %           | YES     | YES   |
| TABLE       | mysql              | %           | NO      | NO    |
| TABLE       | performance_schema | %           | NO      | NO    |
| TABLE       | information_schema | %           | NO      | NO    |
| TABLE       | %                  | %           | YES     | YES   |
| TRIGGER     | mysql              | %           | NO      | NO    |
| TRIGGER     | performance_schema | %           | NO      | NO    |
| TRIGGER     | information_schema | %           | NO      | NO    |
| TRIGGER     | %                  | %           | YES     | YES   |
+-------------+--------------------+-------------+---------+-------+
```

As modificações na tabela `setup_objects` afetam o monitoramento dos objetos imediatamente.

Para os tipos de objetos listados em `setup_objects`, o Schema de Desempenho usa a tabela para monitorá-los. A correspondência de objetos é baseada nas colunas `OBJECT_SCHEMA` e `OBJECT_NAME`. Os objetos para os quais não há correspondência não são monitorados.

O efeito da configuração padrão do objeto é instrumentar todas as tabelas, exceto aquelas nos bancos de dados `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (As tabelas no banco de dados `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo de `setup_objects`; a linha para `information_schema.%` apenas torna isso padrão explícito.)

Quando o Schema de Desempenho verifica uma correspondência em `setup_objects`, ele tenta encontrar correspondências mais específicas primeiro. Por exemplo, com uma tabela `db1.t1`, ele procura uma correspondência para `'db1'` e `'t1'`, depois para `'db1'` e `'%%'`, e depois para `'%%'` e `'%%'`. A ordem em que a correspondência ocorre importa, pois diferentes linhas de correspondência em `setup_objects` podem ter valores diferentes de `ENABLED` e `TIMED`.

As linhas podem ser inseridas ou excluídas de `setup_objects` por usuários com o privilégio de `INSERT` ou `DELETE` na tabela. Para as linhas existentes, apenas as colunas `ENABLED` e `TIMED` podem ser modificadas, por usuários com o privilégio de `UPDATE` na tabela.

Para obter mais informações sobre o papel da tabela `setup_objects` no filtro de eventos, consulte Seção 25.4.3, “Pré-filtro de Eventos”.

A tabela `setup_objects` tem as seguintes colunas:

- `OBJETO_TIPO`

  O tipo de objeto a ser instrumentado. O valor é um dos seguintes: `'EVENT'` (evento do Agendamento de Eventos), `'FUNCTION'` (função armazenada), `'PROCEDURE'` (procedimento armazenado), `'TABLE'` (tabela base) ou `'TRIGGER'` (trigger).

  O filtro `TABLE` afeta eventos de E/S de tabela (`instrumento wait/io/table/sql/handler`) e eventos de bloqueio de tabela (`instrumento wait/lock/table/sql/handler`).

- `OBJECT_SCHEMA`

  O esquema que contém o objeto. Deve ser um nome literal ou `'%'` para significar “qualquer esquema”.

- `NOME_OBJETO`

  O nome do objeto instrumentado. Deve ser um nome literal ou `'%'` para significar “qualquer objeto”.

- `ativado`

  Se os eventos para o objeto estão instrumentados. O valor é `SIM` ou `NÃO`. Esta coluna pode ser modificada.

- `TIMED`

  Se os eventos para o objeto são temporizados. O valor é `SIM` ou `NÃO`. Esta coluna pode ser modificada.

A opção `TRUNCATE TABLE` está permitida para a tabela `setup_objects`. Ela remove as linhas.
