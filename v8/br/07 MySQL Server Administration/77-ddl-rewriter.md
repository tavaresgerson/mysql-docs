### 7.6.5 O plug-in `ddl_rewriter`

O MySQL 8.4 inclui um plug-in `ddl_rewriter` que modifica as instruções `CREATE TABLE` recebidas pelo servidor antes de analisá-las e executá-las. O plug-in remove as cláusulas `ENCRYPTION`, `DATA DIRECTORY` e `INDEX DIRECTORY`, que podem ser úteis ao restaurar tabelas de arquivos de despejo SQL criados a partir de bancos de dados criptografados ou que têm suas tabelas armazenadas fora do diretório de dados. Por exemplo, o plugin pode permitir a restauração de tais arquivos de despejo em uma instância não criptografada ou em um ambiente onde os caminhos fora do diretório de dados não são acessíveis.

Antes de usar o plug-in `ddl_rewriter`, instale-o de acordo com as instruções fornecidas na Seção 7.6.5.1, Instalar ou Desinstalar `ddl_rewriter`.

\[`ddl_rewriter`] examina instruções SQL recebidas pelo servidor antes da análise, reescrevendo-as de acordo com estas condições:

- \[`ddl_rewriter`] considera apenas as instruções \[`CREATE TABLE`], e apenas se elas são instruções autônomas que ocorrem no início de uma linha de entrada ou no início do texto da instrução preparado. \[`ddl_rewriter`] não considera as instruções \[`CREATE TABLE`]] dentro das definições de programa armazenadas. As instruções podem se estender por várias linhas.
- Dentro das instruções consideradas para reescrita, as instâncias das seguintes cláusulas são reescritas e cada instância é substituída por um único espaço:

  - `ENCRYPTION`
  - `DATA DIRECTORY` (a nível da tabela e da partição)
  - `INDEX DIRECTORY` (a nível da tabela e da partição)
- A reescrita não depende de letras maiúsculas.

Se `ddl_rewriter` reescrever uma instrução, gera um aviso:

```
mysql> CREATE TABLE t (i INT) DATA DIRECTORY '/var/mysql/data';
Query OK, 0 rows affected, 1 warning (0.03 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'CREATE TABLE t (i INT) DATA DIRECTORY '/var/mysql/data''
         rewritten to 'CREATE TABLE t (i INT) ' by a query rewrite plugin
1 row in set (0.00 sec)
```

Se o log de consulta geral ou o log binário estiver habilitado, o servidor escreve instruções para ele conforme aparecem após qualquer reescrita por `ddl_rewriter`.

Quando instalado, o `ddl_rewriter` expõe o instrumento de Performance Schema `memory/rewriter/ddl_rewriter` para rastrear o uso de memória do plugin. Ver Seção 29.12.20.10, Memory Summary Tables
