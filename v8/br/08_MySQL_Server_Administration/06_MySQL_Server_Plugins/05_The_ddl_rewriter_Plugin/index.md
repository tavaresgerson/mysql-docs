### 7.6.5 O Plugin ddl\_rewriter

7.6.5.1 Instalar ou desinstalar o ddl\_rewriter

7.6.5.2 Opções do Plugin ddl\_rewriter

O MySQL 8.0.16 e versões superiores incluem um plugin `ddl_rewriter` que modifica as instruções `CREATE TABLE` recebidas pelo servidor antes de analisá-las e executá-las. O plugin remove as cláusulas `ENCRYPTION`, `DATA DIRECTORY` e `INDEX DIRECTORY`, o que pode ser útil ao restaurar tabelas a partir de arquivos de dump SQL criados a partir de bancos de dados criptografados ou que têm suas tabelas armazenadas fora do diretório de dados. Por exemplo, o plugin pode permitir a restauração desses arquivos de dump em uma instância não criptografada ou em um ambiente onde os caminhos fora do diretório de dados não são acessíveis.

Antes de usar o plugin `ddl_rewriter`, instale-o de acordo com as instruções fornecidas na Seção 7.6.5.1, “Instalando ou Desinstalando ddl\_rewriter”.

`ddl_rewriter` analisa as instruções SQL recebidas pelo servidor antes da análise, reescrevendo-as de acordo com essas condições:

- `ddl_rewriter` considera apenas as declarações `CREATE TABLE` e apenas se elas forem declarações isoladas que ocorrem no início de uma linha de entrada ou no início do texto de uma declaração preparada. `ddl_rewriter` não considera as declarações `CREATE TABLE` dentro das definições de programas armazenados. As declarações podem se estender por várias linhas.

- Nas declarações consideradas para reescrita, as instâncias das seguintes cláusulas são reescritas e cada instância substituída por um único espaço:

  - `ENCRYPTION`

  - `DATA DIRECTORY` (nos níveis de tabela e partição)

  - `INDEX DIRECTORY` (nos níveis de tabela e partição)

- A reescrita não depende da maiúscula ou minúscula.

Se `ddl_rewriter` reescrever uma declaração, ele gera uma mensagem de alerta:

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

Se o log de consulta geral ou o log binário estiverem habilitados, o servidor escreve nele as instruções conforme elas aparecem após qualquer reescrita por `ddl_rewriter`.

Quando instalado, o `ddl_rewriter` expõe o instrumento do Schema de Desempenho `memory/rewriter/ddl_rewriter` para monitorar o uso da memória do plugin. Veja a Seção 29.12.20.10, “Tabelas de Resumo de Memória”
