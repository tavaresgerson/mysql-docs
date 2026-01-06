#### 5.8.1.7 Criar um Caso de Teste Se Você Experimente a Corrupção da Tabela

O procedimento a seguir se aplica às tabelas ``MyISAM`. Para obter informações sobre os passos a serem seguidos ao encontrar corrupção de tabelas `InnoDB\`, consulte Seção 1.5, “Como relatar erros ou problemas”.

Se você encontrar tabelas corrompidas do `MyISAM` ou se o **mysqld** sempre falhar após alguns comandos de atualização, você pode testar se o problema é reprodutível fazendo o seguinte:

1. Pare o daemon do MySQL com **mysqladmin shutdown**.

2. Faça um backup das tabelas para se proteger contra o caso improvável de que a reparação faça algo errado.

3. Verifique todas as tabelas com **myisamchk -s banco de dados/\*.MYI**. Repara quaisquer tabelas corrompidas com **myisamchk -r banco de dados/*`table`*.MYI**.

4. Faça um segundo backup das tabelas.

5. Se precisar de mais espaço, remova (ou mova) todos os arquivos de log antigos do diretório de dados do MySQL.

6. Inicie o **mysqld** com o log binário habilitado. Se você quiser encontrar uma declaração que faz o **mysqld** parar, você deve iniciar o servidor com o log de consultas gerais habilitado também. Veja Seção 5.4.3, “O Log de Consultas Gerais” e Seção 5.4.4, “O Log Binário”.

7. Quando você tiver uma tabela quebrada, pare o servidor **mysqld**.

8. Restaure o backup.

9. Reinicie o servidor **mysqld** *sem* o log binário ativado.

10. Execute novamente as declarações com **mysqlbinlog binary-log-file | mysql**. O log binário é salvo no diretório do banco de dados MySQL com o nome `hostname-bin.NNNNNN`.

11. Se as tabelas forem corrompidas novamente ou você conseguir fazer o **mysqld** falhar com o comando acima, você encontrou um erro reprodutível. Envie as tabelas e o log binário para o nosso banco de bugs usando as instruções fornecidas na Seção 1.5, “Como Relatar Bugs ou Problemas”. Se você é um cliente de suporte, pode usar o Centro de Suporte ao Cliente do MySQL (<https://www.mysql.com/support/>) para alertar a equipe do MySQL sobre o problema e fazê-lo ser corrigido o mais rápido possível.
