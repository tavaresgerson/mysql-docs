### 15.1.42 Declaração `TRUNCATE TABLE`

```
TRUNCATE [TABLE] tbl_name
```

A declaração `TRUNCATE TABLE` esvazia uma tabela completamente. Ela requer o privilégio `DROP`. Logicamente, `TRUNCATE TABLE` é semelhante a uma declaração `DELETE` que exclui todas as linhas, ou a uma sequência de declarações `DROP TABLE` e `CREATE TABLE`.

Para obter alto desempenho, `TRUNCATE TABLE` ignora o método DML de exclusão de dados. Assim, ela não aciona gatilhos `ON DELETE`, não pode ser realizada para tabelas `InnoDB` com relações de chave estrangeira pai-filho, e não pode ser revertida como uma operação DML. No entanto, operações `TRUNCATE TABLE` em tabelas que usam um motor de armazenamento suportado por DDL atômico são totalmente comprometidas ou revertidas se o servidor parar durante sua operação. Para mais informações, consulte a Seção 15.1.1, “Suporte a Declarações de Definição de Dados Atômicos”.

Embora `TRUNCATE TABLE` seja semelhante a `DELETE`, ela é classificada como uma declaração DDL, e não DML. Ela difere de `DELETE` da seguinte maneira:

* As operações de truncar excluem e recriam a tabela, o que é muito mais rápido do que excluir linhas uma a uma, particularmente para tabelas grandes.

* As operações de truncar causam um commit implícito, e portanto não podem ser revertidas. Veja a Seção 15.3.3, “Declarações que Causam um Commit Implícito”.

* As operações de truncar não podem ser realizadas se a sessão tiver um bloqueio de tabela ativo.

* `TRUNCATE TABLE` falha para uma tabela `InnoDB` ou `NDB` se houver quaisquer restrições `FOREIGN KEY` de outras tabelas que fazem referência à tabela. Restrições de chave estrangeira entre colunas da mesma tabela são permitidas.

* As operações de truncar não retornam um valor significativo para o número de linhas excluídas. O resultado usual é “0 linhas afetadas”, que deve ser interpretado como “nenhuma informação”.

* Enquanto a definição da tabela for válida, a tabela pode ser recriada como uma tabela vazia com `TRUNCATE TABLE`, mesmo que os arquivos de dados ou de índice tenham sido corrompidos.

* Qualquer valor `AUTO_INCREMENT` é redefinido para seu valor inicial. Isso é verdadeiro mesmo para `MyISAM` e `InnoDB`, que normalmente não reutilizam os valores das sequências.

* Quando usado com tabelas particionadas, `TRUNCATE TABLE` preserva a partição; ou seja, os arquivos de dados e de índice são excluídos e recriados, enquanto as definições de partição não são afetadas.

* A instrução `TRUNCATE TABLE` não invoca gatilhos `ON DELETE`.

* A truncagem de uma tabela `InnoDB` corrompida é suportada.

`TRUNCATE TABLE` é tratado para fins de registro binário e replicação como DDL em vez de DML, e é sempre registrado como uma instrução.

`TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

`TRUNCATE TABLE` pode ser usado com tabelas de resumos do Schema de Desempenho, mas o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Veja a Seção 29.12.20, “Tabelas de Resumo do Schema de Desempenho”.

O truncamento de uma tabela `InnoDB` que reside em um espaço de tabelas por arquivo cria um novo espaço de tabelas. Se o espaço de tabelas foi criado com uma versão anterior e reside em um diretório desconhecido, o `InnoDB` cria o novo espaço de tabelas na localização padrão e escreve o seguinte aviso no log de erro: A localização do diretório DATA deve estar em um diretório conhecido. A localização do diretório DATA será ignorada e o arquivo será colocado na localização padrão do datadir. Diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`. Para que o `TRUNCATE TABLE` crie o espaço de tabelas na sua localização atual, adicione o diretório à configuração `innodb_directories` antes de executar `TRUNCATE TABLE`.