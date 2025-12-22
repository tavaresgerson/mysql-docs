#### 7.6.7.14 Limitações do Plugin Clone

O plugin clone está sujeito a estas limitações:

- Uma instância não pode ser clonada a partir de uma série de servidor MySQL diferente. Por exemplo, você não pode clonar entre o MySQL 8.0 e o MySQL 8.4, mas pode clonar dentro de uma série como o MySQL 8.4.1 e o MySQL 8.4.13.
- Apenas uma única instância MySQL pode ser clonada de cada vez. Clonar várias instâncias MySQL em uma única operação de clonagem não é suportado.
- A porta do Protocolo X especificada por `mysqlx_port` não é suportada para operações de clonagem remota (quando especificar o número de porta da instância do servidor MySQL doador em uma instrução `CLONE INSTANCE`.
- O plugin de clone não suporta clonagem de configurações de servidor MySQL. A instância de servidor MySQL destinatário mantém sua configuração, incluindo configurações de variáveis persistentes do sistema (ver Seção 7.1.9.3, "Variáveis persistentes do sistema")
- O plugin clone não suporta clonagem de logs binários.
- O plugin clone só clona dados armazenados no `InnoDB`. Outros dados do mecanismo de armazenamento não são clonados. `MyISAM` e `CSV` tabelas armazenadas em qualquer esquema incluindo o `sys` esquema são clonadas como tabelas vazias.
- A conexão com a instância do servidor MySQL doador através do Roteador MySQL não é suportada.
- As operações de clonagem local não suportam a clonagem de tablespaces gerais que foram criados com um caminho absoluto. Um arquivo de tablespace clonado com o mesmo caminho do arquivo de tablespace de origem causaria um conflito.
