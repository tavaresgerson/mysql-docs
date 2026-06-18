#### 7.6.7.14 Limitações do Plugin de Clonagem

O plugin de clone está sujeito a essas limitações:

- Uma instância não pode ser clonada a partir de uma série diferente do servidor MySQL. Por exemplo, você não pode clonar entre MySQL 8.0 e MySQL 8.4, mas pode clonar dentro de uma série, como MySQL 8.0.37 e MySQL 8.0.42. Antes de 8.0.37, o número da versão pontual também tinha que corresponder, então não é permitido clonar coisas como 8.0.36 para 8.0.42 ou vice-versa

- Antes do MySQL 8.0.27, o DDL no doador e no destinatário, incluindo `TRUNCATE TABLE`, não é permitido durante uma operação de clonagem. Essa limitação deve ser considerada ao selecionar as fontes de dados. Uma solução é usar instâncias dedicadas do doador, que podem acomodar operações de DDL sendo bloqueadas enquanto os dados estão sendo clonados. O DML concorrente é permitido.

  A partir do MySQL 8.0.27, o DDL concorrente no doador é permitido por padrão. O suporte para DDL concorrente no doador é controlado pela variável `clone_block_ddl`. Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

- A clonagem de uma instância de servidor MySQL doador para uma instância de servidor MySQL de correção de falhas da mesma versão e versão é suportada apenas com o MySQL 8.0.26 e versões superiores.

- Apenas uma única instância do MySQL pode ser clonada de cada vez. A clonagem de múltiplas instâncias do MySQL em uma única operação de clonagem não é suportada.

- O protocolo X da porta especificada por `mysqlx_port` não é suportado para operações de clonagem remota (ao especificar o número da porta da instância do servidor MySQL do doador em uma declaração `CLONE INSTANCE`).

- O plugin de clonagem não suporta a clonagem de configurações de servidores MySQL. A instância do servidor MySQL destinatário mantém sua configuração, incluindo as configurações persistentes de variáveis do sistema (consulte a Seção 7.1.9.3, “Variáveis de Sistema Persistentes”.)

- O plugin de clone não suporta o clone de logs binários.

- O plugin de clone apenas copia os dados armazenados em `InnoDB`. Os dados de outros mecanismos de armazenamento não são clonados. As tabelas `MyISAM` e `CSV` armazenadas em qualquer esquema, incluindo o esquema `sys`, são clonadas como tabelas vazias.

- A conexão com a instância do servidor MySQL do doador por meio do MySQL Router não é suportada.

- As operações de clonagem locais não suportam a clonagem de espaços de tabela gerais criados com um caminho absoluto. Um arquivo de espaço de tabela clonado com o mesmo caminho que o arquivo de espaço de tabela de origem causaria um conflito.
