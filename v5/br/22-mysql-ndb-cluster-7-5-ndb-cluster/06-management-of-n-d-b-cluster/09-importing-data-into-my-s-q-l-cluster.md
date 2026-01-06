### 21.6.9 Importando dados no MySQL Cluster

É comum, ao configurar uma nova instância do NDB Cluster, precisar importar dados de uma instância existente do NDB Cluster, de uma instância do MySQL ou de outra fonte. Esses dados geralmente estão disponíveis em um ou mais dos seguintes formatos:

- Um arquivo de exclusão SQL, como o produzido por **mysqldump** ou **mysqlpump**. Este pode ser importado usando o cliente **mysql**, conforme mostrado mais adiante nesta seção.

- Um arquivo CSV produzido por **mysqldump** ou outro programa de exportação. Esses arquivos podem ser importados no `NDB` usando `LOAD DATA INFILE` no cliente \[**mysql**]\(mysql.html], ou com o utilitário **ndb\_import** fornecido com a distribuição do NDB Cluster. Para mais informações sobre este último, consulte Seção 21.5.14, “ndb\_import — Importar dados CSV no NDB”.

- Um backup nativo do `NDB` produzido usando `START BACKUP` no cliente de gerenciamento do `NDB`. Para importar um backup nativo, você deve usar o programa **ndb\_restore** que vem como parte do NDB Cluster. Veja Seção 21.5.24, “ndb\_restore — Restaurar um backup do NDB Cluster” para obter mais informações sobre como usar esse programa.

Ao importar dados de um arquivo SQL, muitas vezes não é necessário impor transações ou chaves estrangeiras, e desativar temporariamente essas funcionalidades pode acelerar muito o processo de importação. Isso pode ser feito usando o cliente **mysql**, seja a partir de uma sessão do cliente ou invocando-o na linha de comando. Dentro de uma sessão do cliente **mysql**, você pode realizar a importação usando as seguintes instruções SQL:

```sql
SET ndb_use_transactions=0;
SET foreign_key_checks=0;

source path/to/dumpfile;

SET ndb_use_transactions=1;
SET foreign_key_checks=1;
```

Ao realizar a importação dessa maneira, você *deve* habilitar `ndb_use_transaction` e `foreign_key_checks` novamente após a execução do comando `source` do cliente **mysql**. Caso contrário, é possível que declarações posteriores na mesma sessão também sejam executadas sem a aplicação de transações ou restrições de chave estrangeira, o que pode levar à inconsistência dos dados.

A partir da shell do sistema, você pode importar o arquivo SQL enquanto desabilita a aplicação de transações e chaves estrangeiras usando o cliente **mysql** com a opção `--init-command`, da seguinte forma:

```sql
$> mysql --init-command='SET ndb_use_transactions=0; SET foreign_key_checks=0' < path/to/dumpfile
```

Também é possível carregar os dados em uma tabela `[InnoDB]` e, depois, convertê-los para usar o motor de armazenamento NDB usando `ALTER TABLE ... ENGINE NDB`). Você deve levar em consideração, especialmente para muitas tabelas, que isso pode exigir várias dessas operações; além disso, se chaves estrangeiras forem usadas, você deve prestar atenção à ordem das instruções `ALTER TABLE` com cuidado, devido ao fato de que as chaves estrangeiras não funcionam entre tabelas que usam motores de armazenamento MySQL diferentes.

Você deve estar ciente de que os métodos descritos anteriormente nesta seção não são otimizados para conjuntos de dados muito grandes ou transações grandes. Se uma aplicação realmente precisar de grandes transações ou muitas transações concorrentes como parte do funcionamento normal, você pode querer aumentar o valor do parâmetro de configuração do nó de dados `MaxNoOfConcurrentOperations`, que reserva mais memória para permitir que um nó de dados assuma uma transação se seu coordenador de transação parar inesperadamente.

Você também pode querer fazer isso ao realizar operações em massa de `DELETE` ou `UPDATE` em tabelas do NDB Cluster. Se possível, tente fazer com que as aplicações realizem essas operações em partes, por exemplo, adicionando `LIMIT` a essas instruções.

Se uma operação de importação de dados não for concluída com sucesso, por qualquer motivo, você deve estar preparado para realizar qualquer limpeza necessária, incluindo, possivelmente, uma ou mais instruções `DROP TABLE`, instruções `DROP DATABASE` ou ambas. Não fazer isso pode deixar o banco de dados em um estado inconsistente.
