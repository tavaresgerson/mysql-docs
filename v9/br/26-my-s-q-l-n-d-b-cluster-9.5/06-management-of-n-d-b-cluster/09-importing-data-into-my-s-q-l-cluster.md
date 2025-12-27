### 25.6.9 Importando Dados no MySQL Cluster

É comum, ao configurar uma nova instância do NDB Cluster, precisar importar dados de uma instância existente do NDB Cluster, de uma instância do MySQL ou de outra fonte. Esses dados geralmente estão disponíveis em um ou mais dos seguintes formatos:

* Um arquivo de exclusão SQL, como o produzido pelo **mysqldump**. Esse arquivo pode ser importado usando o cliente **mysql**, como mostrado mais adiante nesta seção.

* Um arquivo CSV produzido pelo **mysqldump** ou outro programa de exportação. Esses arquivos podem ser importados no `NDB` usando o comando `LOAD DATA INFILE` no cliente **mysql**, ou com o utilitário **ndb\_import** fornecido com a distribuição do NDB Cluster. Para mais informações sobre este último, consulte a Seção 25.5.13, “ndb\_import — Importar Dados CSV no NDB”.

* Um backup nativo do `NDB` produzido usando o comando `START BACKUP` no cliente de gerenciamento do `NDB`. Para importar um backup nativo, você deve usar o programa **ndb\_restore** que vem como parte do NDB Cluster. Consulte a Seção 25.5.23, “ndb\_restore — Restaurar um Backup do NDB Cluster”, para mais informações sobre o uso deste programa.

Ao importar dados de um arquivo SQL, muitas vezes não é necessário impor transações ou chaves estrangeiras, e desabilitar temporariamente essas funcionalidades pode acelerar muito o processo de importação. Isso pode ser feito usando o cliente **mysql**, seja de uma sessão do cliente, ou invocando-o na linha de comando. Dentro de uma sessão do cliente **mysql**, você pode realizar a importação usando as seguintes instruções SQL:

```
SET ndb_use_transactions=0;
SET foreign_key_checks=0;

source path/to/dumpfile;

SET ndb_use_transactions=1;
SET foreign_key_checks=1;
```

Ao realizar a importação dessa forma, você *deve* habilitar `ndb_use_transaction` e `foreign_key_checks` novamente após a execução do comando `source` do cliente **mysql**. Caso contrário, é possível que declarações posteriores na mesma sessão também sejam executadas sem a aplicação de transações ou restrições de chave estrangeira, o que pode levar à inconsistência dos dados.

Do shell do sistema, você pode importar o arquivo SQL enquanto desabilita a aplicação de transações e chaves estrangeiras usando o cliente **mysql** com a opção `--init-command`, assim:

```
$> mysql --init-command='SET ndb_use_transactions=0; SET foreign_key_checks=0' < path/to/dumpfile
```

Também é possível carregar os dados em uma tabela `InnoDB` e convertê-los para usar o motor de armazenamento `NDB` posteriormente usando ALTER TABLE ... ENGINE NDB). Você deve levar em consideração, especialmente para muitas tabelas, que isso pode exigir várias operações desse tipo; além disso, se chaves estrangeiras forem usadas, você deve prestar atenção à ordem das declarações `ALTER TABLE` cuidadosamente, devido ao fato de que as chaves estrangeiras não funcionam entre tabelas que usam diferentes motores de armazenamento MySQL.

Você deve estar ciente de que os métodos descritos anteriormente nesta seção não são otimizados para conjuntos de dados muito grandes ou transações grandes. Se uma aplicação realmente precisar de grandes transações ou muitas transações concorrentes como parte da operação normal, você pode querer aumentar o valor do parâmetro de configuração do nó de dados `MaxNoOfConcurrentOperations`, que reserva mais memória para permitir que um nó de dados assuma uma transação se seu coordenador de transação parar inesperadamente.

Você também pode querer fazer isso ao realizar operações de `DELETE` ou `UPDATE` em massa em tabelas do NDB Cluster. Se possível, tente fazer com que as aplicações realizem essas operações em lotes, por exemplo, adicionando `LIMIT` a tais declarações.

Se uma operação de importação de dados não for concluída com sucesso, por qualquer motivo, você deve estar preparado para realizar qualquer limpeza necessária, incluindo, possivelmente, uma ou mais instruções `DROP TABLE` ou `DROP DATABASE`, ou ambas. Não fazer isso pode deixar o banco de dados em um estado inconsistente.