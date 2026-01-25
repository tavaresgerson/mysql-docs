#### 14.10.2.2 Check de Compatibilidade Quando uma Tabela é Aberta

Quando uma tabela é acessada pela primeira vez, o InnoDB (incluindo algumas versões anteriores ao InnoDB 1.0) verifica se o *file format* do *tablespace* no qual a tabela está armazenada é totalmente suportado. Este *check* evita *crashes* ou corrupções que ocorreriam caso fossem encontradas tabelas usando uma estrutura de dados “muito nova”.

Todas as tabelas que utilizam qualquer *file format* suportado por uma versão podem ser lidas ou escritas (assumindo que o usuário tenha privilégios suficientes). A configuração do parâmetro de configuração do sistema `innodb_file_format` pode impedir a criação de uma nova tabela que use um *file format* específico, mesmo que esse *file format* seja suportado por uma determinada versão. Tal configuração pode ser usada para preservar a compatibilidade retroativa, mas não impede o acesso a qualquer tabela que utilize um formato suportado.

Versões do MySQL anteriores à 5.0.21 não conseguem usar de forma confiável *database files* criados por versões mais novas, caso um novo *file format* tenha sido usado quando a tabela foi criada. Para prevenir várias condições de erro ou corrupções, o InnoDB verifica a compatibilidade do *file format* quando abre um arquivo (por exemplo, no primeiro acesso a uma tabela). Se a versão do InnoDB atualmente em execução não suportar o *file format* identificado pelo tipo de tabela no *data dictionary* do InnoDB, o MySQL reporta o seguinte erro:

```sql
ERROR 1146 (42S02): Table 'test.t1' doesn't exist
```

O InnoDB também grava uma mensagem no *error log*:

```sql
InnoDB: table test/t1: unknown table type 33
```

O tipo de tabela deve ser igual aos *flags* do *tablespace*, que contém a versão do *file format*, conforme discutido na Seção 14.10.3, “Identificando o *File Format* em Uso”.

Versões do InnoDB anteriores ao MySQL 4.1 não incluíam identificadores de formato de tabela nos *database files*, e versões anteriores ao MySQL 5.0.21 não incluíam um *check* de compatibilidade de formato de tabela. Portanto, não há como garantir operações adequadas se uma tabela em um *file format* mais novo for usada com versões do InnoDB anteriores à 5.0.21.

A capacidade de gerenciamento de *file format* no InnoDB 1.0 e superior (*tagging* de *tablespace* e *checks* em tempo de execução) permite que o InnoDB verifique o mais rápido possível se a versão do software em execução pode processar corretamente as tabelas existentes no *database*.

Se você permitir que o InnoDB abra um *database* contendo arquivos em um formato que não é suportado (definindo o parâmetro `innodb_file_format_check` como `OFF`), o *checking* em nível de tabela descrito nesta seção ainda se aplica.

Os usuários são *fortemente* aconselhados a não usar *database files* que contenham tabelas no *file format* Barracuda com versões do InnoDB mais antigas do que o MySQL 5.1 com o InnoDB Plugin. Pode ser possível reconstruir tais tabelas para que usem o formato Antelope.