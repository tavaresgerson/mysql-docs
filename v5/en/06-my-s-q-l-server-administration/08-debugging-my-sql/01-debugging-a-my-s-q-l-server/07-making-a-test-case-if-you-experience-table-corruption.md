#### 5.8.1.7 Criando um Caso de Teste Se Você Tiver Corrupção de Tabela

O procedimento a seguir se aplica a tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"). Para informações sobre as etapas a serem seguidas ao encontrar corrupção de tabela `InnoDB`, consulte [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

Se você encontrar tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") corrompidas ou se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") sempre falhar após algumas instruções de `UPDATE`, você pode testar se o problema é reproduzível fazendo o seguinte:

1. Pare o MySQL daemon com [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

2. Faça um Backup das tabelas para se proteger contra o caso muito improvável de o reparo causar algum dano.

3. Verifique todas as tabelas com [**myisamchk -s database/\*.MYI**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Repare quaisquer tabelas corrompidas com [**myisamchk -r database/*`table`*.MYI**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

4. Faça um segundo Backup das tabelas.
5. Remova (ou mova para outro local) quaisquer arquivos de Log antigos do diretório de dados do MySQL se você precisar de mais espaço.

6. Inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com o Binary Log habilitado. Se você deseja encontrar uma instrução que cause o `crash` do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), você também deve iniciar o servidor com o `general query log` habilitado. Consulte [Section 5.4.3, “The General Query Log”](query-log.html "5.4.3 The General Query Log") e [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

7. Quando você tiver uma tabela que sofreu `crash`, pare o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

8. Restaure o Backup.
9. Reinicie o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") *sem* o Binary Log habilitado.

10. Re-execute as instruções com [**mysqlbinlog binary-log-file | mysql**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"). O Binary Log é salvo no diretório do Database do MySQL com o nome `hostname-bin.NNNNNN`.

11. Se as tabelas estiverem corrompidas novamente ou se você conseguir fazer com que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") pare de funcionar com o comando acima, você encontrou um `bug` reproduzível. Envie as tabelas e o Binary Log via FTP para o nosso Database de `bugs` usando as instruções fornecidas em [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems"). Se você for um cliente de suporte, pode usar o MySQL Customer Support Center (<https://www.mysql.com/support/>) para alertar a equipe MySQL sobre o problema e ter o problema corrigido o mais rápido possível.