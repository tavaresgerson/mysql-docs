## 16.3 Armazenamento Transacional de Dados do Dicionário

O esquema do dicionário de dados armazena os dados do dicionário em tabelas transacionais (`InnoDB`). As tabelas do dicionário de dados estão localizadas no banco de dados `mysql`, juntamente com as tabelas do sistema que não são de dados.

As tabelas do dicionário de dados são criadas em um único espaço de tabelas `InnoDB` chamado `mysql.ibd`, que reside no diretório de dados do MySQL. O arquivo do espaço de tabelas `mysql.ibd` deve residir no diretório de dados do MySQL e seu nome não pode ser modificado ou usado por outro espaço de tabelas.

Os dados do dicionário são protegidos pelas mesmas capacidades de commit, rollback e recuperação em caso de falha que protegem os dados do usuário que são armazenados em tabelas `InnoDB`.