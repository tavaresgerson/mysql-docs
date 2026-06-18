### 15.1.37 Declaração `TRUNCATE TABLE`

```
TRUNCATE [TABLE] tbl_name
```

`TRUNCATE TABLE` esvazia uma tabela completamente. Requer o privilégio `DROP`. Logicamente, `TRUNCATE TABLE` é semelhante a uma instrução `DELETE` que exclui todas as linhas, ou a uma sequência de instruções `DROP TABLE` e `CREATE TABLE`.

Para alcançar alto desempenho, `TRUNCATE TABLE` evita o método DML de exclusão de dados. Assim, ele não aciona os gatilhos `ON DELETE` e não pode ser executado para tabelas `InnoDB` com relações de chave estrangeira pai-filho, e não pode ser desfeito como uma operação DML. No entanto, as operações `TRUNCATE TABLE` em tabelas que usam um mecanismo de armazenamento que suporta DDL atômico são totalmente comprometidas ou desfeitas se o servidor interromper durante sua operação. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômicos”.

Embora `TRUNCATE TABLE` seja semelhante a `DELETE`, ele é classificado como uma instrução DDL (Data Definition Language) e não como uma instrução DML (Data Manipulation Language). Ele difere de `DELETE` da seguinte maneira:

- As operações de truncar e recriar a tabela são muito mais rápidas do que excluir linhas uma a uma, especialmente para tabelas grandes.

- As operações de truncação causam um commit implícito e, portanto, não podem ser desfeitas. Veja a Seção 15.3.3, “Instruções que causam um commit implícito”.

- As operações de truncação não podem ser realizadas se a sessão tiver um bloqueio de tabela ativo.

- `TRUNCATE TABLE` falha para uma tabela `InnoDB` ou tabela `NDB` se houver quaisquer restrições `FOREIGN KEY` de outras tabelas que façam referência à tabela. Restrições de chave estrangeira entre colunas da mesma tabela são permitidas.

- As operações de truncação não retornam um valor significativo para o número de linhas excluídas. O resultado usual é “0 linhas afetadas”, que deve ser interpretado como “nenhuma informação”.

- Enquanto a definição da tabela for válida, a tabela pode ser recriada como uma tabela vazia com `TRUNCATE TABLE`, mesmo que os arquivos de dados ou de índice tenham sido corrompidos.

- Qualquer valor `AUTO_INCREMENT` é redefinido para seu valor inicial. Isso vale mesmo para `MyISAM` e `InnoDB`, que normalmente não reutilizam valores de sequência.

- Quando usado com tabelas particionadas, `TRUNCATE TABLE` preserva a partição; ou seja, os arquivos de dados e de índice são excluídos e recriados, enquanto as definições de partição não são afetadas.

- A declaração `TRUNCATE TABLE` não invoca gatilhos `ON DELETE`.

- A truncação de uma tabela corrompida `InnoDB` é suportada.

`TRUNCATE TABLE` é tratado para fins de registro binário e replicação como DDL em vez de DML, e é sempre registrado como uma declaração.

`TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

No MySQL 5.7 e versões anteriores, em um sistema com um grande pool de buffers e o `innodb_adaptive_hash_index` habilitado, uma operação `TRUNCATE TABLE` poderia causar uma queda temporária no desempenho do sistema devido a uma varredura LRU que ocorria ao remover as entradas do índice de hash adaptativo da tabela (Bug #68184). A remapeamento de `TRUNCATE TABLE` para `DROP TABLE` e `CREATE TABLE` no MySQL 8.0 evita a varredura LRU problemática.

O `TRUNCATE TABLE` pode ser usado com as tabelas de resumo do Schema de Desempenho, mas o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Veja a Seção 29.12.20, “Tabelas de Resumo do Schema de Desempenho”.

A truncação de uma tabela `InnoDB` que reside em um espaço de tabelas por arquivo elimina o espaço de tabelas existente e cria um novo. A partir do MySQL 8.0.21, se o espaço de tabelas foi criado com uma versão anterior e reside em um diretório desconhecido, `InnoDB` cria o novo espaço de tabelas na localização padrão e escreve o seguinte aviso no log de erro: A localização do diretório DATA deve estar em um diretório conhecido. A localização do diretório DATA será ignorada e o arquivo será colocado na localização padrão do datadir. Diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`. Para que `TRUNCATE TABLE` crie o espaço de tabelas na sua localização atual, adicione o diretório à configuração `innodb_directories` antes de executar `TRUNCATE TABLE`.
