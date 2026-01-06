#### 14.10.2.2 Verificação de compatibilidade ao abrir uma tabela

Quando uma tabela é acessada pela primeira vez, o InnoDB (incluindo algumas versões anteriores à versão 1.0 do InnoDB) verifica se o formato de arquivo do espaço de tabela em que a tabela está armazenada é totalmente suportado. Essa verificação previne falhas ou corrupções que, de outra forma, ocorreriam quando tabelas que usam uma estrutura de dados "muito nova" são encontradas.

Todas as tabelas que utilizam qualquer formato de arquivo suportado por uma versão podem ser lidas ou escritas (assumindo que o usuário tenha privilégios suficientes). A configuração do parâmetro de configuração do sistema `innodb_file_format` pode impedir a criação de uma nova tabela que utilize um formato de arquivo específico, mesmo que o formato de arquivo seja suportado por uma determinada versão. Tal configuração pode ser usada para preservar a compatibilidade com versões anteriores, mas não impede o acesso a qualquer tabela que utilize um formato suportado.

Versões do MySQL mais antigas que 5.0.21 não podem usar confiavelmente arquivos de banco de dados criados por versões mais recentes se um novo formato de arquivo foi usado quando uma tabela foi criada. Para evitar várias condições de erro ou corrupções, o InnoDB verifica a compatibilidade do formato de arquivo quando abre um arquivo (por exemplo, ao primeiro acesso a uma tabela). Se a versão atualmente em execução do InnoDB não suportar o formato de arquivo identificado pelo tipo de tabela no dicionário de dados do InnoDB, o MySQL relata o seguinte erro:

```sql
ERROR 1146 (42S02): Table 'test.t1' doesn't exist
```

O InnoDB também escreve uma mensagem no log de erro:

```sql
InnoDB: table test/t1: unknown table type 33
```

O tipo de tabela deve ser igual às bandeiras do espaço de tabelas, que contém a versão do formato de arquivo, conforme discutido na Seção 14.10.3, “Identificando o Formato de Arquivo em Uso”.

As versões do InnoDB anteriores ao MySQL 4.1 não incluíam identificadores de formato de tabela nos arquivos do banco de dados, e as versões anteriores ao MySQL 5.0.21 não incluíam uma verificação de compatibilidade de formato de tabela. Portanto, não há como garantir operações corretas se uma tabela em um formato de arquivo mais recente for usada com versões do InnoDB anteriores a 5.0.21.

A capacidade de gerenciamento de formatos de arquivo no InnoDB 1.0 e versões superiores (marcação de espaço de tabela e verificações em tempo de execução) permite que o InnoDB verifique o mais rápido possível se a versão em execução do software pode processar adequadamente as tabelas existentes no banco de dados.

Se você permitir que o InnoDB abra um banco de dados contendo arquivos em um formato que ele não suporta (definindo o parâmetro `innodb_file_format_check` para `OFF`), o controle de nível de tabela descrito nesta seção ainda se aplica.

Os usuários são **extremamente** incentivados a não usar arquivos de banco de dados que contenham tabelas no formato de arquivo Barracuda com versões do InnoDB mais antigas do que o MySQL 5.1 com o Plugin InnoDB. Pode ser possível reconstruir essas tabelas para usar o formato Antelope.
