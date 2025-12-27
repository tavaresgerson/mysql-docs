#### 7.6.7.14 Limitações do Plugin de Clonagem

O plugin de clonagem está sujeito a essas limitações:

* Uma instância não pode ser clonada a partir de uma série de servidores MySQL diferente. Por exemplo, você não pode clonar entre MySQL 8.0 e MySQL 8.4, mas pode clonar dentro de uma série, como MySQL 8.4.1 e MySQL 8.4.13.
* Apenas uma única instância MySQL pode ser clonada de cada vez. A clonagem de múltiplas instâncias MySQL em uma única operação de clonagem não é suportada.
* O protocolo X especificado pelo `mysqlx_port` não é suportado para operações de clonagem remota (ao especificar o número de porta do servidor MySQL da instância do servidor doador em uma declaração `CLONE INSTANCE`).
* O plugin de clonagem não suporta a clonagem de configurações do servidor MySQL. A instância do servidor MySQL receptora retém sua configuração, incluindo as configurações de variáveis de sistema persistentes (consulte a Seção 7.1.9.3, “Variáveis de Sistema Pessistidas”).
* O plugin de clonagem não suporta a clonagem de logs binários.
* O plugin de clonagem clona apenas dados armazenados no `InnoDB`. Os dados de outros mecanismos de armazenamento não são clonados. As tabelas `MyISAM` e `CSV` armazenadas em qualquer esquema, incluindo o esquema `sys`, são clonadas como tabelas vazias.
* A conexão à instância do servidor MySQL doador através do MySQL Router não é suportada.
* As operações de clonagem local não suportam a clonagem de espaços de tabelas gerais que foram criados com um caminho absoluto. Um arquivo de espaço de tabela clonado com o mesmo caminho que o arquivo de espaço de tabela da fonte causaria um conflito.