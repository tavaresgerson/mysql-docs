#### 7.9.1.7 Criando um Caso de Teste Se Você Encontrar Corrupção na Tabela

O procedimento a seguir se aplica às tabelas `MyISAM`. Para obter informações sobre os passos a serem seguidos ao encontrar corrupção na tabela `InnoDB`, consulte a Seção 1.6, “Como Relatar Bugs ou Problemas”.

Se você encontrar tabelas `MyISAM` corrompidas ou se o **mysqld** sempre falhar após alguns comandos de atualização, você pode testar se o problema é reprodutível fazendo o seguinte:

1. Parar o daemon do MySQL com **mysqladmin shutdown**.

2. Fazer um backup das tabelas para se proteger contra o caso improvável de que a reparação faça algo errado.

3. Verificar todas as tabelas com **myisamchk -s database/\*.MYI**. Reparar as tabelas corrompidas com **myisamchk -r database/*`table`*.MYI**.

4. Fazer um segundo backup das tabelas.

5. Remover (ou mover) quaisquer arquivos de log antigos do diretório de dados do MySQL, se você precisar de mais espaço.

6. Iniciar o **mysqld** com o log binário habilitado. Se você quiser encontrar um comando que faz o **mysqld** falhar, você deve iniciar o servidor com o log de consultas geral habilitado também. Consulte a Seção 7.4.3, “O Log de Consultas Geral”, e a Seção 7.4.4, “O Log Binário”.

7. Quando você tiver uma tabela que falhou, pare o servidor **mysqld**.

8. Restaure o backup.

9. Reinicie o servidor **mysqld *sem* o log binário habilitado.

10. Re-execute os comandos com **mysqlbinlog binary-log-file | mysql**. O log binário é salvo no diretório do banco de dados do MySQL com o nome `hostname-bin.NNNNNN`.

11. Se as tabelas forem corrompidas novamente ou se você conseguir fazer o **mysqld** morrer com o comando acima, você encontrou um erro reprodutível. Envie as tabelas e o log binário para o nosso banco de bugs usando as instruções da Seção 1.6, “Como relatar bugs ou problemas”. Se você é um cliente de suporte, pode usar o Centro de Suporte ao Cliente do MySQL (<https://www.mysql.com/support/>) para alertar a equipe do MySQL sobre o problema e fazê-lo ser corrigido o mais rápido possível.