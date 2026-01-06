### 14.1.2 Melhores Práticas para Tabelas InnoDB

Esta seção descreve as melhores práticas ao usar as tabelas do InnoDB.

- Especifique uma chave primária para cada tabela usando a coluna ou colunas mais frequentemente consultadas, ou um valor de autoincremento se não houver uma chave primária óbvia.

- Use junções sempre que os dados forem extraídos de várias tabelas com base em valores de ID idênticos dessas tabelas. Para obter um desempenho de junção rápido, defina chaves estrangeiras nas colunas de junção e declare essas colunas com o mesmo tipo de dados em cada tabela. Adicionar chaves estrangeiras garante que as colunas referenciadas sejam indexadas, o que pode melhorar o desempenho. As chaves estrangeiras também propagam excluções e atualizações para todas as tabelas afetadas e impedem a inserção de dados em uma tabela filha se os IDs correspondentes não estiverem presentes na tabela pai.

- Desative o autocommit. Comitir centenas de vezes por segundo limita o desempenho (limitado pela velocidade de escrita do seu dispositivo de armazenamento).

- O grupo de operações DML relacionadas é organizado em transações ao serem delimitadas com as instruções `START TRANSACTION` e `COMMIT`. Embora você não queira realizar muitos commits, também não quer emitir grandes lotes de instruções `INSERT`, `UPDATE` ou `DELETE` que demoram horas sem serem confirmadas.

- Não use instruções `LOCK TABLES`. O `InnoDB` pode lidar com múltiplas sessões lendo e escrevendo na mesma tabela ao mesmo tempo sem sacrificar a confiabilidade ou o alto desempenho. Para obter acesso exclusivo de escrita a um conjunto de linhas, use a sintaxe `SELECT ... FOR UPDATE` para bloquear apenas as linhas que você pretende atualizar.

- Ative a variável `innodb_file_per_table` ou use espaços de tabela gerais para colocar os dados e índices das tabelas em arquivos separados, em vez do espaço de tabela do sistema. A variável `innodb_file_per_table` é ativada por padrão.

- Avalie se seus padrões de dados e acesso se beneficiam das funcionalidades de compressão de tabelas ou páginas do `InnoDB`. Você pode comprimir tabelas `InnoDB` sem sacrificar a capacidade de leitura/escrita.

- Execute o servidor com a opção `--sql_mode=NO_ENGINE_SUBSTITUTION` para evitar que tabelas sejam criadas com motores de armazenamento que você não deseja usar.
