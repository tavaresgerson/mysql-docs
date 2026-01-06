### 13.1.34 Declaração `TRUNCATE TABLE`

```sql
TRUNCATE [TABLE] tbl_name
```

A opção `TRUNCATE TABLE` esvazia uma tabela completamente. Ela requer o privilégio `DROP`.

Logicamente, `TRUNCATE TABLE` é semelhante a uma instrução `DELETE` que exclui todas as linhas ou a sequência de instruções `DROP TABLE` e `CREATE TABLE`. Para alcançar um alto desempenho, ele ignora o método DML de exclusão de dados. Assim, ele não pode ser desfeito, não aciona gatilhos `ON DELETE` e não pode ser executado para tabelas `InnoDB` com relações de chave estrangeira pai-filho.

Embora `TRUNCATE TABLE` seja semelhante a `DELETE`, ele é classificado como uma instrução DDL (Data Definition Language) e não como uma instrução DML (Data Manipulation Language). Ele difere de `DELETE` da seguinte maneira:

- As operações de truncar e recriar a tabela são muito mais rápidas do que excluir linhas uma a uma, especialmente para tabelas grandes.

- As operações de truncação causam um commit implícito e, portanto, não podem ser desfeitas. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

- As operações de truncação não podem ser realizadas se a sessão tiver um bloqueio de tabela ativo.

- A instrução `TRUNCATE TABLE` falha para uma tabela `InnoDB` ou tabela `NDB` se houver quaisquer restrições `FOREIGN KEY` de outras tabelas que façam referência à tabela. Restrições de chave estrangeira entre colunas da mesma tabela são permitidas.

- As operações de truncação não retornam um valor significativo para o número de linhas excluídas. O resultado usual é “0 linhas afetadas”, que deve ser interpretado como “nenhuma informação”.

- Enquanto o arquivo de formato de tabela `tbl_name.frm` estiver válido, a tabela pode ser recriada como uma tabela vazia com `TRUNCATE TABLE`, mesmo que os arquivos de dados ou índice tenham sido corrompidos.

- Qualquer valor `AUTO_INCREMENT` é redefinido para seu valor inicial. Isso é verdadeiro mesmo para `MyISAM` e `InnoDB`, que normalmente não reutilizam os valores da sequência.

- Quando usado com tabelas particionadas, `TRUNCATE TABLE` preserva a partição; ou seja, os arquivos de dados e índice são excluídos e recriados, enquanto o arquivo de definição de partição (`.par`) não é afetado.

- A instrução `TRUNCATE TABLE` não invoca gatilhos `ON DELETE`.

A instrução `TRUNCATE TABLE` é tratada para fins de registro binário e replicação como DDL (Linguagem de Definição de Dados) e não como DML (Linguagem de Manipulação de Dados), e é sempre registrada como uma declaração.

A instrução `TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

Em um sistema com um grande pool de buffers `InnoDB` e o `innodb_adaptive_hash_index` habilitado, as operações de `TRUNCATE TABLE` podem causar uma queda temporária no desempenho do sistema devido a uma varredura LRU que ocorre ao remover entradas do índice hash adaptativo de uma tabela `InnoDB`. O problema foi resolvido para `DROP TABLE` no MySQL 5.5.23 (Bug
\#13704145, Bug #64284), mas permanece um problema conhecido para `TRUNCATE TABLE` (Bug #68184).

O comando `TRUNCATE TABLE` pode ser usado com as tabelas de resumo do Gerenciamento de Desempenho, mas o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Veja Seção 25.12.15, “Tabelas de Resumo do Gerenciamento de Desempenho”.
