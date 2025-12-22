#### 7.9.1.7 Fazer um caso de teste se você experimentar corrupção de mesa

O procedimento a seguir aplica-se às tabelas `MyISAM`. Para obter informações sobre as etapas a serem seguidas quando se deparar com a corrupção da tabela `InnoDB`, consulte a Seção 1.6, "Como relatar bugs ou problemas".

Se você encontrar tabelas `MyISAM` corrompidas ou se `mysqld` falhar sempre após algumas instruções de atualização, você pode testar se o problema é reproduzível fazendo o seguinte:

1. Parar o demônio MySQL com **mysqladmin shutdown**.
2. Faça um backup das mesas para evitar o caso muito improvável de que a reparação faça algo de errado.
3. Verifique todas as tabelas com o **myisamchk -s database/\*.MYI**. Repare todas as tabelas corrompidas com o **myisamchk -r database/`table`.MYI**.
4. Faça um segundo backup das mesas.
5. Remova (ou afaste) todos os arquivos de registro antigos do diretório de dados MySQL se você precisar de mais espaço.
6. Inicie `mysqld` com o log binário habilitado. Se você quiser encontrar uma instrução que falha `mysqld`, você deve iniciar o servidor com o log de consulta geral habilitado também. Veja Seção 7.4.3, O Log de consulta geral, e Seção 7.4.4, O Log Binário.
7. Quando você tiver uma mesa quebrada, pare o servidor mysqld.
8. Restaurar o backup.
9. Reinicie o servidor mysqld sem o log binário habilitado.
10. Re-executar as instruções com **mysqlbinlog binary-log-file. mysql**. O log binário é salvo no diretório da base de dados MySQL com o nome `hostname-bin.NNNNNN`.
11. Se as tabelas estiverem corrompidas novamente ou você conseguir que `mysqld` morra com o comando acima, você encontrou um bug reprodutível. FTP as tabelas e o log binário para o nosso banco de dados de bugs usando as instruções dadas na Seção 1.6, "Como relatar bugs ou problemas". Se você é um cliente de suporte, você pode usar o MySQL Customer Support Center (\[<https://www.mysql.com/support/>]<https://www.mysql.com/support/>)) para alertar a equipe do MySQL sobre o problema e consertá-lo o mais rápido possível.
